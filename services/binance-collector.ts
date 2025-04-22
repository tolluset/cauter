import { BinanceClient } from '../clients/binance.client';
import { Pool } from 'pg';
import { pool } from '../db/connection';

export class BinanceCollector {
  private binanceClient: BinanceClient;
  private db: Pool;

  constructor() {
    this.binanceClient = new BinanceClient();
    this.db = pool;
  }

  private async saveKlines(symbol: string, interval: string, klines: any[]) {
    const query = `
      INSERT INTO binance_klines (
        symbol, interval, open_time, open_price, high_price, low_price,
        close_price, volume, close_time, quote_asset_volume, number_of_trades,
        taker_buy_base_volume, taker_buy_quote_volume
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      ON CONFLICT (symbol, interval, open_time) DO NOTHING
    `;

    for (const kline of klines) {
      await this.db.query(query, [
        symbol,
        interval,
        new Date(kline[0]),
        kline[1],
        kline[2],
        kline[3],
        kline[4],
        kline[5],
        new Date(kline[6]),
        kline[7],
        kline[8],
        kline[9],
        kline[10]
      ]);
    }
  }

  async collectHourlyKlines() {
    const endTime = Date.now();
    const startTime = endTime - 2 * 60 * 60 * 1000; // 2시간 전
    const klines = await this.binanceClient.getKlines('BTCUSDT', '1h', {
      startTime,
      endTime,
      limit: 2
    });
    await this.saveKlines('BTCUSDT', '1h', klines);
  }

  async collect4HourKlines() {
    const endTime = Date.now();
    const startTime = endTime - 8 * 60 * 60 * 1000; // 8시간 전
    const klines = await this.binanceClient.getKlines('BTCUSDT', '4h', {
      startTime,
      endTime,
      limit: 2
    });
    await this.saveKlines('BTCUSDT', '4h', klines);
  }

  async collectDailyKlines() {
    const endTime = Date.now();
    const startTime = endTime - 2 * 24 * 60 * 60 * 1000; // 2일 전
    const klines = await this.binanceClient.getKlines('BTCUSDT', '1d', {
      startTime,
      endTime,
      limit: 2
    });
    await this.saveKlines('BTCUSDT', '1d', klines);
  }
} 