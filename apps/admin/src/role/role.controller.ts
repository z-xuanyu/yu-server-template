import { Controller, Get, Post, Body, Param, Delete, Put, Query } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { apiSucceed, apiSucceedWithPagination } from '@app/common/response/result';
import { PublicRoleDto } from './dto/public-role.dto';
import { QueryRoleDto } from './dto/query-role.dto';


@ApiTags('角色管理')
@ApiBearerAuth()
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @ApiOperation({ summary: '添加角色' })
  async create(@Body() createRoleDto: CreateRoleDto) {
    const res = await this.roleService.create(createRoleDto);
    return apiSucceed(res);
  }

  @Get()
  @ApiOperation({ summary: '查询所有角色' })
  async findAll(@Query() query: QueryRoleDto) {
    const res: any = await this.roleService.findAll(query);
    return apiSucceedWithPagination(res, PublicRoleDto);
  }

  @Get(':id')
  @ApiOperation({ summary: '查询角色详情' })
  @ApiParam({ name: 'id', description: '角色ID' })
  async findOne(@Param('id') id: string) {
    const res = await this.roleService.findOne(+id);
    return apiSucceed(res);
  }

  @Put(':id')
  @ApiOperation({ summary: '更新角色' })
  @ApiParam({ name: 'id', description: '角色ID' })
  async update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    const res = await this.roleService.update(+id, updateRoleDto);
    return apiSucceed(res);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除角色' })
  @ApiParam({ name: 'id', description: '角色ID' })
  async remove(@Param('id') id: string) {
    const res = await this.roleService.remove(+id);
    return apiSucceed(res);
  }
}
