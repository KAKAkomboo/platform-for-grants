import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '../schemas/user.schema';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<{ message: string }> {
    const { email, password, firstName, lastName, role: dtoRole } = registerDto;

    const existingUser = await this.userModel.findOne({ email }).exec();
    if (existingUser) {
      throw new ConflictException('Користувач з таким email вже існує');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Make the first user an admin for easy testing during hackathon
    const count = await this.userModel.countDocuments().exec();
    const role = count === 0 ? 'admin' : (dtoRole || 'user');

    const newUser = new this.userModel({
      email,
      passwordHash,
      role,
      firstName: firstName || '',
      lastName: lastName || '',
      nickname: firstName ? `${firstName} ${lastName || ''}`.trim() : email.split('@')[0],
      profileType: (dtoRole === 'student' || dtoRole === 'startup' || dtoRole === 'ngo') ? dtoRole : '',
    });

    await newUser.save();
    return { message: 'Реєстрація успішна' };
  }

  async login(loginDto: LoginDto): Promise<{ token: string; email: string; role: string; firstName?: string; lastName?: string; nickname?: string; avatarColor?: string; profileType?: string; }> {
    const { email, password } = loginDto;

    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new UnauthorizedException('Невірний email або пароль');
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Невірний email або пароль');
    }

    const payload = { sub: user._id, email: user.email, role: user.role };
    const token = this.jwtService.sign(payload);

    return {
      token,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      nickname: user.nickname,
      avatarColor: user.avatarColor,
      profileType: user.profileType,
    };
  }

  async validateUserById(userId: string): Promise<UserDocument | null> {
    return this.userModel.findById(userId).select('-passwordHash').exec();
  }
}
