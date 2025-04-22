import { BinanceCollector } from "../services/binance-collector";

export async function verifyCollector() {
	const collector = new BinanceCollector();

	console.log("=== 1시간봉 데이터 수집 검증 ===");
	try {
		await collector.collectHourlyKlines();
		console.log("1시간봉 데이터 수집 성공");
	} catch (error) {
		console.error("1시간봉 데이터 수집 실패:", error);
	}

	console.log("\n=== 4시간봉 데이터 수집 검증 ===");
	try {
		await collector.collect4HourKlines();
		console.log("4시간봉 데이터 수집 성공");
	} catch (error) {
		console.error("4시간봉 데이터 수집 실패:", error);
	}

	console.log("\n=== 일봉 데이터 수집 검증 ===");
	try {
		await collector.collectDailyKlines();
		console.log("일봉 데이터 수집 성공");
	} catch (error) {
		console.error("일봉 데이터 수집 실패:", error);
	}
}
