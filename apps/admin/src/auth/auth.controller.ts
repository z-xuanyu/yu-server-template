import { Controller, Post, Body, Get, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserLoginDto } from './dto/user-login.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from './auth.guard';
import { apiSucceed } from '@app/common/response/result';
import { EmailSendCodeDto } from './dto/email-send-code.dto';
import { Ip } from '@app/common/decorators/ip.decorator';
import { MailerService } from '../mailer/mailer.service';

@ApiTags('授权')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly mailerSerice: MailerService) { }

  @Public()
  @Post('login')
  @ApiOperation({ summary: '用户登录' })
  async create(@Body() userLoginDto: UserLoginDto) {
    const res = await this.authService.login(userLoginDto);
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

  @Get('codes')
  @ApiOperation({ summary: '获取用户权限码' })
  async getCodes(@Request() req) {
    const res = await this.authService.getUserPermissioncodes(req.user.id);
    return apiSucceed(res);
  }

  @Post('sendEmailCode')
  @ApiOperation({ summary: '发送邮箱验证码' })
  @Public()
  async sendCode(@Body() dto: EmailSendCodeDto, @Ip() ip: string) {
    const { email } = dto;
    await this.mailerSerice.checkLimit(email, ip);
    const { code } = await this.mailerSerice.sendVerificationCode(email);
    await this.mailerSerice.log(email, code, ip);
    return apiSucceed(code);
  }
}
