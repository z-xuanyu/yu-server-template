import { Injectable } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { PrismaService } from '@app/db/prisma.service';
import { ApiFail } from '@app/common/response/result';
import { UserLoginDto } from './dto/user-login.dto';
import { hashSync, compareSync } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

  constructor(private prisma: PrismaService, private jwtService: JwtService) { }

  /**
   * 用户注册
   * @param registerUserDto 
   * @returns 
   */
  async register(registerUserDto: RegisterUserDto) {
    const { name, phone, password } = registerUserDto;
    // 先查找用户是否存在
    const info = await this.prisma.user.findUnique({
      where: {
        phone,
      }
    });
    if (info) {
      throw new ApiFail(101, '用户已存在');
    }
    // 先加密密码
    const hashPassword = hashSync(password, 10);
    const user = await this.prisma.user.create({
      data: {
        name,
        phone,
        password: hashPassword,
        avatar: '',
      }
    })
    return user;
  }


  /**
   * 用户登录
   * @param UserLoginDto
   * @returns
   */
  async login(userLoginDto: UserLoginDto) {
    const { phone, password } = userLoginDto;
    // 先查找用户是否存在
    const info = await this.prisma.user.findUnique({
      where: {
        phone,
      }
    });
    if (!info) {
      throw new ApiFail(101, '用户不存在');
    }
    // 存在则判断密码是否正确
    if (!compareSync(password, info.password)) {
      throw new ApiFail(101, '密码错误');
    }
    const payload = { id: info.id, name: info.name, email: info.phone };
    return {
      ...payload,
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
