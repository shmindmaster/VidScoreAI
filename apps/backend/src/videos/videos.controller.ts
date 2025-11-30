import { Controller, Post, Body, Param, Get, Put } from '@nestjs/common';
import { VideosService } from './videos.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { InitUploadDto, VideoIdDto } from './dto/video.dto';

@ApiTags('videos')
@Controller('videos')
export class VideosController {
  constructor(private readonly videosService: VideosService) {}

  @Post('init-upload')
  @ApiOperation({ summary: 'Initiate video upload and get a SAS URL' })
  @ApiResponse({ status: 201, description: 'Upload initiated successfully.' })
  async initUpload(@Body() initUploadDto: InitUploadDto) {
    return this.videosService.initiateUpload(initUploadDto.filename, initUploadDto.mimeType, initUploadDto.size);
  }

  @Post(':id/confirm')
  @ApiOperation({ summary: 'Confirm video upload and trigger analysis' })
  @ApiResponse({ status: 200, description: 'Upload confirmed, analysis triggered.' })
  async confirmUpload(@Param() videoIdDto: VideoIdDto) {
    return this.videosService.confirmUpload(videoIdDto.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get video status and analysis results' })
  @ApiResponse({ status: 200, description: 'Video and analysis data retrieved successfully.' })
  async getVideo(@Param() videoIdDto: VideoIdDto) {
    return this.videosService.getVideo(videoIdDto.id);
  }
}