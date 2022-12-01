import {
  ClientKafka,
  KafkaProducerOptions,
  RequestKafka,
} from './types/producer.type';
import {
  Inject,
  Injectable,
  Logger,
  OnApplicationBootstrap,
  OnModuleDestroy,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientKafka as ClientKafkaCommand } from '@nestjs/microservices';
import { Producer } from '@nestjs/microservices/external/kafka.interface';
import { KAFKA_PRODUCER_EXCEC } from '../constants';
import { v4 as uuidv4 } from 'uuid';
import { firstValueFrom, timeout } from 'rxjs';

@Injectable()
export class ProducerService
  implements OnApplicationBootstrap, OnModuleDestroy, ClientKafka
{
  public producer: Producer;

  constructor(
    @Inject(KAFKA_PRODUCER_EXCEC)
    private readonly clientKafka: ClientKafkaCommand,

    private readonly configService: ConfigService,
  ) {}

  /**
   * Connect đến Kafka khi application được init
   * Trong quá trình send hoặc init thì emit và send sẽ không dùng được
   */
  async onApplicationBootstrap(): Promise<void> {
    await this.clientKafka.connect().then((producer) => {
      this.producer = producer;
      Logger.log('[Nest-kafka] Kafka producer connected');
    });
  }

  async send<O = any, I = any>(
    event: string,
    data: I,
    options?: KafkaProducerOptions,
  ): Promise<O> {
    try {
      options = options || {};

      const time =
        this.configService.get('transporters.kafka.timeout') || 10000;
      const request: RequestKafka<I> = {
        key: uuidv4(),
        value: data,
        headers: options?.headers ? options.headers : undefined,
        context: options?.context ? options.context : undefined,
      };

      const message: O = await firstValueFrom(
        this.clientKafka
          .send<any, RequestKafka<I>>(event, request)
          .pipe(timeout(time)),
      );

      return message;
    } catch (error) {
      console.error('[Nest-kafka]', error);
      throw new ServiceUnavailableException(
        `Kafka message ${event} unavailable!`,
      );
    }
  }

  async emit<I = any>(event: string, data: I, options?: KafkaProducerOptions) {
    try {
      options = options || {};

      const request: RequestKafka<I> = {
        key: uuidv4(),
        value: data,
        headers: options?.headers ? options.headers : undefined,
        context: options?.context ? options.context : undefined,
      };

      const time =
        this.configService.get('transporters.kafka.timeout') || 10000;
      const emited = await firstValueFrom(
        this.clientKafka
          .emit<any, RequestKafka<I>>(event, request)
          .pipe(timeout(time)),
      );

      Logger.log('[Nest-kafka] Kafka message emited', event);
      return emited;
    } catch (error) {
      console.error('[Nest-kafka]', error);
      throw new ServiceUnavailableException(`Kafka emit event ${event} error!`);
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.clientKafka.close().then(() => {
      Logger.log('[Nest-kafka] Kafka producer disconnected');
    });
  }

  public getProducer(): Producer {
    return this.producer;
  }
}
