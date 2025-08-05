import { repl } from '@nestjs/core'

import { AdminModule } from './admin.module'

async function bootstrap() {
  const replServer = await repl(AdminModule)
  replServer.setupHistory('.nestjs_repl_history', (err) => {
    if (err)
      console.error(err)
  })
}
bootstrap()
