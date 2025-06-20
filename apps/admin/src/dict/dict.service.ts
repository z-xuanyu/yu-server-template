import { Injectable } from '@nestjs/common';
import { CreateDictDto } from './dto/create-dict.dto';
import { UpdateDictDto } from './dto/update-dict.dto';
import { PrismaService } from '@app/db/prisma.service';
import { QueryDictDto } from './dto/query-dict.dto';
import { CreateDictAttrDto } from './dto/create-dict-attr.dto';
import { UpdateDictAttrDto } from './dto/update-dict-attr.dto';
import { ApiFail } from '@app/common/response/result';

@Injectable()
export class DictService {
  constructor(private prisma: PrismaService) {}

  /**
   * 添加字典
   * @param createDictDto 参数对象
   * @returns
   */
  async create(createDictDto: CreateDictDto) {
    return this.prisma.sysDict.create({
      data: {
        ...createDictDto,
      },
    });
  }

  /**
   * 获取字典列表
   * @param queryDictDto 参数对象
   * @returns
   */
  async findAll(queryDictDto: QueryDictDto) {
    const { name, code, page = 1, pageSize = 10 } = queryDictDto;
    const where = {
      name: {
        contains: name,
      },
      code: {
        contains: code,
      },
    };
    const [items, total] = await this.prisma.$transaction([
      this.prisma.sysDict.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        where,
      }),
      this.prisma.sysDict.count({
        where,
      }),
    ]);
    return {
      items,
      total,
    };
  }

  /**
   * 获取字典详情
   * @param id 字典id
   * @returns
   */
  async findOne(id: number) {
    return await this.prisma.sysDict.findUnique({
      where: {
        id,
      },
    });
  }

  /**
   * 更新字典
   * @param id 字典id
   * @param updateDictDto 参数对象
   * @returns
   */
  async update(id: number, updateDictDto: UpdateDictDto) {
    return await this.prisma.sysDict.update({
      where: {
        id,
      },
      data: {
        ...updateDictDto,
      },
    });
  }

  /**
   * 删除字段
   * @param id 字典id
   * @returns
   */
  async remove(id: number) {
    return await this.prisma.sysDict.delete({
      where: {
        id,
      },
    });
  }

  /**
   * 添加字典属性
   * @param id 字典id
   * @param createDictAttrDto 参数对象
   * @returns
   */
  async createDictAttr(id: number, createDictAttrDto: CreateDictAttrDto) {
    try {
      return await this.prisma.sysDictAttr.create({
        data: {
          ...createDictAttrDto,
          dictId: id,
        },
      });
    } catch (error) {
      throw new ApiFail(1001, '添加字典属性失败');
    }
  }

  /**
   * 获取字典属性列表
   * @param id 字典id
   * @returns
   */
  async findDictAttr(dictId: number) {
    const [total, items] = await this.prisma.$transaction([
      this.prisma.sysDictAttr.count({
        where: {
          dictId,
        },
      }),
      this.prisma.sysDictAttr.findMany({
        where: {
          dictId,
        },
        orderBy: {
          sort: 'asc',
        },
      }),
    ]);
    return {
      total,
      items,
    };
  }

  /**
   * 更新字典属性
   * @param id 字典属性id
   * @param updateDictAttrDto
   * @returns
   */
  async updateDictAttr(id: number, updateDictAttrDto: UpdateDictAttrDto) {
    return await this.prisma.sysDictAttr.update({
      where: {
        id,
      },
      data: {
        ...updateDictAttrDto,
      },
    });
  }

  /**
   * 删除字典属性
   * @param id 字典属性id
   * @returns
   */
  async removeDictAttr(id: number) {
    try {
      return await this.prisma.sysDictAttr.delete({
        where: {
          id,
        },
      });
    } catch (error) {
      console.error('删除字典属性失败:', error);
    }
  }
}
