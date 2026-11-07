type Props = {
  title: string;
  url: string;
  clicks: number;
  onClick?: () => void;
};

export default function LinkCard({ title, url, clicks, onClick }: Props) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      className="relative block w-full rounded-2xl border border-neutral-200 bg-white px-16 py-4 text-center font-medium shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-400 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 active:translate-y-0 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:border-emerald-500"
    >
      {title}
      <span className="absolute right-5 top-1/2 -translate-y-1/2 text-xs font-normal tabular-nums text-neutral-500 dark:text-neutral-400">
        {clicks.toLocaleString("ko-KR")}회
      </span>
    </a>
  );
}
