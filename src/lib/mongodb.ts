import { MongoClient, type Db } from "mongodb";

const uri = process.env.MONGODB_URI;

// 개발 모드에서는 핫 리로드마다 모듈이 다시 실행되므로,
// 연결을 전역에 보관해 커넥션이 계속 늘어나지 않게 합니다.
const globalForMongo = globalThis as unknown as {
  _mongoClientPromise?: Promise<MongoClient>;
};

function getClientPromise(): Promise<MongoClient> {
  if (!uri) {
    throw new Error("MONGODB_URI 환경 변수가 설정되지 않았습니다 (.env.local 확인).");
  }
  if (!globalForMongo._mongoClientPromise) {
    globalForMongo._mongoClientPromise = new MongoClient(uri).connect();
  }
  return globalForMongo._mongoClientPromise;
}

/** URI에 지정된 기본 데이터베이스(예: kyoodol_db)를 반환합니다. */
export async function getDb(): Promise<Db> {
  const client = await getClientPromise();
  return client.db();
}
