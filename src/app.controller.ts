import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { AppService } from './app.service';
import { QueryComplainDto } from './dtos/query-complain.dto';
import { Complain } from './interfaces/complain.interface';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  private logger = new Logger(AppController.name);

  @EventPattern('create-complain')
  async createComplain(@Payload() complain: Complain, @Ctx() rmqContext: RmqContext) {
    const channel = rmqContext.getChannelRef();
    const originalMessage = rmqContext.getMessage();
    
    try {
      await this.appService.createComplain(complain);
      await channel.ack(originalMessage);
    }catch(error) {
      this.logger.error(`error create-complain: ${JSON.stringify(error.message)}`);
    }
  }

  @MessagePattern('find-complains')
  async findComplains(@Payload() queryComplainDto: QueryComplainDto, @Ctx() rmqContext: RmqContext) {
    const channel = rmqContext.getChannelRef();
    const originalMessage = rmqContext.getMessage();
    
    try {
      return await this.appService.findComplains(queryComplainDto);
    }catch(error) {
      this.logger.error(`error find-complains: ${JSON.stringify(error.message)}`);
    } finally {
      await channel.ack(originalMessage);
    }
  }

  @MessagePattern('count-complains')
  async countComplains(@Payload() queryComplainDto: QueryComplainDto, @Ctx() rmqContext: RmqContext) {
    const channel = rmqContext.getChannelRef();
    const originalMessage = rmqContext.getMessage();
    
    try {
      return await this.appService.countComplains(queryComplainDto);
    }catch(error) {
      this.logger.error(`error count-complains: ${JSON.stringify(error.message)}`);
    } finally {
      await channel.ack(originalMessage);
    }
  }

  @MessagePattern('find-complain-by-id')
  async findComplainById(@Payload() _id: string, @Ctx() rmqContext: RmqContext) {
    const channel = rmqContext.getChannelRef();
    const originalMessage = rmqContext.getMessage();
    
    try {
      return await this.appService.findComplainByIdOrThrow(_id);
    }catch(error) {
      this.logger.error(`error find-complain-by-id: ${JSON.stringify(error.message)}`);
    } finally {
      await channel.ack(originalMessage);
    }
  }

  @EventPattern('update-complain')
  async updateCompany(@Payload() data: any, @Ctx() rmqContext: RmqContext) {
    const channel = rmqContext.getChannelRef();
    const originalMessage = rmqContext.getMessage();

    try {
      await this.appService.updateComplain(data.id, data.complain);
      await channel.ack(originalMessage);
    }catch(error) {
      this.logger.error(`error update-complain: ${JSON.stringify(error.message)}`);
    }
  }
}
