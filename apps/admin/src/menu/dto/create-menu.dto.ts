import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export enum MenuType {
  CATALOG = 'catalog',
  MENU = 'menu',
  BUTTON = 'button',
  LINK = 'link',
  EMBEDDED = 'embedded',
}

class Mate {
  @IsOptional()
  @ApiProperty({ title: '菜单标题' })
  title: string;

  @ApiProperty({ title: '菜单图标' })
  @IsOptional()
  icon: string;

  @ApiProperty({ title: '排序' })
  @IsOptional()
  order: number;
}
export class CreateMenuDto {
  @IsOptional()
  @ApiProperty({ title: '菜单名称' })
  name: string;

  @ApiProperty({ title: '菜单路由path' })
  @IsOptional()
  path: string;

  @ApiProperty({ title: '菜单路由component' })
  @IsOptional()
  component: string;

  @ApiProperty({ title: '权限码' })
  @IsOptional()
  authCode?: string;

  @ApiProperty({ title: 'redirect' })
  @IsOptional()
  redirect?: string;

  @ApiProperty({ title: '菜单路由meta', required: false, type: Mate })
  @IsOptional()
  meta?: Mate;

  @ApiProperty({ title: '父级菜单ID' })
  @IsOptional()
  parentId?: number;

  @ApiProperty({ title: '类型', enum: MenuType, default: MenuType.CATALOG })
  @IsOptional()
  type: MenuType;
}
