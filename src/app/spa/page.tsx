'use client'

import { useState } from "react";
import Page1 from "./components/Page1";
import Page2 from "./components/Page2";
import Page3 from "./components/Page3";
import InputPage from "./components/InputPage";
import DisplayPage from "./components/DisplayPage";

export default function TransitionSPA() {
	const [page, setPage] = useState(1);
	const [text, setText] = useState("");

	return (
		<div>
			{page === 1 && <Page1 setPage={setPage} />}
			{page === 2 && <Page2 setPage={setPage} />}
			{page === 3 && <Page3 setPage={setPage} />}
			{page === 4 && <InputPage setPage={setPage} setText={setText} />}
			{page === 5 && <DisplayPage text={text} setPage={setPage} />}
			<div className="btn-wrapper" style={{ marginTop: 32 }}>
				{/* SPA内でデータ保持ページへ */}
				{page !== 4 && page !== 5 && (
					<button className="btn" onClick={() => setPage(4)}>
						データ保持ページへ
					</button>
				)}
			</div>
		</div>
	);
}
