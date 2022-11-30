import { DynamicModule, Module } from '@nestjs/common';
import { KafkaOptions } from '@nestjs/microservices';
import { ProducerModule } from './producer';

@Module({})
export class KafkaCoreModule {
  /**
   * Phục vụ những người không dùng với nest-core
   * Lưu ý: Nếu dùng với nest-core thì không dùng hàm này
   * @param options
   * @returns
   */
  static forRoot(options: KafkaOptions['options']): DynamicModule {
    return {
      module: KafkaCoreModule,
      imports: [ProducerModule.register(options)],
    };
  }

  /**
   * Phục vụ những người dùng kết hợp với thư viện nest-core
   * Các config lúc này sẽ được load từ một chỗ
   */
  static forPlugin(): DynamicModule {
    return {
      module: KafkaCoreModule,
      imports: [ProducerModule.registerAsync()],
    };
  }
}
