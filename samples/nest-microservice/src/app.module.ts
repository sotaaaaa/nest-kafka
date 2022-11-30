import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoreModule } from '@sotaaaaa/nest-core';
import { NatsCoreModule } from '@sotaaaaa/nest-nats';

@Module({
  imports: [
    CoreModule.register({
      path: '/Users/sotaaaaa/Workspace/nestjs-package/nest-nats/samples/nest-microservice/configs.yaml',
      plugins: [NatsCoreModule.forPlugin()],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
