import { Controller, Get, Post, Body, Param, Query, UseGuards, Request, Delete, Put } from '@nestjs/common';
import { GrantsService } from './grants.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('grants')
export class GrantsController {
  constructor(private readonly grantsService: GrantsService) {}

  @Get()
  async findAll(@Query() query: { search?: string; categories?: string | string[]; targetAudience?: string; status?: string }) {
    return this.grantsService.findAll(query);
  }

  @Get('recommendations')
  @UseGuards(JwtAuthGuard)
  async getRecommendations(@Request() req) {
    return this.grantsService.getRecommendations(req.user._id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.grantsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createGrantDto: any) {
    return this.grantsService.create(createGrantDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string) {
    return this.grantsService.remove(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Body() updateGrantDto: any) {
    return this.grantsService.update(id, updateGrantDto);
  }
}
