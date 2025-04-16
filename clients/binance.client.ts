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
  private async makeApiRequest(
    endpoint: string,
    params: Record<string, string> = {},
  ) {
    const queryString = new URLSearchParams(params).toString();
    const url = `https://api.binance.com/api/v3/${endpoint}?${queryString}`;

    const response = await fetch(url, {
      headers: {
        "X-MBX-APIKEY": this.apiKey,
      },
    });
    console.info("🚀 : binance.client.ts:40: response=", response);

    if (!response.ok) {
      throw new Error(`바이낸스 API 요청 실패: ${response.status}`);
    }

    return await response.json();
  }

  // 시그니처 생성 (private API용)
  private generateSignature(queryString: string): string {
    const crypto = require("crypto");
    return crypto
      .createHmac("sha256", this.apiSecret)
      .update(queryString)
      .digest("hex");
  }

  async ping() {
    const res = await this.makeApiRequest("ping");
    return res;
  }

  // Kline/Candlestick 데이터 가져오기
  async getKlines(
    symbol: string,
    interval: string,
    options: {
      startTime?: number;
      endTime?: number;
      limit?: number;
    } = {},
  ) {
    const params: Record<string, string> = {
      symbol: symbol.toUpperCase(),
      interval,
    };

    if (options.startTime) params.startTime = options.startTime.toString();
    if (options.endTime) params.endTime = options.endTime.toString();
    if (options.limit) params.limit = options.limit.toString();

    return this.makeApiRequest("klines", params);
  }
}
