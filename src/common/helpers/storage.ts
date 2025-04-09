// import { Injectable } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import { IStorageProvider } from '../interfaces/storage-provider.interface';
// import { CloudinaryProvider } from '../providers/cloudinary.provider';
// import { S3Provider } from '../providers/s3.provider';

// @Injectable()
// export class StorageFactory {
//   constructor(private configService: ConfigService) {}

//   createStorageProvider(): IStorageProvider {
//     const provider = this.configService.get<string>('STORAGE_PROVIDER');
//     const config = {
//       cloudName: this.configService.get('CLOUDINARY_CLOUD_NAME'),
//       apiKey:
//         this.configService.get('CLOUDINARY_API_KEY') ||
//         this.configService.get('AWS_ACCESS_KEY_ID'),
//       apiSecret:
//         this.configService.get('CLOUDINARY_API_SECRET') ||
//         this.configService.get('AWS_SECRET_ACCESS_KEY'),
//       bucket: this.configService.get('AWS_S3_BUCKET'),
//       region: this.configService.get('AWS_REGION'),
//     };

//     switch (provider?.toLowerCase()) {
//       case 's3':
//         return new S3Provider(config);
//       case 'cloudinary': 
//       default:
//         return new CloudinaryProvider(config);
//     }
//   }
// }
