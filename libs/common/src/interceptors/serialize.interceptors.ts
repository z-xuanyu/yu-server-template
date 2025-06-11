import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { map, Observable } from "rxjs";

@Injectable()
export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: any, private flag?: boolean) { }
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
    return next.handle().pipe(map((data) => {
      return plainToInstance(this.dto, data, {
        excludeExtraneousValues: this.flag,
        enableImplicitConversion: true
      })
    }))
  }
}