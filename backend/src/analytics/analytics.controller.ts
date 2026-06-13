import { Controller, Get } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('stats')
  async getStats() {
    // Буде захищено JwtAuthGuard та AdminGuard
    return this.analyticsService.getAdminStats();
  }
}
