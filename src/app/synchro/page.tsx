'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function SynchroSetupContent() {
	const router = useRouter();

	const searchParams = useSearchParams();
	const sessionId = searchParams.get('sessionId');

	// URLにsessionIdがなければ、生成してリダイレクト
	useEffect(() => {
		if (!sessionId) {
			//ランダムな4文字の英数字をnewSessionIdにセット
			const newSessionId = Math.random().toString(36).substring(2, 6);
			//現在のURLを指定したURLに上書き
			router.replace(`/synchro?sessionId=${newSessionId}`);
		}
	}, [sessionId, router]);

	const handleRoleSelect = (role: 'questioner' | 'answerer') => {
		// sessionIdがセットされていなければ、待機ページにリダイレクトできないようにする
		if (!sessionId) return;

		// 役割をSessionStorageに保存
		sessionStorage.setItem('userRole', role);
		// 待機ページにリダイレクト
		router.push(`/synchro/wait?sessionId=${sessionId}`);
	};

	// もし、sessionIdがセットされていない場合
	if (!sessionId) {
		return (
			<div>
				<h1>セッションを準備しています...</h1>
			</div>
		);
	}

	return (
		<div>
			<h1>同期セッションの準備</h1>
			<h2>あなたの役割を選択してください</h2>
			<div className="flex gap-4 mt-4">
				<button
					onClick={() => handleRoleSelect('questioner')}
					className="p-4 bg-blue-500 text-white rounded text-center w-full"
				>
					私は質問者です
				</button>
				<button
					onClick={() => handleRoleSelect('answerer')}
					className="p-4 bg-green-500 text-white rounded text-center w-full"
				>
					私は回答者です
				</button>
			</div>
		</div>
	);
}

export default function SynchroSetupPage() {
	return (
		// useSearchParams を使うコンポーネントは Suspense でラップする必要がある
		<Suspense fallback={<div>読み込み中...</div>}>
			<SynchroSetupContent />
		</Suspense>
	);
}
