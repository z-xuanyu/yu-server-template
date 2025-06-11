import { Injectable } from '@nestjs/common';
import { CreateMenuDto, MenuType } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { PrismaService } from '@app/db/prisma.service';
import { ApiFail } from '@app/common/response/result';

@Injectable()
export class MenuService {
  constructor(private prisma: PrismaService) { };

  /**
   * 添加菜单
   * @param createMenuDto 参数对象
   * @returns 
   */
  async create(createMenuDto: CreateMenuDto) {
    const { type, meta, name, redirect, path, parentId, component, permissions } = createMenuDto;
    switch (type) {
      case MenuType.DIRECTORY:
        if (parentId) {
          return await this.prisma.sysMenu.create({
            data: {
              name,
              redirect,
              path,
              parent: {
                connect: {
                  id: parentId
                }
              },
              meta: {
                create: {
                  ...meta
                }
              },
            }
          })
        }
        return await this.prisma.sysMenu.create({
          data: {
            name,
            redirect,
            path,
            meta: {
              create: {
                ...meta
              }
            }
          }
        })
      case MenuType.MENU:
        return await this.prisma.sysMenu.create({
          data: {
            name,
            redirect,
            path,
            component,
            parent: {
              connect: {
                id: parentId
              }
            },
            meta: {
              create: {
                ...meta
              }
            }
          }
        })
      case MenuType.BUTTON:
        // 添加按钮权限
        return await this.prisma.sysMenu.update({
          where: {
            id: parentId
          },
          data: {
            permissions: {
              create: permissions.map((permission) => ({
                permission: {
                  connectOrCreate: {
                    where: {
                      code: permission.code,
                    },
                    create: {
                      code: permission.code,
                      name: permission.name,
                      description: permission.description,
                    }
                  }
                }
              }))
            }
          }
        })
    }
  }

  /**
 * 菜单传化为树形结构
 * @param items
 * @returns
 */
  transformToTree(items: any) {
    const itemMap: Record<number, any> = {};
    const tree: any = [];
    // 首先将所有项存入映射表（不包括 permissions 字段）
    items.forEach(item => {
      const { permissions, ...rest } = item;
      const type = rest.component ? 'menu' : 'catalog'
      itemMap[item.id] = { ...rest, key: `menu-${rest.id}`, type, children: [] };
    });
    // 构建树结构
    items.forEach(item => {
      if (!item.parentId) {
        tree.push(itemMap[item.id]);
      } else {
        const parent = itemMap[item.parentId];
        if (parent) {
          parent.children!.push(itemMap[item.id]);
        }
      }
      // 如果有权限，将其转换为children格式
      if (item.permissions && item.permissions.length > 0) {
        const permissionChildren = item.permissions.map(perm => ({
          id: `${item.id}-${perm.permission.id}`,
          name: perm.permission.name,
          parentId: item.id,
          path: '',
          component: null,
          redirect: null,
          type: 'button',
          key: `permission-${perm.permission.id}`,
          meta: {
            title: perm.permission.name,
            icon: '',
          },
          // 注意：这里也不包含 permissions 字段
          code: perm.permission.code,
          description: perm.permission.description
        }));
        itemMap[item.id].children!.push(...permissionChildren);
      }
    });
    return tree;
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
          meta: true,
          permissions: {
            include: {
              permission: true,
            }
          }
        }
      })
    ])
    return {
      items: await this.transformToTree(list),
      total,
    }
  }

  /**
   * 
   * @param id 菜单id
   * @returns 
   */
  async findOne(id: number) {
    return await this.prisma.sysMenu.findUnique({
      where: {
        id
      },
      include: {
        meta: true,
      }
    })
  }

  /**
   *
   * @param id 菜单id
   * @param updateMenuDto 参数对象
   * @returns 
   */
  async update(id: number, updateMenuDto: UpdateMenuDto) {
    const { type, meta, name, redirect, path, parentId, component, permissions } = updateMenuDto;
    switch (type) {
      case MenuType.DIRECTORY:
        return await this.prisma.sysMenu.update({
          where: {
            id
          },
          data: {
            name,
            redirect,
            path,
            parent: {
              connect: {
                id: parentId
              }
            },
            meta: {
              update: {
                ...meta
              }
            }
          }
        })
      case MenuType.MENU:
        return await this.prisma.sysMenu.update({
          where: {
            id
          },
          data: {
            name,
            redirect,
            path,
            component,
            parent: {
              connect: {
                id: parentId
              }
            },
            meta: {
              update: {
                ...meta
              }
            }
          }
        })
      case MenuType.BUTTON:
      // 添加按钮权限
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
          id
        },
      })
    } catch (error) {
      throw new ApiFail(101, '菜单删除失败');
    }
  }
}
