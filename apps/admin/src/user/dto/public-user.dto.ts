import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';

export class PublicUserDto {
  @ApiProperty({ title: '用户ID' })
  @Expose()
  id: number;

  @ApiProperty({ title: '用户名' })
  @Expose()
  username: string;

  @ApiProperty({ title: '昵称' })
  @Expose()
  nickname: string;

  @ApiProperty({ title: '邮箱' })
  @Expose()
  email: string;

  @ApiProperty({ title: '手机号' })
  @Expose()
  phone: string;

  @ApiProperty({ title: '状态' })
  @Expose()
  status: number;

  @ApiProperty({ title: '创建时间' })
  @Expose()
  createdAt: Date;

  @ApiProperty({ title: '角色' })
  @Transform(({ value }) => {
    return value?.map((role: any) => ({
      id: role.roleId,
      name: role.role?.name
    }));
  })
  @Expose()
  roles?: Array<{ id: number; name: string }>;

  // 排除敏感信息如密码等
}