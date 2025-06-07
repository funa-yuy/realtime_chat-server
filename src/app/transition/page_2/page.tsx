'use client'

import Link from "next/link";

export default function NextPage2() {
	return (
		<div>
			<h1>page遷移 NEXTページ2</h1>
			<div className="btn-wrapper">
				<Link href="/transition" className="btn">ページ遷移TOPへ</Link>
			</div>
			<div className="btn-wrapper">
				<Link href="/transition/page_2/page_3" className="btn">next3へ</Link>
			</div>
		</div >
	);
}
