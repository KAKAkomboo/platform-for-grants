import { Controller, Get, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AdminGuard } from '../auth/admin.guard';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('stats')
  @UseGuards(AdminGuard)
  async getStats() {
    return this.analyticsService.getAdminStats();
  }
}
