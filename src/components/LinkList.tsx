"use client";

import { useEffect, useState } from "react";
import LinkCard from "@/components/LinkCard";
import type { LinkItem } from "@/data/profile";

type Props = {
  links: LinkItem[];
};

export default function LinkList({ links }: Props) {
  // 데이터를 받기 전에는 모두 0회로 표시합니다.
  const [counts, setCounts] = useState<Record<string, number>>({});

  // 페이지가 열릴 때 모든 링크의 클릭 수를 한 번에 가져옵니다.
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/clicks", { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((data: { counts: Record<string, number> }) => {
        // 응답 도착 전에 클릭한 경우가 있어도 더 큰 값을 유지합니다.
        setCounts((prev) => {
          const next = { ...data.counts };
          for (const [id, n] of Object.entries(prev)) {
            next[id] = Math.max(next[id] ?? 0, n);
          }
          return next;
        });
      })
      .catch((error) => {
        if (controller.signal.aborted) return;
        console.error("클릭 수를 불러오지 못했습니다:", error);
      });
    return () => controller.abort();
  }, []);

  function handleClick(id: string) {
    // 화면에는 바로 +1 반영하고, 서버에 저장 요청을 보냅니다.
    setCounts((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }));

    fetch("/api/clicks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
      keepalive: true,
    })
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((data: { id: string; count: number }) => {
        setCounts((prev) => ({ ...prev, [data.id]: Math.max(prev[data.id] ?? 0, data.count) }));
      })
      .catch((error) => console.error("클릭 수를 저장하지 못했습니다:", error));
  }

  return (
    <ul className="mt-8 flex flex-col gap-4">
      {links.map((link) => (
        <li key={link.id}>
          <LinkCard
            title={link.title}
            url={link.url}
            clicks={counts[link.id] ?? 0}
            onClick={() => handleClick(link.id)}
          />
        </li>
      ))}
    </ul>
  );
}
