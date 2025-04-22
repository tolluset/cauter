// tests/testTable.ts
import { pool, testConnection } from "./connection";

async function testTable() {
	try {
		// 연결 테스트
		const connected = await testConnection();
		if (!connected) {
			console.error("데이터베이스 연결에 실패했습니다.");
			process.exit(1);
		}

		// 테스트용 데이터 삽입
		const client = await pool.connect();
		try {
			// 테스트 데이터 삽입
			const insertQuery = `
        INSERT INTO binance_klines (
          symbol, interval, open_time, close_time, 
          open_price, high_price, low_price, close_price, 
          volume, quote_asset_volume, number_of_trades,
          taker_buy_base_volume, taker_buy_quote_volume
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        RETURNING id;
      `;

			const now = new Date();
			const oneDayLater = new Date(now.getTime() + 24 * 60 * 60 * 1000);

			const values = [
				"BTCUSDT", // symbol
				"1d", // interval
				now, // open_time
				oneDayLater, // close_time
				50000.12, // open_price
				51000.34, // high_price
				49500.56, // low_price
				50800.78, // close_price
				100.123456, // volume
				5000000.98765432, // quote_asset_volume
				12345, // number_of_trades
				60.12345678, // taker_buy_base_volume
				3000000.87654321, // taker_buy_quote_volume
			];

			const result = await client.query(insertQuery, values);
			console.log("테스트 데이터 삽입 성공. ID:", result.rows[0].id);

			// 데이터 확인
			const selectQuery = `
        SELECT * FROM binance_klines WHERE symbol = 'BTCUSDT' ORDER BY open_time DESC LIMIT 1;
      `;

			const selectResult = await client.query(selectQuery);
			console.log("삽입된 데이터 조회 결과:");
			console.table(selectResult.rows[0]);

			// 테스트 완료 후 테스트 데이터 삭제
			console.log("테스트 데이터 정리 중...");
			const deleteQuery = "DELETE FROM binance_klines WHERE id = $1";
			await client.query(deleteQuery, [result.rows[0].id]);
			console.log("테스트 데이터가 정리되었습니다.");
		} finally {
			client.release();
		}
	} catch (error) {
		console.error("테이블 테스트 중 오류 발생:", error);
	} finally {
		await pool.end();
	}
}

// 테스트 실행
testTable();
