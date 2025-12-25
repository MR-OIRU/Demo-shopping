import { Module } from '@nestjs/common';
import { MemberService } from './member.service';
import { MemberController } from './member.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemUser } from 'src/database/entities';

@Module({
  imports: [TypeOrmModule.forFeature([SystemUser])],
  controllers: [MemberController],
  providers: [MemberService],
})
export class UserModule {}
