import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { GrantsService } from './grants.service';

@Controller('grants')
export class GrantsController {
  constructor(private readonly grantsService: GrantsService) {}

  @Get()
  async findAll() {
    return this.grantsService.findAll();
  }

  @Get('recommendations')
  async getRecommendations() {
    // Буде підключено JwtAuthGuard для отримання користувача
    return [];
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.grantsService.findOne(id);
  }

  @Post()
  async create(@Body() createGrantDto: any) {
    return this.grantsService.create(createGrantDto);
  }
}
