export interface StorageResult {
    url: string;
    public_id: string;
    [key: string]: any;
}

export interface IStorageService {
    uploadFile(file: any): Promise<StorageResult>;
    deleteFile(publicId: string): Promise<any>;
}

export const I_STORAGE_SERVICE = 'I_STORAGE_SERVICE';
