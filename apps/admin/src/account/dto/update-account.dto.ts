import { PartialType } from '@nestjs/mapped-types';
import { CreateAccountDto } from './create-account.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateAccountDto extends PartialType(CreateAccountDto) {
    @ApiProperty({ title: '名称' })
    @IsNotEmpty()
    name: string;

    @ApiProperty({ title: '关联角色', required: false, default: [] })
    @IsArray()
    @IsOptional()
    @IsInt({ each: true })
    roleIds?: number[];
}
