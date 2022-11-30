import { ModuleMetadata, Type } from '@nestjs/common';
import { KafkaOptions } from '@nestjs/microservices';

export interface ProducerModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useExisting?: Type<any>;
  useClass?: Type<any>;
  useFactory?: (...args: any[]) => Promise<KafkaOptions['options']>;
  inject?: any[];
}

export type KafkaHeaders = {
  [key in string]: any;
};

export type KafkaContext = {
  [key in string]: any;
};

export interface KafkaProducerOptions {
  headers?: KafkaHeaders;
  context?: KafkaContext;
}

export interface RequestKafka<T = Record<string, string>> {
  key: string;
  value: T;
  headers?: KafkaHeaders;
  context?: KafkaContext;
}

export interface ClientKafka {
  send<O = any, I = any>(
    event: string,
    data: I,
    options?: KafkaProducerOptions,
  ): Promise<O>;

  emit<I = any>(event: string, data: I, options?: KafkaProducerOptions): void;
}
