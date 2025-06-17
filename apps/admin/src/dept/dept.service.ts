import { Injectable } from '@nestjs/common';
import { CreateDeptDto } from './dto/create-dept.dto';
import { UpdateDeptDto } from './dto/update-dept.dto';
import { PrismaService } from '@app/db/prisma.service';
import { QueryDeptDto } from './dto/query-dept.dto';
import { ApiFail } from '@app/common/response/result';

@Injectable()
export class DeptService {
  constructor(private prisma: PrismaService) {}

  /**
   * 添加部门信息
   * @param createDeptDto 参数对象
   * @returns
   */
  async create(createDeptDto: CreateDeptDto) {
    try {
      return await this.prisma.sysDept.create({
        data: {
          ...createDeptDto,
        },
      });
    } catch (error) {
      throw new ApiFail(101, '添加部门失败');
    }
  }

  /**
   * 查询部门列表
   * @param queryDeptDto 参数对象
   * @returns
   */
  async findAll(queryDeptDto: QueryDeptDto) {
    const { name, page = 1, pageSize = 10 } = queryDeptDto;
    const where = name ? { name: { contains: name } } : {};
    const [list, total] = await this.prisma.$transaction([
      this.prisma.sysDept.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.sysDept.count({ where }),
    ]);
    return {
      items: list,
      total,
    };
  }
  /**
   * 查询部门详情
   * @param id 部门id
   * @returns
   * */
  async findOne(id: number) {
    return await this.prisma.sysDept.findUnique({
      where: { id },
    });
  }

  /**
   * 更新部门
   * @param id 部门id
   * @param updateDeptDto 参数对象
   * @returns
   */
  async update(id: number, updateDeptDto: UpdateDeptDto) {
    try {
      return await this.prisma.sysDept.update({
        where: { id },
        data: {
          ...updateDeptDto,
        },
      });
    } catch (error) {
      throw new ApiFail(101, '更新部门失败');
    }
  }
  /**
   * 删除部门
   * @param id 部门id
   * @returns
   */
  async remove(id: number) {
    try {
      return await this.prisma.sysDept.delete({
        where: { id },
      });
    } catch (error) {
      throw new ApiFail(101, '删除部门失败');
    }
  }
}
