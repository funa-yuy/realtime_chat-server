'use client';

import Link from "next/link";
import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

// Custom Hook for session logic ---------------------------------------------------------
function useSessionSetup() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const sessionId = searchParams.get('sessionId');

	useEffect(() => {
		// URLにsessionIdがなければ、生成してリダイレクト
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

	return { sessionId, handleRoleSelect };
}

// 同期機能の概要 ----------------------------------------------------------------------
function SyncFeatureExplanation() {
	return (
		<div className="my-4 p-6 border rounded-md">
			<h3 className="font-bold mb-2">【概要】</h3>
			<p>この機能は、2人のユーザーが「準備完了」ボタンを押すことで、次のページに遷移します。</p>
			<ul className="mt-4 space-y-4">
				<li>
					<strong>セッションID:</strong> URLの <code>?sessionId=xxxx</code>{' '}
					のxxxxの部分。競合を防ぐために使用。
					<br />
				</li>
				<li>
					<strong>サーバーとの通信:</strong>
					待機ページでは、WebSocketを通じてサーバーに接続します。どちらかのユーザーが「準備完了」ボタンを押すと、その情報が即座にサーバーに送られ、同じセッションのもう一方のユーザーに共有されます。
				</li>
				<li>
					<strong>関連ファイル:</strong>
					<ul className="list-disc list-inside ml-4">
						<li>
							<code>/synchro/page.tsx</code> (このファイル): 役割を選択する最初のページです。
						</li>
						<li>
							<code>/synchro/wait/page.tsx</code>: 2人が揃うのを待つための待機ページです。
						</li>
						<li>
							<code>/synchro/next/page.tsx</code>: お互いが準備完了した後に開かれるページ。条件レンダーを使用し、役割に応じてに異なる表示にしている。
						</li>
						<li>
							<code>/synchro/sync-component.tsx</code>:
							サーバーとのWebSocket通信を行い、準備状態の同期やページ遷移を制御するコンポーネントです。待機ページから呼び出されます。
						</li>
						<li>
							<code>/hooks/useUserRole.ts</code>:
							sessionStorageに保存されたユーザーの役割（role）を読み込むカスタムフック。
						</li>
						<li>
							<code>/server/sync-handler.js</code>:
							サーバー側でセッションごとの状態を管理し、クライアントからの要求を処理するロジックが書かれています。
						</li>
					</ul>
				</li>
			</ul>
		</div>
	);
}

// メインのコンポーネント ----------------------------------------------------------------------
function SynchroSetupContent() {
	const { sessionId, handleRoleSelect } = useSessionSetup();

	if (!sessionId) {
		return (
			<div>
				<h1>セッションを準備しています...</h1>
			</div>
		);
	}

	return (
		<div>
			<h1>同期機能</h1>
			<p>現在のページのURLを別タブで表示し、それぞれの役割を選択してください。</p>
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
			<SyncFeatureExplanation />
			<div className="btn-wrapper">
				<Link href="/" className="btn">アプリケーションTOPへ</Link>
			</div>
		</div >
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
