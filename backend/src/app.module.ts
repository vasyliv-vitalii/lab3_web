import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth.controller/auth.controller.controller';
import { BinanceService } from './binance/binance.service';
import { BinanceController } from './binance/binance.controller';
import { SocketGateway } from './binance/SocketGateway'; 
@Module({
  imports: [],
  controllers: [AppController, AuthController, BinanceController],
  providers: [AppService, BinanceService,SocketGateway],
})
export class AppModule {}
