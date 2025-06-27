'use client'

import Link from "next/link";

export default function First() {
	return (
		<div>
			<h1>卒制</h1>
			<div>
				<ul>
					<li><Link href="./hold-data">文字列データ保持</Link></li>
					<li><Link href="./transition">ページ遷移</Link></li>
					<li><Link href="./chat">リアルタイムチャット</Link></li>
					<li><Link href="./by-role">役割ごと別画面を表示（条件付きレンダー）</Link></li>
					<li><Link href="./synchro">お互いがボタン押すまで次に進めない同期機能</Link></li>
				</ul>
			</div>
		</div >
	);
}
