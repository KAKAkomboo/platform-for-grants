import { Injectable } from '@nestjs/common';

@Injectable()
export class ParserService {
  async triggerScraper(source: string) {
    // Буде викликати Python-скрипт за допомогою child_process
    return { message: `Скрапінг для джерела ${source} запущено в фоновому режимі` };
  }
}
