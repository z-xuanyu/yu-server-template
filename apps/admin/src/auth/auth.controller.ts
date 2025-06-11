import { Controller, Post, Body, Get, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AccountLoginDto } from './dto/account-login.dto';
import { ApiBearerAuth, ApiHeaders, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from './auth.guard';
import { apiSucceed } from '@app/common/response/result';

@ApiTags('授权')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @ApiOperation({ summary: '账号登录'  })
  async create(@Body() accountLoginDto: AccountLoginDto) {
    const res = await this.authService.login(accountLoginDto);
    return apiSucceed(res);
  }

  @Get('profile')
  @ApiOperation({ summary: '获取用户信息' })
  getProfile(@Request() req) {
    const infp = {
      username: req.user?.name,
      userId: req.user?.id,
      realName: req.user?.name,
      avatar: '',
    }
    return apiSucceed(infp);
  }

  @Get('menu')
  @ApiOperation({ summary: '获取用户菜单' })
  async getUserMenu(@Request() req) {
    const res = await this.authService.getUserMenus(req.user.id);
    return apiSucceed(res);
  }
}
