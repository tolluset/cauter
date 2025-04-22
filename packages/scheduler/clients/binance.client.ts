// src/clients/binance.client.ts
import { WebSocket } from "ws";

interface BinanceKline {
  openTime: number;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
  closeTime: number;
  quoteVolume: string;
  trades: number;
  takerBuyVolume: string;
  takerBuyQuoteVolume: string;
  ignored?: string;
}

export class BinanceClient {
  private readonly apiKey: string;
  private readonly apiSecret: string;

  constructor(apiKey?: string, apiSecret?: string) {
    this.apiKey = apiKey || process.env.BINANCE_API_KEY || "";
    this.apiSecret = apiSecret || process.env.BINANCE_API_SECRET || "";

    if (!this.apiKey || !this.apiSecret) {
      throw new Error("바이낸스 API 키와 시크릿이 필요합니다");
    }
  }

  // REST API 기본 요청 메서드
  private async makeApiRequest<T>(
    endpoint: string,
    params: Record<string, string> = {},
  ): Promise<T> {
    const queryString = new URLSearchParams(params).toString();
    const url = `https://api.binance.com/api/v3/${endpoint}?${queryString}`;

    const response = await fetch(url, {
      headers: {
        "X-MBX-APIKEY": this.apiKey,
      },
    });

    if (!response.ok) {
      throw new Error(`바이낸스 API 요청 실패: ${response.status}`);
    }

    return (await response.json()) as T;
  }

  async ping() {
    const res = await this.makeApiRequest("ping");
    return res;
  }

  /**
    [
      [
        1499040000000,      // Kline open time
        "0.01634790",       // Open price
        "0.80000000",       // High price
        "0.01575800",       // Low price
        "0.01577100",       // Close price
        "148976.11427815",  // Volume
        1499644799999,      // Kline Close time
        "2434.19055334",    // Quote asset volume
        308,                // Number of trades
        "1756.87402397",    // Taker buy base asset volume
        "28.46694368",      // Taker buy quote asset volume
        "0"                 // Unused field, ignore.
      ]
  ]
  */
  // Kline/Candlestick 데이터 가져오기
  async getKlines(
    symbol: string,
    interval: string,
    options: {
      startTime?: number;
      endTime?: number;
      limit?: number;
    } = {},
  ): Promise<[]> {
    const params: Record<string, string> = {
      symbol: symbol.toUpperCase(),
      interval,
    };

    if (options.startTime) params.startTime = options.startTime.toString();
    if (options.endTime) params.endTime = options.endTime.toString();
    if (options.limit) params.limit = options.limit.toString();

    return this.makeApiRequest<[]>("klines", params);
  }
}
