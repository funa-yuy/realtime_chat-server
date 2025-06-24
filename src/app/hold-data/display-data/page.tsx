'use client'

import Link from "next/link";
import { useEffect, useState } from 'react'

export default function DisplayData() {
	const [text, setText] = useState('')

	useEffect(() => {
		const saved = localStorage.getItem('inputText')
		if (saved) setText(saved)
	}, [])
	return (
		<div>
			<h1>文字列データ保持</h1>
			<p>入力されたテキスト: <br />
				{text}
			</p>


			<div className="btn-wrapper">
				<Link href="/" className="btn">アプリケーションTOPへ</Link>
			</div>
		</div >
	);
}
