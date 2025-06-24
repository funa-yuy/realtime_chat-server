"use client";

type Props = {
	setPage: (page: number) => void;
};

export default function Page2({ setPage }: Props) {
	return (
		<>
			<h1>page遷移 NEXTページ2</h1>
			<div className="btn-wrapper">
				<button className="btn" onClick={() => setPage(1)}>
					ページ遷移TOPへ
				</button>
			</div>
			<div className="btn-wrapper">
				<button className="btn" onClick={() => setPage(3)}>
					next3へ
				</button>
			</div>
		</>
	);
}
