import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Storage } from 'megajs';

@Injectable()
export class StorageService extends Storage {
  constructor(private config: ConfigService) {
    super({
      email: config.get('MEGA_EMAIL'),
      password: config.get('MEGA_PASSWORD'),
    });
  }
}
