/*
 * @Author: 阿宇 969718197@qq.com
 * @Date: 2025-03-07 11:22:19
 * @LastEditors: 阿宇 969718197@qq.com
 * @LastEditTime: 2025-03-21 11:00:37
 * @Description:
 */
import { AlipayController } from './alipay.controller';
import { Global, Module } from '@nestjs/common';
import { AlipayService } from './alipay.service';
import { AlipaySdk } from 'alipay-sdk';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
  controllers: [AlipayController],
  providers: [
    {
      inject: [ConfigService],
      provide: 'ALIPAY_SDK',
      useFactory: (configService: ConfigService) => {
        const appId = configService.get('ALIPAY_APP_ID');
        // const appId = configService.get('ALIPAY_SANDBOX_APP_ID');
        const privateKey = configService.get('ALI_PAY_PRIVATE_KEY');
        // const privateKey = configService.get('ALIPAY_SANDBOX_PRIVATE_KEY');
        const alipaySdk = new AlipaySdk({
          appId: appId,
          privateKey,
          // gateway: 'https://openapi-sandbox.dl.alipaydev.com/gateway.do',
          alipayRootCertPath: './certs/alipay/alipayRootCert.crt',
          // alipayRootCertPath: './certs/alipay_sandbox/alipayRootCert.crt',
          alipayPublicCertPath: './certs/alipay/alipayCertPublicKey_RSA2.crt',
          // alipayPublicCertPath: './certs/alipay_sandbox/alipayPublicCert.crt',
          appCertPath: './certs/alipay/appCertPublicKey_2021005127609432.crt',
          // appCertPath: './certs/alipay_sandbox/appPublicCert.crt',
        });
        return alipaySdk;
      },
    },
    AlipayService,
  ],
})
export class AlipayModule {}
