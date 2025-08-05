import { Module, Provider } from '@nestjs/common'
import { AdminEventsGateway } from './events/admin.gateway'
import { AuthModule } from '../auth/auth.module'


const providers: Provider[] = [AdminEventsGateway]

@Module({
  imports: [AuthModule],
  providers,
  exports: [...providers],
})
export class SocketModule { }
