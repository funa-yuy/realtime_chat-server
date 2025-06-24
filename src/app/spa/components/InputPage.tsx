"use client";

type Props = {
	setPage: (page: number) => void;
	setText: (text: string) => void;
};

import { useState } from "react";

export default function InputPage({ setPage, setText }: Props) {
	const [input, setInput] = useState("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setText(input);
		setPage(5); // 表示ページへ遷移
	};

	return (
		<div>
			<h1>文字列データ保持</h1>
			<div className="send-form">
				<form onSubmit={handleSubmit}>
					<input
						type="text"
						placeholder="テキストを入力してください"
						value={input}
						onChange={e => setInput(e.target.value)}
					/>
					<button className="send-btn" type="submit">送信</button>
				</form>
			</div>
			<div className="btn-wrapper">
				<button className="btn" onClick={() => setPage(1)}>SPA TOPへ</button>
			</div>
		</div>
	);
}
