import { Injectable } from '@nestjs/common';
import { CreateDeptDto } from './dto/create-dept.dto';
import { UpdateDeptDto } from './dto/update-dept.dto';
import { PrismaService } from '@app/db/prisma.service';
import { QueryDeptDto } from './dto/query-dept.dto';

@Injectable()
export class DeptService {
  constructor(private prisma: PrismaService) { }

  /**
   * 添加部门信息
   * @param createDeptDto 参数对象
   * @returns 
   */
  async create(createDeptDto: CreateDeptDto) {
    return await this.prisma.sysDept.create({
      data: {
        ...createDeptDto,
      },
    })
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
    }
  }
 /**
  * 查询部门详情
  * @param id 部门id
  * @returns
  * */
  async findOne(id: number) {
    return await this.prisma.sysDept.findUnique({
      where: { id },
    })
  }

  /**
   * 更新部门
   * @param id 部门id
   * @param updateDeptDto 参数对象 
   * @returns 
   */
  async update(id: number, updateDeptDto: UpdateDeptDto) {
    return await this.prisma.sysDept.update({
      where: { id },
      data: {
        ...updateDeptDto,
      },
    })
  }
  /**
   * 删除部门
   * @param id 部门id
   * @returns
   */
  async remove(id: number) {
    return await this.prisma.sysDept.delete({
      where: { id },
    })
  }
}
