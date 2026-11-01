export type LinkItem = {
  id: string;
  title: string;
  url: string;
};

export type Profile = {
  name: string;
  bio: string;
  /** public/ 아래 이미지 경로. 비워 두면 이름 첫 글자로 아바타를 표시합니다. */
  image?: string;
  links: LinkItem[];
};

// TODO: 실제 정보로 바꿔 주세요.
export const profile: Profile = {
  name: "링크나무",
  bio: "내 모든 링크를 한 곳에 🌳",
  links: [
    { id: "instagram", title: "Instagram", url: "https://instagram.com" },
    { id: "youtube", title: "YouTube", url: "https://youtube.com" },
    { id: "blog", title: "블로그", url: "https://blog.naver.com" },
  ],
};
