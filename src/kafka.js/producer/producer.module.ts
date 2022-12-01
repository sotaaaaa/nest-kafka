import { DynamicModule, Global, Module, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport, KafkaOptions } from '@nestjs/microservices';
import { KAFKA_PRODUCER_EXCEC } from '../constants';
import { ProducerService } from './producer.service';

@Global()
@Module({})
export class ProducerModule {
  static registerAsync(): DynamicModule {
    const status = { enable: true };
    const imports = [
      ClientsModule.registerAsync([
        {
          inject: [ConfigService],
          name: KAFKA_PRODUCER_EXCEC,
          useFactory: async (configService: ConfigService) => {
            const options = configService.get('transporters.kafka.options');
            const enable = configService.get('transporters.kafka.enable');

            if (!enable) {
              Logger.log('[Nest-kafka] Kafka producer not enable');
              status.enable = false;
              return null;
            }

            return {
              transport: Transport.KAFKA,
              options: options,
            };
          },
        },
      ]),
    ];

    // Nếu không enable thì không register module
    if (!status.enable) {
      Logger.log('[Nest-kafka] Kafka producer not init');
      return {
        module: ProducerModule,
        imports: [],
      };
    }

    return {
      module: ProducerModule,
      providers: [ProducerService],
      exports: [ProducerService],
      imports: imports,
    };
  }

  static register(options: KafkaOptions['options']): DynamicModule {
    const imports = [
      ClientsModule.registerAsync([
        {
          name: KAFKA_PRODUCER_EXCEC,
          useFactory: async () => ({
            transport: Transport.KAFKA,
            options: options,
          }),
        },
      ]),
    ];

    return {
      module: ProducerModule,
      providers: [ProducerService],
      exports: [ProducerService],
      imports: imports,
    };
  }
}
