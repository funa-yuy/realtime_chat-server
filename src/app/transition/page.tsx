'use client'

import Link from "next/link";

export default function Top() {
	return (
		<div>
			<h1>page遷移 TOP</h1>
			<div className="btn-wrapper">
				<Link href="/transition/page_2" className="btn">next2へ</Link>
			</div>
			<div className="btn-wrapper">
				<Link href="/transition/page_2/page_3" className="btn">next3へ</Link>
			</div>

			<div className="btn-wrapper">
				<Link href="/" className="btn">アプリケーションTOPへ</Link>
			</div>
		</div >
	);
}
