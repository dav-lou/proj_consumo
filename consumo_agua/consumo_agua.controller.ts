import { Controller, Post, Body } from '@nestjs/common';
import { ConsumoAguaService } from './consumo_agua.service';
import { CreateConsumoAguaDto } from './dto/create-consumo_agua.dto';

@Controller('consumo-agua')
export class ConsumoAguaController {
  constructor(private readonly consumoAguaService: ConsumoAguaService) {}

  @Post()
  create(@Body() createConsumoAguaDto: CreateConsumoAguaDto) {
    return this.consumoAguaService.create(createConsumoAguaDto);
  }
}
