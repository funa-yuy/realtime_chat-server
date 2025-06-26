import Link from 'next/link';

export default function NextPage() {
	return (
		<div>
			<h1>同期完了</h1>
			<h2>両方のプレイヤーが準備完了しました</h2>

			<div className="btn-wrapper">
				<Link href="/synchro" className="btn">同期機能TOPへ</Link>
			</div>
			<div className="btn-wrapper">
				<Link href="/" className="btn">アプリケーションTOPへ</Link>
			</div>
		</div>
	);
}
