import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ required: true, default: 'user' })
  role: string; // 'user' | 'admin'

  // User Profile
  @Prop({ default: '' })
  profileType: string; // 'student' | 'startup' | 'ngo' | ''

  @Prop({ type: [String], default: [] })
  categories: string[];

  // Saved/Favorite Grants
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Grant' }], default: [] })
  favorites: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);
