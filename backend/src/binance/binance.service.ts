import { Injectable, Logger } from '@nestjs/common';
import * as WebSocket from 'ws';
import { Trade } from 'src/protobuf/generated/trade'; 
import { SocketGateway } from './SocketGateway';

@Injectable()
export class BinanceService {
  private binanceWs: WebSocket | null = null;
  private isConnected = false;
  private readonly logger = new Logger(BinanceService.name);
  private readonly streamUrl =
    'wss://stream.binance.com:9443/stream?streams=btcusdt@trade/ethusdt@trade/bnbusdt@trade';

  constructor(private readonly socketGateway: SocketGateway) {}

  start() {
    if (this.isConnected) {
      return { status: 'already_connected', message: 'Already connected to Binance' };
    }

    try {
      this.connectToBinance();
      return { status: 'connecting', message: 'Connecting to Binance...' };
    } catch (error) {
      this.logger.error('Connection error:', error);
      return { status: 'error', message: 'Failed to connect' };
    }
  }

  stop() {
    if (this.binanceWs) {
      this.binanceWs.close();
      this.binanceWs = null;
      this.isConnected = false;
      return { status: 'disconnected', message: 'Connection closed' };
    }
    return { status: 'not_connected', message: 'No active connection' };
  }

  private connectToBinance() {
    this.binanceWs = new WebSocket(this.streamUrl);
    this.isConnected = true;

    this.binanceWs.on('open', () => {
      this.logger.log('Successfully connected to Binance');
    });

    this.binanceWs.on('message', (data: Buffer) => {
      this.processData(data);
    });

    this.binanceWs.on('error', (error) => {
      this.logger.error('WebSocket error:', error);
      this.reconnect();
    });

    this.binanceWs.on('close', () => {
      this.logger.log('Connection closed');
      this.reconnect();
    });
  }

  private reconnect() {
    if (this.isConnected) {
      this.logger.log('Attempting reconnect in 3s...');
      setTimeout(() => this.connectToBinance(), 3000);
    }
  }

  private processData(data: Buffer) {
    try {
      const jsonData = JSON.parse(data.toString());

      const stream = jsonData.stream;
      const tradeData = jsonData.data;

      const trade = Trade.fromJSON({
        stream,
        coin: tradeData.s,
        price: tradeData.p,
        quantity: tradeData.q,
        tradeTime: tradeData.T.toString()
      });

      this.socketGateway.sendTradeData(trade);
    } catch (error) {
      this.logger.error('Data processing error:', error);
    }
  }
}
