import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as  COS from 'cos-nodejs-sdk-v5'
import { UsersService } from 'src/users/users.service';

@Injectable()
export class UploadService {
  private readonly cos: COS = new COS({
    SecretId: process.env.COS_SECRET_ID,
    SecretKey: process.env.COS_SECRET_KEY
  })
  private readonly bucket: string = 'xianfu-1321684111'
  private readonly region: string = 'ap-guangzhou'
  private readonly baseParams: COS.PutObjectAclParams = {
    Bucket: this.bucket,
    Region: this.region,
    Key: ''
  }
  constructor(private readonly userService: UsersService) { }


  async create(file: Express.Multer.File): Promise<{ url: string }> {
    const params = Object.assign(this.baseParams, {
      Body: file.buffer,
      Key: `/image/${Date.now()}-${file.originalname}`
    });
    try {
      // 视频上传
      if (file.mimetype.includes('video')) {
        params.Key = '/video/' + Date.now() + '-' + file.originalname;
      }
      // 音频上传
      if (file.mimetype.includes('audio')) {
        params.Key = '/audio/' + Date.now() + '-' + file.originalname;
      }
      const res = await this.cos.putObject(params);

      return {
        url: 'https://' + res.Location
      };
    } catch (error) {
      await this.remove(params.Key);
      throw new HttpException('文件上传失败', HttpStatus.BAD_REQUEST);
    }
  }

  async remove(key: string) {
    const params = Object.assign(this.baseParams, {
      Key: key
    });
    const res = await this.cos.deleteObject(params);
    return res;
  }

  /**
   * 上传用户头像
   * @param userId 用户id
   * @param file 文件
   */
  async uploadAvatar(userId: number, file: Express.Multer.File) {
    const user = await this.userService.findById(userId);
    console.log(user, 'user', userId);
    if (!user) {
      throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
    }
    const { url } = await this.create(file);

    if (!url) {
      throw new HttpException('头像上传失败', HttpStatus.BAD_REQUEST);
    }

    return await this.userService.updateByCondition({ avatar: url }, userId);
  }
}
