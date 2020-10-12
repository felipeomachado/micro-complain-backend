import { Injectable, Logger} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateComplainDto } from './dtos/create-complain.dto';
import { QueryComplainDto } from './dtos/query-complain.dto';
import { UpdateComplainDto } from './dtos/update-complain.dto';
import { Complain } from './interfaces/complain.interface';

@Injectable()
export class AppService {
  constructor(@InjectModel('Complain') private readonly complainModel: Model<Complain>) {}

  private readonly logger = new Logger(AppService.name);

  async createComplain(createComplainDto: CreateComplainDto): Promise<Complain> {
    try {
      const complainSaved = await new this.complainModel(createComplainDto).save();
      
      if(!complainSaved) {
        this.logger.error('Problem to create a complain');
        throw new RpcException('Problem to create a complain');
      }
      return complainSaved;
    }catch(exception) {
      this.logger.error(`error: ${JSON.stringify(exception.message)}`);
      throw new RpcException(exception.message);
    }
  }

  async findComplainByIdOrThrow(_id: string) : Promise<Complain> {
    try {
      const complain = this.complainModel.findById(_id); 

      if(!complain) {
        throw new RpcException('Complain not found');
      }
      return complain;
    }catch(exception) {
      this.logger.error(`error: ${JSON.stringify(exception.message)}`);
      throw new RpcException(exception.message);
    }
  }

  async findComplains(queryComplainDto: QueryComplainDto) : Promise<Array<Complain>> {
    try {
      /* need fix this, searching the solution... 
        query in nested document is not working
        ex: complainModel.find({'company._id': queryComplainDto.companyId})
      */
      const complainsFound = await this.complainModel.find();
      
      let complainsResult = complainsFound;
      
      if(queryComplainDto){
        if(queryComplainDto.cityId) {    
          complainsResult = complainsResult.filter(f => f.locale._id.toString() === queryComplainDto.cityId);
        }

        if(queryComplainDto.companyId) {
          complainsResult = complainsResult.filter(f => f.company._id.toString() === queryComplainDto.companyId);
        }
      }
      return complainsResult;
    }catch(exception) {
      this.logger.error(`error: ${JSON.stringify(exception.message)}`);
      throw new RpcException(exception.message);
    }
  }

  async countComplains(queryComplainDto: QueryComplainDto) : Promise<number> {
    try {
      return (await this.findComplains(queryComplainDto)).length;
    }catch(exception) {
      this.logger.error(`error: ${JSON.stringify(exception.message)}`);
      throw new RpcException(exception.message);
    }
  }

  async updateComplain(_id: string, updateComplainDto: UpdateComplainDto): Promise<void> {
    try {
      await this.complainModel.findByIdAndUpdate(_id, updateComplainDto);
    }catch(exception) {
      this.logger.error(`error: ${JSON.stringify(exception.message)}`);
      throw new RpcException(exception.message);
    }
  }
  
}
