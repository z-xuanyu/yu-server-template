/**
 * 是否为数组
 * @param value 
 * @returns 
 */
export function isArray(value: any): value is any[] {
  return value && typeof value === 'object' && value.constructor === Array;
}