import { Inject } from '@nestjs/common';
import { ProducerService } from '../producer';

export function TransporterKafka(): (
  target: Record<string, any>,
  key: string | symbol,
  index?: number,
) => void {
  return Inject(ProducerService);
}
