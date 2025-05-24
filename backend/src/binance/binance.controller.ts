import { Controller, Get } from '@nestjs/common';
import { BinanceService } from './binance.service';

@Controller('binance')
export class BinanceController {
  constructor(private readonly binanceService: BinanceService) {}

  @Get('start')
  startConnection() {
    return this.binanceService.start();
  }

  @Get('stop')
  stopConnection() {
    return this.binanceService.stop();
  }
}
