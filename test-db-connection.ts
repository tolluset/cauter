import { Client } from "pg";

// Docker Compose에서 설정한 값으로 연결 정보 구성
const dbConfig = {
  user: "myuser", // POSTGRES_USER
  password: "mypassword", // POSTGRES_PASSWORD
  host: "localhost", // Docker가 실행 중인 호스트
  port: 5432, // 매핑된 포트
  database: "mydatabase", // POSTGRES_DB
};

async function testConnection() {
  const client = new Client(dbConfig);

  try {
    console.log("PostgreSQL에 연결을 시도합니다...");
    await client.connect();
    console.log("✅ PostgreSQL 연결 성공!");

    // 간단한 쿼리 실행 테스트
    const res = await client.query("SELECT $1::text as message", [
      "Docker PostgreSQL 연결 테스트",
    ]);
    console.log("쿼리 결과:", res.rows[0].message);

    // PostgreSQL 버전 확인
    const versionRes = await client.query("SELECT version()");
    console.log("PostgreSQL 버전:", versionRes.rows[0].version);
  } catch (err) {
    console.error("❌ 연결 실패:", err);
  } finally {
    await client.end();
    console.log("연결이 종료되었습니다.");
  }
}

testConnection();
