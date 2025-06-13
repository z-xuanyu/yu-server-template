import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '@app/db/prisma.service';
import { hashSync } from 'bcryptjs';
import { ApiFail } from '@app/common/response/result';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) { }

  /**
   * 添加用户
   * @param createUserDto 参数对象 
   * @returns 
   */
  async create(createUserDto: CreateUserDto) {
    // 先查找用户是否存在
    const user = await this.prisma.sysUser.findUnique({
      where: {
        email: createUserDto.email,
      },
    });
    if (user) {
      throw new ApiFail(101, '用户已存在')
    } 
    // 先加密密码
    const hashPassword = hashSync(createUserDto.password, 10);
    const res = await this.prisma.sysUser.create({
      data: {
        name: createUserDto.name,
        email: createUserDto.email,
        password: hashPassword,
        roles: {
          create: createUserDto.roleIds?.map((roleId) => ({ roleId })),
        }
      },
    });
    return res;
  }
  /**
   * 
   * @returns 查找系统用户用户列表
   */
  async findAll() {
    const res = await this.prisma.sysUser.findMany({
      include: {
        roles: true,
      },
    });
    return res;
  }
  /**
   * 系统用户用户信息
   * @param id 用户id
   * @returns 
   */
  async findOne(id: number) {
    const res = await this.prisma.sysUser.findUnique({
      where: {
        id,
      },
    });
    return res;
  }
  /**
   * 
   * @param id 用户id
   * @param updateUserDto 参数对象 
   * @returns 
   */
  async update(id: number, updateUserDto: UpdateUserDto) {
    const { roleIds, ...datas } = updateUserDto;
    const res = await this.prisma.sysUser.update({
      where: {
        id,
      },
      data: {
        ...datas,
        roles: {
          deleteMany: {},
          create: roleIds?.map((roleId) => ({ roleId })),
        }
      },
    });
    return res;
  }

  /**
   * 
   * @param id 用户id
   * @returns 
   */
  async remove(id: number) {
    const res = await this.prisma.sysUser.delete({
      where: {
        id,
      },
    })
    return res;
  }
}
