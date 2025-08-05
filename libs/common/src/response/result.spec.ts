import { apiSucceed, apiSucceedWithTransform, apiSucceedWithPagination } from './result';
import { Expose, Transform } from 'class-transformer';

// 测试用的 DTO 类
class TestDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Transform(({ value }) => value?.map((item: any) => item.id))
  @Expose()
  items?: number[];
}

describe('Response Result Functions', () => {
  describe('apiSucceed', () => {
    it('should return success response with data', () => {
      const data = { id: 1, name: 'test' };
      const result = apiSucceed(data);

      expect(result).toEqual({
        code: 0,
        data,
        message: '成功',
      });
    });

    it('should return success response without data', () => {
      const result = apiSucceed();

      expect(result).toEqual({
        code: 0,
        data: undefined,
        message: '成功',
      });
    });
  });

  describe('apiSucceedWithTransform', () => {
    it('should transform data using DTO', () => {
      const rawData = {
        id: 1,
        name: 'test',
        items: [{ id: 1 }, { id: 2 }],
        extraField: 'should be excluded'
      };

      const result = apiSucceedWithTransform(rawData, TestDto, {
        excludeExtraneousValues: true
      });

      expect(result.code).toBe(0);
      expect(result.message).toBe('成功');
      expect(result.data).toEqual({
        id: 1,
        name: 'test',
        items: [1, 2]
      });
      expect(result.data).not.toHaveProperty('extraField');
    });

    it('should transform data without excluding extraneous values', () => {
      const rawData = {
        id: 1,
        name: 'test',
        items: [{ id: 1 }],
        extraField: 'should be included'
      };

      const result = apiSucceedWithTransform(rawData, TestDto, {
        excludeExtraneousValues: false
      });

      expect(result.data).toHaveProperty('extraField');
    });
  });

  describe('apiSucceedWithPagination', () => {
    it('should transform pagination data using DTO', () => {
      const paginationData = {
        total: 2,
        items: [
          { id: 1, name: 'test1', items: [{ id: 1 }] },
          { id: 2, name: 'test2', items: [{ id: 2 }] }
        ]
      };

      const result = apiSucceedWithPagination(paginationData, TestDto, {
        excludeExtraneousValues: true
      });

      expect(result.code).toBe(0);
      expect(result.message).toBe('成功');
      expect(result.data.total).toBe(2);
      expect(result.data.items).toEqual([
        { id: 1, name: 'test1', items: [1] },
        { id: 2, name: 'test2', items: [2] }
      ]);
    });
  });
}); 