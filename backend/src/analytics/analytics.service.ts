import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Grant, GrantDocument } from '../schemas/grant.schema';
import { User, UserDocument } from '../schemas/user.schema';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectModel(Grant.name) private grantModel: Model<GrantDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async getAdminStats() {
    // Каркас для отримання статистики
    return {
      totalUsers: 0,
      totalGrants: 0,
      activeGrants: 0,
      archivedGrants: 0,
      popularCategories: [],
    };
  }
}
