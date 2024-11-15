import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConsumoAgua } from './consumo_agua.model';
import { CreateConsumoAguaDto } from './dto/create-consumo_agua.dto';

@Injectable()
export class ConsumoAguaService {
  constructor(
    @InjectModel(ConsumoAgua.name)
    private readonly consumoAguaModel: Model<ConsumoAgua>,
  ) {}

  async create(
    createConsumoAguaDto: CreateConsumoAguaDto,
  ): Promise<ConsumoAgua> {
    const createdConsumoAgua = new this.consumoAguaModel(createConsumoAguaDto);
    return createdConsumoAgua.save();
  }

  async findAll(
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<ConsumoAgua[]> {
    return this.consumoAguaModel
      .find({
        userId,
        dataLeitura: { $gte: startDate, $lte: endDate },
      })
      .exec();
  }

  async checkForAlerts(userId: string): Promise<string> {
    const consumos = await this.consumoAguaModel
      .find({ userId })
      .sort({ dataLeitura: -1 })
      .limit(2)
      .exec();
    if (consumos.length < 2) {
      return 'Not enough data to generate alerts';
    }
    const [currentMonth, lastMonth] = consumos;
    if (currentMonth.quantidade > lastMonth.quantidade) {
      return 'Alert: High water consumption detected!';
    }
    return 'Water consumption is within normal limits';
  }
}
