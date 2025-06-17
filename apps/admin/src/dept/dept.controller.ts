import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Put,
} from '@nestjs/common';
import { DeptService } from './dept.service';
import { CreateDeptDto } from './dto/create-dept.dto';
import { UpdateDeptDto } from './dto/update-dept.dto';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { apiSucceed } from '@app/common/response/result';
import { QueryDeptDto } from './dto/query-dept.dto';

@ApiTags('部门管理')
@Controller('dept')
export class DeptController {
  constructor(private readonly deptService: DeptService) {}

  @Post()
  @ApiOperation({ summary: '添加部门' })
  async create(@Body() createDeptDto: CreateDeptDto) {
    const res = await this.deptService.create(createDeptDto);
    return apiSucceed(res);
  }

  @Get()
  @ApiOperation({ summary: '查询部门列表' })
  async findAll(@Query() queryDeptDto: QueryDeptDto) {
    const res = await this.deptService.findAll(queryDeptDto);
    return apiSucceed(res);
  }

  @Get(':id')
  @ApiOperation({ summary: '查询部门详情' })
  @ApiParam({ name: 'id', description: '部门id' })
  async findOne(@Param('id') id: string) {
    const res = await this.deptService.findOne(+id);
    return apiSucceed(res);
  }

  @Put(':id')
  @ApiOperation({ summary: '更新部门' })
  @ApiParam({ name: 'id', description: '部门id' })
  async update(@Param('id') id: string, @Body() updateDeptDto: UpdateDeptDto) {
    const res = await this.deptService.update(+id, updateDeptDto);
    return apiSucceed(res);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除部门' })
  @ApiParam({ name: 'id', description: '部门id' })
  async remove(@Param('id') id: string) {
    const res = await this.deptService.remove(+id);
    return apiSucceed(res);
  }
}
