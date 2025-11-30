import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AzureOpenAI } from 'openai';
import * as ffmpeg from 'fluent-ffmpeg';
import * as ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { randomUUID } from 'crypto';
import { Readable } from 'stream';
import { finished } from 'stream/promises';

@Injectable()
export class AiService {
  private client: AzureOpenAI;
  private deploymentId: string;

  constructor(private configService: ConfigService) {
    const endpoint = this.configService.get<string>('AZURE_OPENAI_ENDPOINT');
    const apiKey = this.configService.get<string>('AZURE_OPENAI_API_KEY');
    // Using gpt-5.1-codex-mini as configured. If it doesn't support vision, this will need adjustment.
    this.deploymentId = this.configService.get<string>('AZURE_OPENAI_DEPLOYMENT_ID') || 'gpt-5.1-codex-mini';

    ffmpeg.setFfmpegPath(ffmpegInstaller.path);

    if (endpoint && apiKey) {
      try {
        this.client = new AzureOpenAI({
          endpoint,
          apiKey,
          apiVersion: '2024-05-01-preview',
        });
      } catch (e) {
        console.error('Failed to initialize OpenAI client:', e);
      }
    } else {
        console.warn('Azure OpenAI credentials not found. AI analysis will NOT work.');
    }
  }

  async analyzeVideo(video: { url: string; filename: string }): Promise<any> {
    if (!this.client) {
        console.error("AI Client not initialized. Cannot perform analysis.");
        // Throwing an error here to indicate failure to the caller.
        throw new Error('AI Client not initialized. Check credentials and endpoint.');
    }

    const tempDir = os.tmpdir();
    const inputPath = path.join(tempDir, `${randomUUID()}-${video.filename}`);
    const framesDir = path.join(tempDir, `${randomUUID()}-frames`);

    try {
        // 1. Download Video from Blob Storage URL
        await this.downloadFile(video.url, inputPath);

        // 2. Extract Frames
        if (!fs.existsSync(framesDir)) {
            fs.mkdirSync(framesDir);
        }
        await this.extractFrames(inputPath, framesDir, 5); // Extract 5 frames

        // 3. Read Frames and prepare for OpenAI API
        const frameFiles = fs.readdirSync(framesDir).filter(f => f.startsWith('screenshot-')).sort((a, b) => {
            const numA = parseInt(a.match(/screenshot-(\d+)\.jpg/)[1]);
            const numB = parseInt(b.match(/screenshot-(\d+)\.jpg/)[1]);
            return numA - numB;
        });

        if (frameFiles.length === 0) {
            throw new Error('No frames extracted from video. Check ffmpeg setup or video file integrity.');
        }

        const imageContent = frameFiles.map(file => {
            const bitmap = fs.readFileSync(path.join(framesDir, file));
            return {
                type: 'image_url' as const,
                image_url: {
                    url: `data:image/jpeg;base64,${bitmap.toString('base64')}`
                }
            };
        });

        // 4. Analyze with GPT-5.1 (assuming it has vision capabilities)
        // If gpt-5.1-codex-mini does not support vision, this will fail. 
        // We should ensure the configured deploymentId points to a multimodal model.
        const response = await this.client.chat.completions.create({
            model: this.deploymentId, // Use the deployment configured in env vars
            messages: [
                {
                    role: 'system',
                    content: 'You are an expert video marketing analyst. Analyze the provided video frames and provide a JSON response with the following structure: { "overallScore": number (0-100), "summary": string, "details": { "hook": { "score": number, "feedback": string }, "pacing": { "score": number, "feedback": string }, "visuals": { "score": number, "feedback": string }, "cta": { "score": number, "feedback": string } } }. Respond ONLY with the JSON object, do not include any other text or markdown. If any detail is not applicable, use score: 0 and empty feedback string. Ensure scores are integers between 0 and 100.'
                },
                {
                    role: 'user',
                    content: [
                        { type: 'text', text: `Analyze the video for ${video.filename}. Provide detailed feedback for hook, pacing, visuals, and CTA.` },
                        ...imageContent
                    ]
                }
            ],
            response_format: { type: 'json_object' } // Ensure response is JSON
        });

        const content = response.choices[0].message.content;
        // Basic validation to ensure we got some JSON content before parsing
        if (!content) {
            throw new Error('Received empty response from AI model.');
        }
        return JSON.parse(content);

    } catch (e) {
        console.error('Error during AI analysis:', e);
        // Re-throw or return a specific error object if necessary
        throw new Error('AI analysis failed. Please try again.');
    } finally {
        // Cleanup temporary files
        if (fs.existsSync(inputPath)) {
            try { fs.unlinkSync(inputPath); } catch (err) { console.error('Error removing temp video file:', err); }
        }
        if (fs.existsSync(framesDir)) {
            fs.readdirSync(framesDir).forEach(file => {
                try { fs.unlinkSync(path.join(framesDir, file)); } catch (err) { console.error('Error removing temp frame file:', err); }
            });
            try { fs.rmdirSync(framesDir); } catch (err) { console.error('Error removing temp frames directory:', err); }
        }
    }
  }

  private async downloadFile(url: string, dest: string) {
      const response = await fetch(url);
      if (!response.ok) {
          throw new Error(`Failed to download file from ${url}: ${response.statusText}`);
      }
      const fileStream = fs.createWriteStream(dest, { flags: 'wx' }); // 'wx' flag fails if file exists
      // Pipe the stream and wait for it to finish
      // @ts-ignore
      await finished(Readable.fromWeb(response.body).pipe(fileStream));
  }

  private extractFrames(input: string, outputDir: string, count: number): Promise<void> {
      return new Promise((resolve, reject) => {
          ffmpeg(input)
            .screenshots({
                count: count,
                folder: outputDir,
                filename: 'screenshot-%i.jpg',
                size: '640x?' // Keep resolution reasonable for token limits and processing time
            })
            .on('end', () => {
                // Ensure files are sorted by name (e.g., screenshot-1.jpg, screenshot-2.jpg)
                const files = fs.readdirSync(outputDir).filter(f => f.startsWith('screenshot-')).sort((a, b) => {
                    const numA = parseInt(a.match(/screenshot-(\d+)\.jpg/)[1]);
                    const numB = parseInt(b.match(/screenshot-(\d+)\.jpg/)[1]);
                    return numA - numB;
                });
                // Check if frames were actually extracted
                if (files.length === 0 && count > 0) {
                    reject(new Error('No frames extracted. Check ffmpeg setup or video file integrity.'));
                } else {
                    resolve();
                }
            })
            .on('error', (err) => {
                reject(err);
            });
      });
  }
}