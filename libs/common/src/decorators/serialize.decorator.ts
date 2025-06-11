import { UseInterceptors } from "@nestjs/common";
import { SerializeInterceptor } from "../interceptors/serialize.interceptors";

export interface ClassConstructor {
  new(...args: any[]): any;
}

export function Serialize(dto: ClassConstructor, flag?: boolean) {
  return UseInterceptors(new SerializeInterceptor(dto, flag));
}