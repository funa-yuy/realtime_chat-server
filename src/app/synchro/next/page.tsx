'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useUserRole } from '../../../hooks/useUserRole'; // カスタムフックをインポート

// 質問者用の表示 ----------------------------------------------------------------------
function QuestionerView() {
	return (
		<div>
			<h2>あなたは<a style={{ color: 'red' }}>質問者</a>として参加しています。</h2>
		</div>
	);
}

// 回答者用の表示 ----------------------------------------------------------------------
function AnswererView() {
	return (
		<div>
			<h2>あなたは<a style={{ color: 'red' }}>回答者</a>として参加しています。</h2>
		</div>
	);
}

// 表示される画面 ----------------------------------------------------------------------
export default function NextPage() {
	// カスタムフックで役割を取得。役割がない場合は/synchroにリダイレクト
	const userRole = useUserRole('/synchro');

	const searchParams = useSearchParams();
	const sessionId = searchParams.get('sessionId');

	//もし役割が選択されていない、もしくは、sessionIdがセットされていない場合
	if (!userRole || !sessionId) {
		return (
			<div>
				<div>役割/セッション情報を確認中...</div>
			</div>
		);
	}

	return (
		<div>
			<h1>同期完了！</h1>
			<p>次のステップに進んでください。</p>

			<div>
				{/* 条件付きレンダー - 役割に応じて異なるコンポーネントを表示 */}
				{userRole === 'questioner' ? <QuestionerView /> : <AnswererView />}
			</div>

			<div className="btn-wrapper">
				<Link href="/synchro" className="btn">同期機能TOPへ</Link>
			</div>
			<div className="btn-wrapper">
				<Link href="/" className="btn">アプリケーションTOPへ</Link>
			</div>
		</div>
	);
}
