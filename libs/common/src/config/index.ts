import { IMailerConfig, MailerConfig, mailerRegToken } from './mailer.config';
import { OssConfig } from './oss.config';
import { IRedisConfig, RedisConfig, redisRegToken } from './redis.config';

export * from './redis.config';
export * from './mailer.config'
export * from './oss.config';


export interface AllConfigType {
  [redisRegToken]: IRedisConfig;
  [mailerRegToken]: IMailerConfig;
}

type PropType<T, Path extends string> = string extends Path
  ? unknown
  : Path extends keyof T
  ? T[Path]
  : Path extends `${infer K}.${infer R}`
  ? K extends keyof T
  ? PropType<T[K], R>
  : unknown
  : unknown;

/**
 * @description 获取获取对象类型中的所有key，支持嵌套
 */
type GetKeyOfObject<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
  ? `${Key}` | `${Key}.${GetKeyOfObject<ObjectType[Key]>}`
  : `${Key}`;
}[keyof ObjectType & (string | number)];

type RecordNamePaths<T extends object> = {
  [K in GetKeyOfObject<T>]: PropType<T, K>;
};
export type AllConfigKeyAndPath = RecordNamePaths<AllConfigType>;

export default {
  RedisConfig,
  OssConfig,
  MailerConfig
};