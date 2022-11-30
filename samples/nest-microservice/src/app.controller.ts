import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientNats, TransporterNats } from '@sotaaaaa/nest-nats';
import { MessagePattern, Transport } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,

    @TransporterNats()
    private readonly clientNats: ClientNats,
  ) {
    // setInterval(() => {
    //   this.clientNats.emit('event', { data: 1 });
    //   console.log('Nats emited');
    // }, 5000);
  }

  @Get('/test')
  async event() {
    const response = await this.clientNats.send('event', { data: 1 });
    return response;
  }

  @MessagePattern('event', Transport.NATS)
  async eventHandler() {
    return { status: 'ok' };
  }
}
