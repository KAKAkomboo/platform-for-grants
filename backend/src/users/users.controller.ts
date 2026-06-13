import { Controller, Put, Post, Delete, Get, Body, Param, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Put('profile')
  async updateProfile(
    @Request() req,
    @Body() body: { profileType: string; categories: string[] },
  ) {
    return this.usersService.updateProfile(req.user._id, body.profileType, body.categories);
  }

  @Post('favorites/:grantId')
  async addFavorite(@Request() req, @Param('grantId') grantId: string) {
    return this.usersService.addFavorite(req.user._id, grantId);
  }

  @Delete('favorites/:grantId')
  async removeFavorite(@Request() req, @Param('grantId') grantId: string) {
    return this.usersService.removeFavorite(req.user._id, grantId);
  }

  @Get('favorites')
  async getFavorites(@Request() req) {
    return this.usersService.getFavorites(req.user._id);
  }
}
