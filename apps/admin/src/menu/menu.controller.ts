import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { MenuService } from './menu.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { apiSucceed } from '@app/common/response/result';

@ApiTags('菜单管理')
@ApiBearerAuth()
@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post()
  @ApiOperation({ summary: '添加菜单' })
  async create(@Body() createMenuDto: CreateMenuDto) {
    const res = await this.menuService.create(createMenuDto);
    return apiSucceed(res);
  }

  @Get()
  @ApiOperation({ summary: '获取菜单列表' })
  async findAll() {
    const res = await this.menuService.findAll();
    return apiSucceed(res);
  }

  @Get(':id')
  @ApiParam({ name: 'id', description: '菜单id' })
  @ApiOperation({ summary: '菜单详细' })
  async findOne(@Param('id') id: string) {
    const res = await this.menuService.findOne(+id);
    return apiSucceed(res);
  }

  @Put(':id')
  @ApiOperation({ summary: '更新菜单' })
  @ApiParam({ name: 'id', description: '菜单id' })
  async update(@Param('id') id: string, @Body() updateMenuDto: UpdateMenuDto) {
    const rse = await this.menuService.update(+id, updateMenuDto);
    return apiSucceed(rse);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除菜单' })
  @ApiParam({ name: 'id', description: '菜单id' })
  async remove(@Param('id') id: string) {
    const res = await this.menuService.remove(+id);
    return apiSucceed(res);
  }
}
