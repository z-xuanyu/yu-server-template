import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { apiSucceed } from '@app/common/response/result';

@ApiTags('账号管理')
@ApiBearerAuth()
@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post()
  @ApiOperation({ summary: "新增账号"  })
  async create(@Body() createAccountDto: CreateAccountDto) {
    const res = await this.accountService.create(createAccountDto);
    return apiSucceed(res);
  }

  @Get()
  @ApiOperation({ summary: "获取账号列表" })
  async findAll() {
    const res = await this.accountService.findAll();
    return apiSucceed(res);
  }

  @Get(':id')
  @ApiOperation({ summary: "获取账号详情" })
  @ApiParam({ name: "id", description: "账号ID" })
  async findOne(@Param('id') id: string) {
    const res = await this.accountService.findOne(+id);
    return apiSucceed(res);
  }

  @Put(':id')
  @ApiOperation({ summary: "修改账号" })
  @ApiParam({ name: "id", description: "账号ID" })
  async update(@Param('id') id: string, @Body() updateAccountDto: UpdateAccountDto) {
    const res = await this.accountService.update(+id, updateAccountDto);
    return apiSucceed(res);
  }

  @Delete(':id')
  @ApiOperation({ summary: "删除账号" })
  @ApiParam({ name: "id", description: "账号ID" })
  async remove(@Param('id') id: string) {
    const res = await this.accountService.remove(+id);
    return apiSucceed(res);
  }
}
