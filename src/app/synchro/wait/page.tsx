'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';
import SyncComponent from '../sync-component';
import { useUserRole } from '../../../hooks/useUserRole'; // カスタムフックをインポート

// メインのコンポーネント ----------------------------------------------------------------------
function WaitPageContent() {
	const router = useRouter();
	// カスタムフックで役割を取得。役割がない場合は/synchroにリダイレクト
	const userRole = useUserRole('/synchro');

	const searchParams = useSearchParams();
	const sessionId = searchParams.get('sessionId');

	// 次ページのURLはここで指定
	const nextUrl = '/synchro/next';

	const handleProceed = (url: string) => {
		// nextUrlにsessionIdを付与して遷移
		router.push(`${url}?sessionId=${sessionId}`);
	};

	//もし役割が選択されていない、もしくは、sessionIdがセットされていない場合
	if (!userRole || !sessionId) {
		return (
			<div>
				<div>役割/セッション情報を確認中...</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen p-8">
			<SyncComponent
				sessionId={sessionId}
				role={userRole}
				nextUrl={nextUrl}
				onProceed={handleProceed}
			/>
		</div>
	);
}

export default function WaitPage() {
	return (
		// useSearchParams を使うコンポーネントは Suspense でラップする必要がある
		<Suspense fallback={<div>読み込み中...</div>}>
			<WaitPageContent />
		</Suspense>
	);
}
