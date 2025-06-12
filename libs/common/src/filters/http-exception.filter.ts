/*
 * @Author: 阿宇 969718197@qq.com
 * @Date: 2024-03-06 13:45:53
 * @LastEditors: 阿宇 969718197@qq.com
 * @LastEditTime: 2024-06-12 15:00:53
 * @Description: 错误处理
 */
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger, } from '@nestjs/common';
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const result: any = exception?.getResponse();
    const errorResponse = {
      status,
      msg: result?.message || status === 429 ? '请求过于频繁，请稍后再试试。' : '服务器错误',
      code: 101, // 自定义code
      path: request.url, // 错误的url地址
      method: request.method, // 请求方式
      timestamp: new Date().toLocaleString(), // 错误的时间
    };
    // 打印日志
    Logger.error(
      `【${Date.now()}】${request.method} ${request.url}`,
      JSON.stringify(errorResponse),
      'HttpExceptionFilter',
    );
    // 设置返回的状态码、请求头、发送错误信息
    response.status(status);
    response.header('Content-Type', 'application/json; charset=utf-8');
    response.send(errorResponse);
  }
}
