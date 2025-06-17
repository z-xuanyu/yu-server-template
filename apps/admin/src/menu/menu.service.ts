import { Injectable } from '@nestjs/common';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { PrismaService } from '@app/db/prisma.service';
import { ApiFail } from '@app/common/response/result';

@Injectable()
export class MenuService {
  constructor(private prisma: PrismaService) {}

  /**
   * 添加菜单
   * @param createMenuDto 参数对象
   * @returns
   */
  async create(createMenuDto: CreateMenuDto) {
    const { type, meta, authCode, name, redirect, path, parentId, component } =
      createMenuDto;
    await this.prisma.sysMenu.create({
      data: {
        name,
        redirect,
        path,
        type,
        parentId,
        authCode,
        component,
        meta: {
          create: {
            ...meta,
          },
        },
      },
    });
  }
  /**
   * 获取菜单列表
   * @returns
   */
  async findAll() {
    const [total, list] = await this.prisma.$transaction([
      this.prisma.sysMenu.count(),
      this.prisma.sysMenu.findMany({
        include: {
          meta: {
            omit: {
              id: true,
              menuId: true,
            },
          },
        },
      }),
    ]);
    return {
      items: list,
      total,
    };
  }

  /**
   *
   * @param id 菜单id
   * @returns
   */
  async findOne(id: number) {
    return await this.prisma.sysMenu.findUnique({
      where: {
        id,
      },
      include: {
        meta: true,
      },
    });
  }

  /**
   *
   * @param id 菜单id
   * @param updateMenuDto 参数对象
   * @returns
   */
  async update(id: number, updateMenuDto: UpdateMenuDto) {
    const { type, meta, authCode, name, redirect, path, parentId, component } =
      updateMenuDto;
    try {
      return await this.prisma.sysMenu.update({
        where: {
          id,
        },
        data: {
          name,
          redirect,
          path,
          type,
          parentId,
          authCode,
          component,
          meta: {
            update: {
              ...meta,
            },
          },
        },
      });
    } catch (error) {
      console.error(error);
      throw new ApiFail(100, '菜单更新失败');
    }
  }

  /**
   * 删除菜单
   * @param id 菜单id
   * @returns
   */
  async remove(id: number) {
    try {
      return await this.prisma.sysMenu.delete({
        where: {
          id,
        },
      });
    } catch (error) {
      throw new ApiFail(101, '菜单删除失败');
    }
  }
}
