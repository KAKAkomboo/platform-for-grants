import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GrantsService } from './grants.service';
import { GrantsController } from './grants.controller';
import { Grant, GrantSchema } from '../schemas/grant.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Grant.name, schema: GrantSchema }]),
  ],
  controllers: [GrantsController],
  providers: [GrantsService],
  exports: [GrantsService],
})
export class GrantsModule {}
