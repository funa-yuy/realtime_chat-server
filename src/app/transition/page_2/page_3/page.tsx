'use client'

import Link from "next/link";

export default function NextPage3() {
	return (
		<div>
			<h1>page遷移 NEXTページ3</h1>
			<div className="btn-wrapper">
				<Link href="/transition" className="btn">ページ遷移TOPへ</Link>
			</div>
			<div className="btn-wrapper">
				<Link href="/transition/page_2" className="btn">next2へ</Link>
			</div>
		</div >
	);
}
