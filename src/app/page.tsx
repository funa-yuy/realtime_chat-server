'use client'

import Link from "next/link";

export default function First() {
	return (
		<div>
			<h1>卒制</h1>
			<div>
				<ul>
					<li><Link href="./transition">ページ遷移</Link></li>
					<li><Link href="./chat">リアルタイムチャット</Link></li>
				</ul>
			</div>
		</div >
	);
}
