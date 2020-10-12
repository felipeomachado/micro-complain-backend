import { RpcException } from '@nestjs/microservices';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';

const validComplain = {
  _id: '5f822543ad9cab1c444bcae5',
  title: 'Titulo Reclamação FORTALEZA',
  description: 'Descrição Reclamação FORTALEZA',
  locale: {
    _id: '5f822543ad9cab1c444bcae7',
    cityName: 'FORTALEZA'
  },
  company: {
    _id: '5f7f785851ff0b12185bbab7'
  }
}

describe('ComplainService', () => {
  let service: AppService;
  const mockModel = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn()    
  }

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        {
          provide: getModelToken('Complain'),
          useValue: mockModel
        }
      ],
    }).compile();

    service = module.get<AppService>(AppService);
  });

  beforeEach(() => {
    mockModel.findOne.mockReset();
    mockModel.create.mockReset();
    mockModel.save.mockReset();
    mockModel.find.mockReset();
    mockModel.findById.mockReset();
    mockModel.findByIdAndUpdate.mockReset();

  });
  
  describe('When search all Complains', () => {
    it('should be list all complains', async () => {

      mockModel.find.mockReturnValue([validComplain, validComplain]);
      
      const complainsFound = await service.findComplains(null);

      expect(complainsFound).toHaveLength(2);
      expect(mockModel.find).toHaveBeenCalledTimes(1);
      
    });
  })

  describe('When search Complain by Id', () => {
    it('should be find a existing complain', async () => {
    
      mockModel.findById.mockReturnValue(validComplain);

      const complainFound = await service.findComplainByIdOrThrow(validComplain._id);
  
      expect(complainFound).toMatchObject(validComplain);
      expect(mockModel.findById).toHaveBeenCalledTimes(1);
    });

    it('should return a exception when does not to find a complain', async () => {
      mockModel.findById.mockReturnValue(null);
      
      await service.findComplainByIdOrThrow('1111').catch(exception => {
        expect(exception).toBeInstanceOf(RpcException);
        expect(exception).toMatchObject({
          message: 'Complain not found'
        })
      })

      expect(mockModel.findById).toHaveBeenCalledTimes(1);
    });
  })

  describe('When update Complain', () => {
    it('should update a complain', async () => {

      const complainUpdated = {
        title: 'Titulo Reclamação TERESINA',
        description: 'Descrição Reclamação TERESINA',
      };

      mockModel.findByIdAndUpdate.mockReturnValue({
        ...validComplain,
        ...complainUpdated
      });

      await service.updateComplain(validComplain._id, complainUpdated);

      expect(mockModel.findByIdAndUpdate).toHaveBeenCalledTimes(1);
      
    });
  })

  describe('When search the number of Complains by geolocation', () => {
    const secondValidComplain = {
      _id: '5f822543ad9cab1c451bcae5',
      title: 'Titulo Reclamação TERESINA',
      description: 'Descrição Reclamação TERESINA',
      locale: {
        _id: '5f822543ad9cab1c444bcae6',
        cityName: 'TERESINA'
      },
      company: {
        _id: '5f7f764cd54df8373c372df1',
        name: 'Empresa A'
      }
    }

    const thirdValidComplain = {
      _id: '5f814783ad9cab1c451bcae5',
      title: 'Titulo Reclamação SAO LUIS',
      description: 'Descrição Reclamação SAO LUIS',
      locale: {
        _id: '5f822543ad9cab1c444bcae5',
        cityName: 'SAO LUIS'
      },
      company: {
        _id: '5f7f764cd54df8373c372df1',
        name: 'Empresa A'
      }
    }

    it('should be count a existing complains in a specifc city', async () => {
      
      mockModel.find.mockReturnValue([validComplain, secondValidComplain, thirdValidComplain]);

      const complainsFound = await service.countComplains({cityId: '5f822543ad9cab1c444bcae5', companyId: undefined});
      expect(complainsFound).toEqual(1);
      expect(mockModel.find).toHaveBeenCalledTimes(1);
    });

    it('should be count a existing complains in a specifc company', async () => {
      
      mockModel.find.mockReturnValue([validComplain, secondValidComplain, thirdValidComplain]);

      const complainsFound = await service.countComplains({cityId: undefined, companyId: '5f7f764cd54df8373c372df1'});
      expect(complainsFound).toEqual(2);
      expect(mockModel.find).toHaveBeenCalledTimes(1);
    });

    it('should be count a existing complains in a specifc company and city', async () => {
      
      mockModel.find.mockReturnValue([validComplain, secondValidComplain, thirdValidComplain]);

      const complainsFound = await service.countComplains({cityId: '5f822543ad9cab1c444bcae5', companyId: '5f7f764cd54df8373c372df1'});
      expect(complainsFound).toEqual(1);
      expect(mockModel.find).toHaveBeenCalledTimes(1);
    });
  })
});
