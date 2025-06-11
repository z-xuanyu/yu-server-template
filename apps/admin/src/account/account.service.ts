import { Injectable } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { PrismaService } from '@app/db/prisma.service';
import { hashSync } from 'bcryptjs';
import { ApiFail } from '@app/common/response/result';

@Injectable()
export class AccountService {
  constructor(private prisma: PrismaService) { }

  /**
   * 添加账号
   * @param createAccountDto 参数对象 
   * @returns 
   */
  async create(createAccountDto: CreateAccountDto) {
    // 先查找用户是否存在
    const user = await this.prisma.sysAccount.findUnique({
      where: {
        email: createAccountDto.email,
      },
    });
    if (user) {
      throw new ApiFail(101, '用户已存在')
    } 
    // 先加密密码
    const hashPassword = hashSync(createAccountDto.password, 10);
    const res = await this.prisma.sysAccount.create({
      data: {
        name: createAccountDto.name,
        email: createAccountDto.email,
        password: hashPassword,
        roles: {
          create: createAccountDto.roleIds?.map((roleId) => ({ roleId })),
        }
      },
    });
    return res;
  }
  /**
   * 
   * @returns 查找系统用户账号列表
   */
  async findAll() {
    const res = await this.prisma.sysAccount.findMany({
      include: {
        roles: true,
      },
    });
    return res;
  }
  /**
   * 系统用户账号信息
   * @param id 账号id
   * @returns 
   */
  async findOne(id: number) {
    const res = await this.prisma.sysAccount.findUnique({
      where: {
        id,
      },
    });
    return res;
  }
  /**
   * 
   * @param id 账号id
   * @param updateAccountDto 参数对象 
   * @returns 
   */
  async update(id: number, updateAccountDto: UpdateAccountDto) {
    const { roleIds, ...datas } = updateAccountDto;
    const res = await this.prisma.sysAccount.update({
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
   * @param id 账号id
   * @returns 
   */
  async remove(id: number) {
    const res = await this.prisma.sysAccount.delete({
      where: {
        id,
      },
    })
    return res;
  }
}
