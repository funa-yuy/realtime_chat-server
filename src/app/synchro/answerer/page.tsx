'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';
import SyncComponent from '../sync-component';

function AnswererPageContent() {
	const searchParams = useSearchParams();
	const router = useRouter();

	const sessionId = searchParams.get('sessionId');
	const nextUrl = searchParams.get('nextUrl');

	const handleProceed = (url: string) => {
		// Next.jsのルーターを使用してページ遷移
		router.push(url);
	};

	if (!sessionId || !nextUrl) {
		return (
			<div className="min-h-screen p-8 text-center">
				<h1 className="text-xl font-bold text-red-600">設定エラー</h1>
				<p className="mt-2 text-gray-700">
					このページを表示するには、セッションIDと遷移先URLが必要です。
				</p>
				<p className="mt-1 text-sm text-gray-500">
					リンク元のページから正しくアクセスしてください。
				</p>
			</div>
		);
	}

	return (
		<div className="min-h-screen p-8">
			<SyncComponent
				sessionId={sessionId}
				role="answerer"
				nextUrl={nextUrl}
				onProceed={handleProceed}
			/>
		</div>
	);
}

export default function AnswererPage() {
	return (
		<Suspense fallback={<div>読み込み中...</div>}>
			<AnswererPageContent />
		</Suspense>
	);
}
