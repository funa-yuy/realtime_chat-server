'use client'

import Link from "next/link";
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function HoldData() {
	const [text, setText] = useState('')
	const router = useRouter()

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		localStorage.setItem('inputText', text)
		router.push('')
	}
	return (
		<div>
			<h1>文字列データ保持</h1>
			<form onSubmit={handleSubmit}>
				<input type="text"
					placeholder="テキストを入力してください"
					value={text}
					onChange={e => setText(e.target.value)}
				/>
				<button type="submit">回答を送信</button>
			</form>

			<div className="btn-wrapper">
				<Link href="/hold-data/display-data" className="btn">回答確認へ</Link>
			</div>


			<div className="btn-wrapper">
				<Link href="/" className="btn">アプリケーションTOPへ</Link>
			</div>
		</div >
	);
}
