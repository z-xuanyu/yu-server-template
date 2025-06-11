import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PrismaService } from '@app/db/prisma.service';
import { QueryRoleDto } from './dto/query-role.dto';

@Injectable()
export class RoleService {
  constructor(private prisma: PrismaService) { };

  /**
   * 添加角色
   * @param createRoleDto 参数对象
   * @returns 
   */
  async create(createRoleDto: CreateRoleDto) {
    const { permissions = [], menus = [], ...releData } = createRoleDto;
    const res = await this.prisma.sysRole.create({
      data: {
        ...releData,
        permissions: {
          create: permissions.map((item) => ({
            permissionId: item,
          })),
        },
        menus: {
          create: menus.map((item) => ({
            menuId: item,
          }))
        }
      },
    });
    return res;
  }

  /**
   * 查询所有角色
   * @returns 
   */
  async findAll(queryRoleDto: QueryRoleDto) {
    const { page = 1, pageSize = 10, name } = queryRoleDto;
    const where = {
      name: {
        contains: name,
      },
    }
    const [list, total] = await this.prisma.$transaction([
      this.prisma.sysRole.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        where,
        include: {
          permissions: true,
          menus: true,
        }
      }),
      this.prisma.sysRole.count({
        where,
      })
    ])
    return {
      items: list,
      total,
    }
  }

  /**
   * 查询角色详情
   * @param id 角色id
   * @returns
   */
  async findOne(id: number) {
    const res = await this.prisma.sysRole.findUnique({
      where: {
        id,
      },
      include: {
        permissions: {
          select: {
            permissionId: true,
          },
        },
        menus: {
          select: {
            menuId: true,
          }
        }
      },
    })
    return res;
  }

  /**
   * 更新角色
   * @param id 角色id
   * @param updateRoleDto 参数对象
   * @returns
   */
  async update(id: number, updateRoleDto: UpdateRoleDto) {
    const { name, remark, sort, permissions, menus } = updateRoleDto;
    try {
      const res = await this.prisma.sysRole.update({
        where: {
          id,
        },
        data: {
          name,
          remark,
          sort,
          permissions: {
            deleteMany: {},
            create: permissions.map((item) => ({
              permissionId: item,
            }))
          },
          menus: {
            deleteMany: {},
            create: menus.map((item) => ({
              menuId: item,
            }))
          }
        }
      })
      return res;
    } catch (error) {
      console.log(error, '更新角色错误');
    }
  }
  /**
   * 删除角色
   * @param id 角色id 
   * @returns 
   */
  async remove(id: number) {
    const res = await this.prisma.sysRole.delete({
      where: {
        id,
      },
    })
    return res;
  }
}
