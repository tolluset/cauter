// setup/setupDatabase.ts
import { pool, testConnection } from "./connection";
import { createBinanceKlinesTable } from "./migrations/01_create_binance_klines";

async function setup() {
	try {
		// 연결 테스트
		const connected = await testConnection();
		if (!connected) {
			console.error(
				"데이터베이스 연결에 실패했습니다. 환경 설정을 확인해주세요.",
			);
			process.exit(1);
		}

		// 테이블 생성
		await createBinanceKlinesTable(pool);

		console.log("데이터베이스 셋업이완료되었습니다.");
	} catch (error) {
		console.error("데이터베이스 셋업 중 오류 발생:", error);
		process.exit(1);
	} finally {
		// 연결 풀 종료
		await pool.end();
	}
}

// 스크립트 실행
setup();
