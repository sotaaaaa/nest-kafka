import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { microserviceSetup } from '@sotaaaaa/nest-core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: { origin: '*' },
    bufferLogs: true,
  });

  const configService = app.get(ConfigService);

  await microserviceSetup(app, {
    serviceName: 'SERVICE_GATEWAY_V2',
    configPath:
      '/Users/sotaaaaa/Workspace/nestjs-package/nest-nats/samples/nest-microservice/configs.yaml',
    port: configService.get<number>('application.port') || 23700,
  });
}
bootstrap();
