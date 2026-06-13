import { Controller, Post, Body } from '@nestjs/common';
import { ParserService } from './parser.service';

@Controller('parser')
export class ParserController {
  constructor(private readonly parserService: ParserService) {}

  @Post('trigger')
  async trigger(@Body() body: { source: string }) {
    // Буде захищено AdminGuard для доступу тільки адміністраторам
    return this.parserService.triggerScraper(body.source || 'all');
  }
}
