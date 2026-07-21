import { Link } from 'react-router';

export function Placeholder({ title }: { title: string }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="font-semibold text-3xl text-gray-900">{title}</h1>
      <p className="max-w-md text-base text-gray-600">
        この画面は仮プレースホルダーです。次の実装に向けて配置しています。
      </p>
      <Link to="/home" className="font-semibold text-[#E60012] text-sm">
        ホームに戻る
      </Link>
    </div>
  );
}
