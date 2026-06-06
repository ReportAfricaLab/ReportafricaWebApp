import { Controller, Post, Body, UseGuards, Request, BadRequestException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { IsString, IsIn } from 'class-validator';
import { UploadService } from './upload.service';

class GetUploadUrlDto {
  @IsString()
  @IsIn(['image', 'video', 'audio', 'voice_note', 'document'])
  fileType: string;

  @IsString()
  contentType: string;
}

const ALLOWED_CONTENT_TYPES: Record<string, string[]> = {
  image: ['image/jpeg', 'image/png', 'image/webp'],
  video: ['video/mp4', 'video/quicktime'],
  audio: ['audio/mpeg', 'audio/m4a', 'audio/webm', 'audio/ogg', 'audio/wav'],
  voice_note: ['audio/mpeg', 'audio/m4a', 'audio/webm', 'audio/ogg', 'audio/wav'],
  document: ['application/pdf'],
};

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('presigned-url')
  getPresignedUrl(@Request() req: any, @Body() dto: GetUploadUrlDto) {
    // Validate content type matches file type
    const allowed = ALLOWED_CONTENT_TYPES[dto.fileType];
    if (allowed && !allowed.includes(dto.contentType)) {
      throw new BadRequestException(`Invalid content type "${dto.contentType}" for file type "${dto.fileType}". Allowed: ${allowed.join(', ')}`);
    }

    return this.uploadService.getPresignedUploadUrl(req.user.id, dto.fileType, dto.contentType);
  }
}
