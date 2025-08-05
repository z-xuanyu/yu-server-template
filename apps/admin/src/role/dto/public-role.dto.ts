import { ApiProperty } from "@nestjs/swagger";
import { Transform, Expose } from "class-transformer";

export class PublicRoleDto {
  @ApiProperty({ title: '角色ID' })
  @Expose()
  id: number;

  @ApiProperty({ title: '角色名称' })
  @Expose()
  name: string;

  @ApiProperty({ title: '权限' })
  @Transform(({ value }) => {
    return value?.map((item: any) => item.permissionId);
  })
  @Expose()
  permissions?: number[];

  @ApiProperty({ title: '菜单' })
  @Transform(({ value }) => {
    return value?.map((item: any) => item?.menuId);
  })
  @Expose()
  menus?: number[];
}