import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Grant, GrantDocument } from '../schemas/grant.schema';
import { User, UserDocument } from '../schemas/user.schema';

@Injectable()
export class GrantsService {
  constructor(
    @InjectModel(Grant.name) private grantModel: Model<GrantDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async findAll(query: {
    search?: string;
    categories?: string | string[];
    targetAudience?: string;
    status?: string;
  }) {
    const filter: any = {};

    if (query.status) {
      filter.status = query.status;
    } else {
      filter.status = 'active';
    }

    if (query.search) {
      filter.$text = { $search: query.search };
    }

    if (query.categories) {
      const cats = Array.isArray(query.categories)
        ? query.categories
        : [query.categories];
      filter.categories = { $in: cats };
    }

    if (query.targetAudience) {
      filter.targetAudience = query.targetAudience;
    }

    return this.grantModel.find(filter).sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string) {
    const grant = await this.grantModel
      .findByIdAndUpdate(id, { $inc: { viewsCount: 1 } }, { new: true })
      .exec();
    if (!grant) {
      throw new NotFoundException('Грант не знайдено');
    }
    return grant;
  }

  async create(createGrantDto: any) {
    const newGrant = new this.grantModel(createGrantDto);
    return newGrant.save();
  }

  async getRecommendations(userId: string) {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      return [];
    }

    const filter: any = { status: 'active' };
    const orClauses: any[] = [];

    if (user.profileType) {
      orClauses.push({ targetAudience: user.profileType });
    }

    if (user.categories && user.categories.length > 0) {
      orClauses.push({ categories: { $in: user.categories } });
    }

    if (orClauses.length > 0) {
      filter.$or = orClauses;
    }

    return this.grantModel.find(filter).sort({ viewsCount: -1 }).limit(10).exec();
  }

  async remove(id: string) {
    return this.grantModel.findByIdAndDelete(id).exec();
  }

  async update(id: string, updateGrantDto: any) {
    return this.grantModel.findByIdAndUpdate(id, updateGrantDto, { new: true }).exec();
  }
}
