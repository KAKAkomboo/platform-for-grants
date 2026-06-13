import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type GrantDocument = Grant & Document;

@Schema({ timestamps: true })
export class Grant {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  organizer: string;

  @Prop({ required: true })
  deadline: Date;

  @Prop({ required: true })
  amount: string;

  @Prop({ type: [String], default: [] })
  categories: string[];

  @Prop({ type: [String], default: [] })
  targetAudience: string[]; // 'student', 'startup', 'ngo'

  @Prop({ required: true })
  sourceUrl: string;

  @Prop({ required: true, default: 'active' })
  status: string; // 'active' | 'archived'

  @Prop({ default: '' })
  authorEmail: string;

  @Prop({ default: '' })
  firstName: string;

  @Prop({ default: '' })
  lastName: string;

  @Prop({ default: 0 })
  viewsCount: number;

  @Prop({ default: 0 })
  favoritesCount: number;
}

export const GrantSchema = SchemaFactory.createForClass(Grant);

// Indexing for search
GrantSchema.index({ title: 'text', description: 'text', organizer: 'text' });

// Indexing for query sorting and filtering performance
GrantSchema.index({ status: 1, createdAt: -1 });
GrantSchema.index({ status: 1, viewsCount: -1 });
