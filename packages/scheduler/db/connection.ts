// db/connection.ts
import { Pool } from "pg";

// PostgreSQL 연결 풀 생성
export const pool = new Pool({
	user: process.env.DB_USER || "postgres",
	host: process.env.DB_HOST || "localhost",
	database: process.env.DB_NAME || "crypto_data",
	password: process.env.DB_PASSWORD || "password",
	port: parseInt(process.env.DB_PORT || "5432"),
});

// 연결 테스트 함수
export async function testConnection(): Promise<boolean> {
	try {
		const client = await pool.connect();
		const result = await client.query("SELECT NOW()");
		client.release();

		console.log("데이터베이스 연결 성공:", result.rows[0].now);
		return true;
	} catch (error) {
		console.error("데이터베이스 연결 실패:", error);
		return false;
	}
}
