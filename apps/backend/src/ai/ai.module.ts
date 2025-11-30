import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { RagService } from './rag.service';
import { RagController } from './rag.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [RagController],
  providers: [AiService, RagService],
  exports: [AiService, RagService],
})
export class AiModule {}