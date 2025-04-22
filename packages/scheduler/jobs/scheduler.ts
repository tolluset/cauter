import type { BinanceKline } from "../clients/binance.client";
import { BinanceCollector } from "../services/binance-collector";

// OHLCV 데이터를 객체 형태로 변환하는 함수
const convertToOHLCVObject = (klines: BinanceKline[]) => {
	return klines.map((kline) => ({
		openTime: new Date(kline[0]).toLocaleString("en-US", {
			timeZone: "Asia/Seoul",
		}), // KST로 변환
		open: kline[1],
		high: kline[2],
		low: kline[3],
		close: kline[4],
		volume: kline[5],
		closeTime: new Date(kline[6]).toLocaleString("en-US", {
			timeZone: "Asia/Seoul",
		}), // KST로 변환
		quoteVolume: kline[7],
		numberOfTrades: kline[8],
		takerBuyBaseVolume: kline[9],
		takerBuyQuoteVolume: kline[10],
	}));
};

export function startScheduler() {
	const collector = new BinanceCollector();

	// 다음 실행 시간 계산 함수
	const getNextExecutionTime = (intervalMinutes: number): number => {
		const now = new Date();
		const minutes = now.getMinutes();
		const nextExecution = new Date(now);

		// 다음 실행 시간 계산
		const minutesToAdd = intervalMinutes - (minutes % intervalMinutes);
		nextExecution.setMinutes(minutes + minutesToAdd);
		nextExecution.setSeconds(0);
		nextExecution.setMilliseconds(0);

		return nextExecution.getTime() - now.getTime();
	};

	// 1시간봉 - 매 15분마다 수집 (0, 15, 30, 45분)
	const schedule15Min = () => {
		const delay = getNextExecutionTime(15);

		setTimeout(async () => {
			try {
				const data: BinanceKline[] = await collector.collectHourlyKlines();
				const formattedData = convertToOHLCVObject(data); // 객체 형태로 변환

				console.log("1시간봉 데이터 수집 완료:");
				console.table(formattedData); // 수집된 데이터 로그를 테이블 형식으로 출력
			} catch (error) {
				console.error("1시간봉 데이터 수집 실패:", error);
			}
			schedule15Min(); // 다음 실행 예약
		}, delay);
	};

	// 4시간봉 - 매 1시간마다 수집 (정시)
	const schedule1Hour = () => {
		const delay = getNextExecutionTime(60);

		setTimeout(async () => {
			try {
				const data: BinanceKline[] = await collector.collect4HourKlines();
				const formattedData = convertToOHLCVObject(data); // 객체 형태로 변환
				console.log("4시간봉 데이터 수집 완료:");
				console.table(formattedData); // 수집된 데이터 로그를 테이블 형식으로 출력
			} catch (error) {
				console.error("4시간봉 데이터 수집 실패:", error);
			}
			schedule1Hour(); // 다음 실행 예약
		}, delay);
	};

	// 일봉 - 매일 오전 2시에 수집
	const scheduleDaily = () => {
		const now = new Date();
		const target = new Date(now);
		target.setHours(2, 0, 0, 0);

		if (now >= target) {
			target.setDate(target.getDate() + 1);
		}

		const delay = target.getTime() - now.getTime();

		setTimeout(async () => {
			try {
				const data: BinanceKline[] = await collector.collectDailyKlines();
				const formattedData = convertToOHLCVObject(data); // 객체 형태로 변환

				console.log("일봉 데이터 수집 완료:");
				console.table(formattedData); // 수집된 데이터 로그를 테이블 형식으로 출력
			} catch (error) {
				console.error("일봉 데이터 수집 실패:", error);
			}
			scheduleDaily(); // 다음 실행 예약
		}, delay);
	};

	// 초기 실행
	schedule15Min();
	schedule1Hour();
	scheduleDaily();

	console.log("바이낸스 데이터 수집 스케줄러가 시작되었습니다.");
}
