import { getDb } from "@/lib/mongodb";
import { profile } from "@/data/profile";

type ClickDoc = { _id: string; count: number };

const COLLECTION = "clicks";
const validIds = new Set(profile.links.map((link) => link.id));

/** 모든 링크의 현재 클릭 수를 한 번에 반환합니다. 예: { counts: { youtube: 42 } } */
export async function GET() {
  try {
    const db = await getDb();
    const docs = await db
      .collection<ClickDoc>(COLLECTION)
      .find({ _id: { $in: [...validIds] } })
      .toArray();

    const counts: Record<string, number> = {};
    for (const doc of docs) counts[doc._id] = doc.count;

    return Response.json({ counts });
  } catch (error) {
    console.error("클릭 수 조회 실패:", error);
    return Response.json({ error: "클릭 수를 불러오지 못했습니다." }, { status: 500 });
  }
}

/** 요청 본문 { id } 에 해당하는 링크의 클릭 수를 1 늘립니다. */
export async function POST(request: Request) {
  let id: unknown;
  try {
    ({ id } = await request.json());
  } catch {
    return Response.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  if (typeof id !== "string" || !validIds.has(id)) {
    return Response.json({ error: "존재하지 않는 링크입니다." }, { status: 400 });
  }

  try {
    const db = await getDb();
    const doc = await db
      .collection<ClickDoc>(COLLECTION)
      .findOneAndUpdate(
        { _id: id },
        { $inc: { count: 1 } },
        { upsert: true, returnDocument: "after" },
      );

    return Response.json({ id, count: doc?.count ?? 1 });
  } catch (error) {
    console.error("클릭 수 증가 실패:", error);
    return Response.json({ error: "클릭 수를 저장하지 못했습니다." }, { status: 500 });
  }
}
