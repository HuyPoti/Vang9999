import { Module } from '@nestjs/common';
import { CloudinaryProvider } from './cloudinary.provider';
import { CloudinaryService } from './cloudinary.service';
import { I_STORAGE_SERVICE } from '../../common/interfaces/storage.interface';

@Module({
    providers: [
        CloudinaryProvider,
        CloudinaryService,
        {
            provide: I_STORAGE_SERVICE,
            useClass: CloudinaryService,
        },
    ],
    exports: [CloudinaryProvider, I_STORAGE_SERVICE],
})
export class CloudinaryModule { }
