import { Controller, Post, Body } from '@nestjs/common';
import { RagService } from './rag.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

class SearchDto {
    query: string;
    limit?: number;
}

@ApiTags('rag')
@Controller('rag')
export class RagController {
  constructor(private readonly ragService: RagService) {}

  @Post('search')
  @ApiOperation({ summary: 'Semantic search over knowledge base' })
  async search(@Body() body: SearchDto) {
    return this.ragService.search(body.query, body.limit);
  }
}
