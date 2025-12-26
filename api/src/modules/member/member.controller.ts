import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { MemberService } from './member.service';
import { JwtAuthGuard } from 'src/common/guards';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { AuthJwtPayload } from 'src/common/interfaces';
import { MemberItem, MembersItem } from './types/member';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateStatus, CreatedOrUpdatedMember, UpdateProfile } from './dto/updated.dto';
import { memoryStorage } from 'multer';

@UseGuards(JwtAuthGuard)
@Controller('member')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Get()
  async getMembers(): Promise<MembersItem[]> {
    return this.memberService.getMembers();
  }

  @Get('profile')
  async getMeDetail(@CurrentUser() user: AuthJwtPayload): Promise<MemberItem> {
    return this.memberService.getMemberDetail(user.sub);
  }

  @Post('detail')
  async getMemberDetail(@Body('id') id: string): Promise<MemberItem> {
    return this.memberService.getMemberDetail(id);
  }

  @Post('profile/updated')
  @UseInterceptors(FileInterceptor('profile'))
  async updatedProfile(
    @UploadedFile() file: Express.Multer.File | undefined,
    @Body() data: UpdateProfile,
    @CurrentUser() user: AuthJwtPayload,
  ): Promise<void> {
    return this.memberService.updatedProfile(user.sub, data, file);
  }

  @Post('created-updated')
  @UseInterceptors(FileInterceptor('profile'))
  async createdOrUpdatedMember(
    @UploadedFile() file: Express.Multer.File | undefined,
    @Body() data: CreatedOrUpdatedMember,
  ): Promise<void> {
    return this.memberService.createdOrUpdatedMember(data, file);
  }

  @Post('status')
  async updatedStatus(@Body() data: UpdateStatus): Promise<void> {
    return this.memberService.updatedStatus(data);
  }

  @Delete('deleted')
  async deleteMember(@Body('id') id: string): Promise<void> {
    return this.memberService.deleteMember(id);
  }
}
