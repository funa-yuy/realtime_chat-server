"use client";

type Props = {
	setPage: (page: number) => void;
};

export default function Page1({ setPage }: Props) {
	return (
		<>
			<h1>page遷移 TOP</h1>
			<div className="btn-wrapper">
				<button className="btn" onClick={() => setPage(2)}>
					next2へ
				</button>
			</div>
			<div className="btn-wrapper">
				<button className="btn" onClick={() => setPage(3)}>
					next3へ
				</button>
			</div>
			<div className="btn-wrapper">
				<button className="btn" onClick={() => (window.location.href = "/")}>アプリケーションTOPへ</button>
			</div>
		</>
	);
}
