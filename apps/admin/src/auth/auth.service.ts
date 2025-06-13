import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/db/prisma.service';
import { UserLoginDto } from './dto/user-login.dto';
import { JwtService } from '@nestjs/jwt';
import { compareSync } from 'bcryptjs';
import { ApiFail } from '@app/common/response/result';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) { }

  /**
   * 登录
   * @param userLoginDto 
   * @returns 
   */
  async login(userLoginDto: UserLoginDto) {
    const res = await this.prisma.sysUser.findUnique({
      where: {
        email: userLoginDto.email,
      },
    })
    if (!res) {
      throw new ApiFail(101, '用户不存在');
    }
    if (!compareSync(userLoginDto.password, res.password)) {
      throw new ApiFail(101, '密码错误');
    }
    const payload = { id: res.id, name: res.name, email: res.email };
    return {
      ...payload,
      accessToken: await this.jwtService.signAsync(payload),
    };
  }
  
  /**
   * 菜单传化为树形结构
   * @param menus
   * @returns
   */
  async buildMenuTree(flatMenu: any) {
    const idMap = new Map<number, any>();
    const tree: any = [];
    // 建立 id -> item 的映射
    flatMenu.forEach(item => {
      idMap.set(item.id, { ...item, children: [] });
    });
    // 构建树
    flatMenu.forEach(item => {
      const current = idMap.get(item.id)!;
      if (!item.parentId) {
        tree.push(current);
      } else {
        const parent = idMap.get(item.parentId);
        if (parent) {
          parent.children!.push(current);
        }
      }
    });
    return tree;
  }

  /**
   * 获取用户权限菜单
   * @param id 用户id
   * @returns
   */
  async getUserMenus(id: number) {
    // 查找用户关联角色
    const roles = await this.prisma.sysUser.findUnique({
      where: {
        id,
      },
      include: {
        roles: true
      }
    })
    // 查找角色关联菜单
    const menus = await this.prisma.sysRole.findMany({
      where: {
        id: {
          in: roles.roles.map(item => item.roleId)
        }
      },
      include: {
        menus: {
          include: {
            menu: {
              include: {
                meta: true
              }
            }
          }
        }
      }
    });
    let menuList = [];
    // 菜单去重
    menus.forEach(item => {
      item.menus.forEach(menu => {
        const hasMenu = menuList.find(menuItem => menuItem.id === menu.menu.id);
        if (hasMenu) {
          return;
        }
        menuList.push(menu.menu);
      })
    });
    return this.buildMenuTree(menuList);
  }

  // 获取用户权限码
  async getUserPermissioncodes(id: number) {
    const userInfo = await this.prisma.sysUser.findUnique({
      where: {
        id,
      },
      include: {
        roles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: {
                    permission: true
                  }
                }
              }
            }
          }
        }
      }
    })
    const list = userInfo?.roles?.map(r=>r?.role?.permissions?.map(p=>p?.permission?.code));
    // 去重
    return list.flat().filter((item, index, arr) => arr.indexOf(item) === index);
  }
}
