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
    const [totalUsers, totalGrants, activeGrants, archivedGrants, categoriesStats] = await Promise.all([
      this.userModel.countDocuments().exec(),
      this.grantModel.countDocuments().exec(),
      this.grantModel.countDocuments({ status: 'active' }).exec(),
      this.grantModel.countDocuments({ status: 'archived' }).exec(),
      this.grantModel.aggregate([
        { $unwind: '$categories' },
        { $group: { _id: '$categories', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 }
      ]).exec()
    ]);

    const popularCategories = categoriesStats.map((c) => ({
      category: c._id,
      count: c.count,
    }));

    return {
      totalUsers,
      totalGrants,
      activeGrants,
      archivedGrants,
      popularCategories,
    };
  }
}
