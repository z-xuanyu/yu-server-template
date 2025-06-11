import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";

export class PublicRoleDto {
 @ApiProperty({ title: '权限' })
 @Transform(({ value }) => {
    return value?.map((item: any)=>item.permissionId);
 })
 permissions?: number[];

 @ApiProperty({ title: '菜单' })
 @Transform(({ value }) => {
    return value?.map((item: any)=>item?.menuId);
 })
 menus?: number[];
}