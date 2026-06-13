import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async getProfile(userId: string): Promise<any> {
    const user = await this.userModel.findById(userId).select('-passwordHash').exec();
    if (!user) {
      throw new NotFoundException('Користувача не знайдено');
    }
    return user;
  }

  async updateProfile(
    userId: string,
    profileType?: string,
    categories?: string[],
    nickname?: string,
    avatarColor?: string,
    firstName?: string,
    lastName?: string,
  ): Promise<UserDocument> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException('Користувача не знайдено');
    }

    if (profileType !== undefined) user.profileType = profileType;
    if (categories !== undefined) user.categories = categories;
    if (nickname !== undefined) user.nickname = nickname;
    if (avatarColor !== undefined) user.avatarColor = avatarColor;
    if (firstName !== undefined) user.firstName = firstName;
    if (lastName !== undefined) user.lastName = lastName;
    return (await user.save()).populate('favorites');
  }

  async addFavorite(userId: string, grantId: string): Promise<UserDocument> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException('Користувача не знайдено');
    }

    const grantObjectId = new Types.ObjectId(grantId);
    if (!user.favorites.some((id) => id.equals(grantObjectId))) {
      user.favorites.push(grantObjectId);
      await user.save();
    }
    return user.populate('favorites');
  }

  async removeFavorite(userId: string, grantId: string): Promise<UserDocument> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException('Користувача не знайдено');
    }

    const grantObjectId = new Types.ObjectId(grantId);
    user.favorites = user.favorites.filter((id) => !id.equals(grantObjectId)) as any;
    await user.save();
    return user.populate('favorites');
  }

  async getFavorites(userId: string): Promise<any> {
    const user = await this.userModel.findById(userId).populate('favorites').exec();
    if (!user) {
      throw new NotFoundException('Користувача не знайдено');
    }
    return user.favorites;
  }
}
