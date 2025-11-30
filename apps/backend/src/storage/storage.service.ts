import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { 
  BlobServiceClient, 
  generateBlobSASQueryParameters, 
  BlobSASPermissions, 
  StorageSharedKeyCredential 
} from '@azure/storage-blob';

@Injectable()
export class StorageService {
  private blobServiceClient: BlobServiceClient;
  private containerName: string;
  private accountName: string;
  private accountKey: string;

  constructor(private configService: ConfigService) {
    const connectionString = this.configService.get<string>('AZURE_STORAGE_CONNECTION_STRING');
    this.containerName = this.configService.get<string>('AZURE_STORAGE_CONTAINER') || 'vidscoreai';

    if (connectionString) {
      this.blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
      
      // Parse connection string for SAS generation
      const matches = connectionString.match(/AccountName=([^;]+);.*AccountKey=([^;]+)/);
      if (matches) {
        this.accountName = matches[1];
        this.accountKey = matches[2];
      }
    }
  }

  async generateUploadUrl(filename: string): Promise<{ uploadUrl: string; blobUrl: string }> {
    if (!this.blobServiceClient || !this.accountName || !this.accountKey) {
      console.warn('Azure Storage not configured, returning mock URLs');
      return { 
        uploadUrl: `http://localhost:3000/mock-upload/${filename}`, 
        blobUrl: `http://localhost:3000/mock-blob/${filename}` 
      };
    }

    const containerClient = this.blobServiceClient.getContainerClient(this.containerName);
    const blobClient = containerClient.getBlockBlobClient(filename);

    await containerClient.createIfNotExists();

    const credential = new StorageSharedKeyCredential(this.accountName, this.accountKey);
    
    const sasPermissions = new BlobSASPermissions();
    sasPermissions.write = true;
    sasPermissions.create = true;
    sasPermissions.read = true;

    const expiresOn = new Date();
    expiresOn.setHours(expiresOn.getHours() + 1);

    const sasToken = generateBlobSASQueryParameters({
      containerName: this.containerName,
      blobName: filename,
      permissions: sasPermissions,
      expiresOn: expiresOn
    }, credential).toString();

    return {
      uploadUrl: `${blobClient.url}?${sasToken}`,
      blobUrl: blobClient.url
    };
  }
}
