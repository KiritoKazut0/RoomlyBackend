import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFiles, ParseFilePipe, FileTypeValidator, MaxFileSizeValidator, UploadedFile } from '@nestjs/common';
import { ImagesService } from './images.service';
import {  FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

@Controller('images')
export class ImagesController {

  constructor(private readonly imagesService: ImagesService) { }

  @Post('/rooms')
  @UseInterceptors(FilesInterceptor('files', 10)) 
  async uploadFiles(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
          new MaxFileSizeValidator({
            maxSize: 10 * 1024 * 1024,
            message: 'File is too large. Max file size is 10MB',
          }),
        ],
        fileIsRequired: true,
      }),
    )
    files: Express.Multer.File[],
    @Body('isPublic') isPublic: string,
  ) {
    const isPublicBool = isPublic === 'true';
    return this.imagesService.uploadMultipleFiles({ files, isPublic: isPublicBool });
  }


  @Post('/users')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
          new MaxFileSizeValidator({
            maxSize: 10 * 1024 * 1024, // 10MB
            message: 'File is too large. Max file size is 10MB',
          }),
        ],
        fileIsRequired: true,
      }),
    )
    file: Express.Multer.File,
    @Body('isPublic') isPublic: string,
  ) {
    const isPublicBool = isPublic === 'true' ? true : false;
    return this.imagesService.uploadFile({ file, isPublic: isPublicBool });
  }



  @Get(':key')
  async getFileUrl(@Param('key') key: string) {
    return this.imagesService.getFileUrl(key, 'profile_users');
  }


  @Get('/signed-url/:key')
  async getSingedUrl(@Param('key') key: string) {
    return this.imagesService.getPresignedSignedUrl(key, 'profile_users');
  }


  @Delete(':key')
  async deleteFile(@Param('key') key: string) {
    return this.imagesService.deleteFile(key);
  }

}
