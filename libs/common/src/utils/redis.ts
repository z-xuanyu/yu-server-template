import { RedisKey } from "../constants/cache.constant";

type Prefix = 'nest-ayu';
const prefix = 'nest-ayu';

export function getRedisKey<T extends string = RedisKey | '*'>(
  key: T,
  ...concatKeys: string[]
): `${Prefix}:${T}${string | ''}` {
  return `${prefix}:${key}${
    concatKeys && concatKeys.length ? `:${concatKeys.join('_')}` : ''
  }`;
}
