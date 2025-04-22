// migrations/01_create_binance_klines.ts
import { Pool } from "pg";

export async function createBinanceKlinesTable(pool: Pool): Promise<void> {
  // 테이블 생성 쿼리
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS binance_klines (
      id SERIAL PRIMARY KEY,
      symbol VARCHAR(20) NOT NULL,
      interval VARCHAR(10) NOT NULL,
      open_time TIMESTAMP WITH TIME ZONE NOT NULL,
      close_time TIMESTAMP WITH TIME ZONE NOT NULL,
      open_price NUMERIC(24, 8) NOT NULL,
      high_price NUMERIC(24, 8) NOT NULL,
      low_price NUMERIC(24, 8) NOT NULL,
      close_price NUMERIC(24, 8) NOT NULL,
      volume NUMERIC(36, 8) NOT NULL,
      quote_asset_volume NUMERIC(36, 8) NOT NULL,
      number_of_trades INTEGER NOT NULL,
      taker_buy_base_volume NUMERIC(36, 8) NOT NULL,
      taker_buy_quote_volume NUMERIC(36, 8) NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      
      UNIQUE(symbol, interval, open_time)
    );
  `;

  // 인덱스 생성 쿼리
  const createIndexesQuery = `
    CREATE INDEX IF NOT EXISTS idx_binance_klines_symbol ON binance_klines(symbol);
    CREATE INDEX IF NOT EXISTS idx_binance_klines_interval ON binance_klines(interval);
    CREATE INDEX IF NOT EXISTS idx_binance_klines_open_time ON binance_klines(open_time);
  `;

  try {
    // 트랜잭션 시작
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      // 테이블 생성
      await client.query(createTableQuery);
      console.log("binance_klines 테이블이 생성되었습니다.");

      // 인덱스 생성
      await client.query(createIndexesQuery);
      console.log("인덱스가 생성되었습니다.");

      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("테이블 생성 중 오류 발생:", error);
    throw error;
  }
}
