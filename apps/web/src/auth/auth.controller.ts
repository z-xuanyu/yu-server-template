import { Controller, Post, Body, Get, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from './auth.guard';
import { UserLoginDto } from './dto/user-login.dto';

@ApiTags('权限相关')
@Controller('auth')
@ApiBearerAuth()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post()
  @ApiOperation({ summary: '注册用户'  })
  async register(@Body() registerUserDto: RegisterUserDto) {
    return await this.authService.register(registerUserDto);
  }

  @Public()
  @Post('login')
  @ApiOperation({ summary: '用户登录'  })
  async login(@Body() userLoginDto: UserLoginDto) {
    return await this.authService.login(userLoginDto);
  }

  @Get('profile')
  @ApiOperation({ summary: '获取用户信息'  })
  getProfile(@Request() req) {
    return req.user;
  }
}
