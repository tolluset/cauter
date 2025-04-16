import { BinanceClient } from "./clients/binance.client";

// 환경 변수에서 API 키 로드
const apiKey = process.env.cmc_key || "";
const client = new BinanceClient();

async function main() {}

async function OHLCV() {
  const res = (await client.getKlines("BTCUSDT", "1d", {
    limit: 3,
  })) as [];

  console.table(
    res.map((kline) => ({
      DateOrigin: new Date(kline[0]).toISOString(),
      Date: new Date(kline[0]).toLocaleString(),
      Open: parseFloat(kline[1]),
      High: parseFloat(kline[2]),
      Low: parseFloat(kline[3]),
      Close: parseFloat(kline[4]),
      Volume: parseFloat(kline[5]),
      "Close Time": new Date(kline[6]).toLocaleString(),
      Trades: kline[8],
    })),
  );
}

// main();
OHLCV();
