import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/common/guards';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { AuthJwtPayload } from 'src/common/interfaces';
import { UserItem } from './types/user';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('detail')
  async getUserDetail(@CurrentUser() user: AuthJwtPayload): Promise<UserItem> {
    return this.userService.getUserDetail(user.sub);
  }
}
