import { Controller, Get, Post, Body, Param, Delete, Put, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { apiSucceed } from '@app/common/response/result';
import { QueryUserDto } from './dto/query-user.dto';

@ApiTags('用户管理')
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  @ApiOperation({ summary: "新增用户" })
  async create(@Body() createUserDto: CreateUserDto) {
    const res = await this.userService.create(createUserDto);
    return apiSucceed(res);
  }

  @Get()
  @ApiOperation({ summary: "获取用户列表" })
  async findAll(@Query() queryUserDto: QueryUserDto) {
    const res = await this.userService.findAll(queryUserDto);
    return apiSucceed(res);
  }

  @Get(':id')
  @ApiOperation({ summary: "获取用户详情" })
  @ApiParam({ name: "id", description: "用户ID" })
  async findOne(@Param('id') id: string) {
    const res = await this.userService.findOne(+id);
    return apiSucceed(res);
  }

  @Put(':id')
  @ApiOperation({ summary: "修改用户" })
  @ApiParam({ name: "id", description: "用户ID" })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const res = await this.userService.update(+id, updateUserDto);
    return apiSucceed(res);
  }

  @Delete(':id')
  @ApiOperation({ summary: "删除用户" })
  @ApiParam({ name: "id", description: "用户ID" })
  async remove(@Param('id') id: string) {
    const res = await this.userService.remove(+id);
    return apiSucceed(res);
  }
}
