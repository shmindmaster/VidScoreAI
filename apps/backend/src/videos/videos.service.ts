import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import { AiService } from '../ai/ai.service';

@Injectable()
export class VideosService {
  constructor(
    private prisma: PrismaService,
    private storage: StorageService,
    private ai: AiService
  ) {}

  async initiateUpload(filename: string, mimeType: string, size: number) {
    const video = await this.prisma.video.create({
      data: {
        filename,
        originalName: filename,
        mimeType,
        size,
        status: 'PENDING'
      }
    });

    // Use ID in filename to avoid collisions
    const blobName = `${video.id}-${filename}`;
    const { uploadUrl, blobUrl } = await this.storage.generateUploadUrl(blobName);
    
    await this.prisma.video.update({
        where: { id: video.id },
        data: { url: blobUrl }
    });

    return {
      id: video.id,
      uploadUrl,
      blobUrl
    };
  }

  async confirmUpload(id: string) {
    const video = await this.prisma.video.findUnique({ where: { id } });
    if (!video) throw new NotFoundException('Video not found');

    await this.prisma.video.update({
      where: { id },
      data: { status: 'PROCESSING' }
    });

    // Trigger analysis (async)
    this.processVideo(video).catch(err => console.error('Error processing video:', err));

    return { status: 'PROCESSING' };
  }
  
  private async processVideo(video: { id: string; url: string; filename: string; mimeType: string; size: number; status: string; }) {
      try {
        const analysisResult = await this.ai.analyzeVideo(video);
        
        await this.prisma.analysis.create({
            data: {
                videoId: video.id,
                overallScore: analysisResult.overallScore,
                summary: analysisResult.summary,
                details: analysisResult.details || {}
            }
        });
        
        await this.prisma.video.update({
            where: { id: video.id },
            data: { status: 'COMPLETED' }
        });
      } catch (e) {
        console.error('Error processing video analysis:', e);
        await this.prisma.video.update({
            where: { id: video.id },
            data: { status: 'FAILED' }
        });
      }
  }

  async getVideo(id: string) {
      const video = await this.prisma.video.findUnique({
          where: { id },
          include: { analysis: true }
      });
      if (!video) throw new NotFoundException('Video not found');
      return video;
  }
}