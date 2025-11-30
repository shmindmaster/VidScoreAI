import { IsString, IsNumber, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class InitUploadDto {
  @ApiProperty({ description: 'Original filename of the video', example: 'my_video.mp4' })
  @IsString()
  @IsNotEmpty()
  filename: string;

  @ApiProperty({ description: 'MIME type of the video', example: 'video/mp4' })
  @IsString()
  @IsNotEmpty()
  mimeType: string;

  @ApiProperty({ description: 'Size of the video file in bytes', example: 1024000 })
  @IsNumber()
  size: number;
}

export class VideoIdDto {
    @ApiProperty({ description: 'ID of the video', example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef' })
    @IsString()
    @IsNotEmpty()
    id: string;
}
