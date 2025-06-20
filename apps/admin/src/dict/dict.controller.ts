/*
 * @Author: 阿宇 969718197@qq.com
 * @Date: 2025-06-11 17:43:08
 * @LastEditors: 阿宇 969718197@qq.com
 * @LastEditTime: 2025-06-17 16:16:34
 * @Description:
 */
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
import { DictService } from './dict.service';
import { CreateDictDto } from './dto/create-dict.dto';
import { UpdateDictDto } from './dto/update-dict.dto';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { apiSucceed } from '@app/common/response/result';
import { QueryDictDto } from './dto/query-dict.dto';
import { CreateDictAttrDto } from './dto/create-dict-attr.dto';
import { UpdateDictAttrDto } from './dto/update-dict-attr.dto';

@ApiTags('字典管理')
@Controller('dict')
export class DictController {
  constructor(private readonly dictService: DictService) {}

  @Post()
  @ApiOperation({ summary: '创建字典' })
  async create(@Body() createDictDto: CreateDictDto) {
    const res = await this.dictService.create(createDictDto);
    return apiSucceed(res);
  }

  @Get()
  @ApiOperation({ summary: '获取字典列表' })
  async findAll(@Query() query: QueryDictDto) {
    const res = await this.dictService.findAll(query);
    return apiSucceed(res);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取字典详情' })
  @ApiParam({ name: 'id', description: '字典id' })
  async findOne(@Param('id') id: string) {
    const res = await this.dictService.findOne(+id);
    return apiSucceed(res);
  }

  @Put(':id')
  @ApiOperation({ summary: '更新字典' })
  @ApiParam({ name: 'id', description: '字典id' })
  async update(@Param('id') id: string, @Body() updateDictDto: UpdateDictDto) {
    const res = await this.dictService.update(+id, updateDictDto);
    return apiSucceed(res);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除字典' })
  @ApiParam({ name: 'id', description: '字典id' })
  async remove(@Param('id') id: string) {
    const res = await this.dictService.remove(+id);
    return apiSucceed(res);
  }

  @Post(':id/attr')
  @ApiOperation({ summary: '添加字典属性' })
  @ApiParam({ name: 'id', description: '字典id' })
  async createDictAttr(
    @Param('id') id: string,
    @Body() createDictAttrDto: CreateDictAttrDto,
  ) {
    const res = await this.dictService.createDictAttr(+id, createDictAttrDto);
    return apiSucceed(res);
  }

  @Get(':id/attr')
  @ApiOperation({ summary: '获取字典属性列表' })
  @ApiParam({ name: 'id', description: '字典id' })
  async findDictAttr(@Param('id') id: string) {
    const res = await this.dictService.findDictAttr(+id);
    return apiSucceed(res);
  }

  @Put(':id/attr/:attrId')
  @ApiOperation({ summary: '更新字典属性' })
  @ApiParam({ name: 'attrId', description: '字典属性id' })
  async updateDictAttr(
    @Param('attrId') id: string,
    @Body() updateDictAttrDto: UpdateDictAttrDto,
  ) {
    const res = await this.dictService.updateDictAttr(+id, updateDictAttrDto);
    return apiSucceed(res);
  }

  @Delete(':id/attr/:attrId')
  @ApiOperation({ summary: '删除字典属性' })
  @ApiParam({ name: 'attrId', description: '字典属性id' })
  async removeDictAttr(@Param('attrId') id: string) {
    const res = await this.dictService.removeDictAttr(+id);
    return apiSucceed(res);
  }
}
