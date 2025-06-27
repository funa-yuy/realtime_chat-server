import Link from 'next/link';

export default function SynchroPage() {
	// 4桁のランダムな英数字でセッションIDを生成
	const sessionId = Math.random().toString(36).substring(2, 6);

	return (
		<div>
			<h1>同期機能テスト</h1>

			<div className="grid grid-cols-2 gap-4 max-w-md">
				<Link
					href={`/synchro/questioner?sessionId=${sessionId}&nextUrl=/synchro/next`}
					className="p-4 bg-blue-500 text-white rounded text-center"
				>
					質問者
				</Link>

				<Link
					href={`/synchro/answerer?sessionId=${sessionId}&nextUrl=/synchro/next`}
					className="p-4 bg-green-500 text-white rounded text-center"
				>
					回答者
				</Link>
			</div>

			<p>
				両方のページを開いて、両方で「準備完了」を押してください
			</p>
		</div>
	);
}
