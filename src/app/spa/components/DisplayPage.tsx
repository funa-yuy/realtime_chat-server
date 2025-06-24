"use client";

type Props = {
	text: string;
	setPage: (page: number) => void;
};

export default function DisplayPage({ text, setPage }: Props) {
	return (
		<div>
			<h1>文字列データ保持</h1>
			<p>入力されたテキスト: <br />
				{text}
			</p>
			<div className="btn-wrapper">
				<button className="btn" onClick={() => setPage(1)}>SPA TOPへ</button>
			</div>
		</div>
	);
}
