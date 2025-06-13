import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @ApiProperty({ title: '名称' })
    @IsNotEmpty()
    name: string;

    @ApiProperty({ title: '关联角色', required: false, default: [] })
    @IsArray()
    @IsOptional()
    @IsInt({ each: true })
    roleIds?: number[];
}
