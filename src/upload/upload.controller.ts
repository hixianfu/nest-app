import { Controller, Post, UseInterceptors, UploadedFile, Param } from '@nestjs/common';
import { UploadService } from './upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiParam, ApiProperty } from '@nestjs/swagger';
import { ApiConsumes } from '@nestjs/swagger';

class FileUploadDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: string;
}

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) { }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: '上传文件',
    type: FileUploadDto
  })
  create(@UploadedFile() file: Express.Multer.File): Promise<{ url: string }> {
    return this.uploadService.create(file);
  }

  @Post('uploadAvatar/:id')
  @UseInterceptors(FileInterceptor('file'))
  @ApiParam({ name: 'id', description: '用户ID', required: true })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: '上传用户头像',
    type: FileUploadDto
  })
  uploadUserAvatar(@Param('id') userId: number, @UploadedFile() file: Express.Multer.File){
    return this.uploadService.uploadAvatar(userId, file);
  }
}
