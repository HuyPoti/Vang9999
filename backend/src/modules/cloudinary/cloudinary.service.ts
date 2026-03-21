import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryResponse } from './cloudinary-response';
import * as streamifier from 'streamifier';
import { IStorageService, StorageResult } from '../../common/interfaces/storage.interface';

@Injectable()
export class CloudinaryService implements IStorageService {
    async uploadFile(file: Express.Multer.File): Promise<StorageResult> {
        return new Promise((resolve, reject) => {
            const upload = cloudinary.uploader.upload_stream((error, result) => {
                if (error) return reject(error);
                resolve(result as StorageResult);
            });

            streamifier.createReadStream(file.buffer).pipe(upload);
        });
    }

    async deleteFile(publicId: string): Promise<any> {
        return new Promise((resolve, reject) => {
            cloudinary.uploader.destroy(publicId, (error, result) => {
                if (error) return reject(error);
                resolve(result);
            });
        });
    }
}
