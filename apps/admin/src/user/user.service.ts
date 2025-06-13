import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '@app/db/prisma.service';
import { hashSync } from 'bcryptjs';
import { ApiFail } from '@app/common/response/result';
import { QueryUserDto } from './dto/query-user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) { }

  /**
   * 添加用户
   * @param createUserDto 参数对象 
   * @returns 
   */
  async create(createUserDto: CreateUserDto) {
    try {
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
      return await this.prisma.sysUser.create({
        data: {
          name: createUserDto.name,
          email: createUserDto.email,
          password: hashPassword,
          roles: {
            create: createUserDto.roleIds?.map((roleId) => ({ roleId })),
          },
          dept: {
            connect: {
              id: createUserDto.deptId,
            }
          }
        },
      });
    } catch (error) {
      // this.logger.error(['[添加用户失败]'], JSON.stringify(error));
      throw new ApiFail(102, '添加用户失败');
    }
  }
  /**
   * 找系统用户用户列表
   * @param queryUserDto 参数对象
   * @returns 系统用户用户列表
   */
  async findAll(queryUserDto: QueryUserDto) {
    try {
      const { page = 1, pageSize = 10, name } = queryUserDto;
      const where = {
        name: {
          contains: name,
        },
      }
      const [total, items] = await this.prisma.$transaction([
        this.prisma.sysUser.count({
          where,
        }),
        this.prisma.sysUser.findMany({
          skip: (page - 1) * pageSize,
          take: pageSize,
          where,
          include: {
            roles: true,
          },
        }),
      ]);
      return {
        total,
        items,
      };
    } catch (error) {
      throw new ApiFail(102, '查询用户列表失败')
    }
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
