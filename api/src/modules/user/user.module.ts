import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemUser } from 'src/database/entities';

@Module({
  imports: [TypeOrmModule.forFeature([SystemUser])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
