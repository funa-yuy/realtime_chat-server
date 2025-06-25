'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type UserRole = 'questioner' | 'answerer' | null;

// 質問者用の表示 ----------------------------------------------------------------------
function QuestionerView() {
	return (
		<div>
			<div>
				<h2>あなたは<a style={{ color: 'red' }}>質問者</a>として参加しています。</h2>
			</div>
		</div >
	);
}

// 回答者用の表示 ----------------------------------------------------------------------
function AnswererView() {
	return (
		<div>
			<div>
				<h2>あなたは<a style={{ color: 'red' }}>回答者</a>として参加しています。</h2>
			</div>
		</div >
	);
}

// 表示される画面 ----------------------------------------------------------------------
export default function RoleView() {
	const [userRole, setUserRole] = useState<UserRole>(null);
	const router = useRouter();

	useEffect(() => {
		// ローカルストレージから役割を取得
		const savedRole = localStorage.getItem('userRole') as UserRole;
		if (savedRole) {
			setUserRole(savedRole);
		} else {
			// 役割が設定されていない場合は役割選択画面にリダイレクト
			router.push('/by-role');
			return;
		}
	}, [router]);

	// 役割を変更したい場合の処理
	const handleRoleChange = () => {
		//、userRoleの値をリセット
		localStorage.removeItem('userRole');
		// '/by-role'に移動
		router.push('/by-role');
	};

	//もし役割が選択されていない場合
	if (!userRole) {
		return (
			<div>
				<div>役割を確認中...</div>
			</div>
		);
	}

	return (
		<div>
			<h1>役割別表示画面</h1>
			<div className="btn-wrapper">
				<button className="btn" onClick={handleRoleChange}>
					役割を変更
				</button>
			</div>
			{/* 条件付きレンダー - 役割に応じて異なるコンポーネントを表示 */}
			{userRole === 'questioner' ? <QuestionerView /> : <AnswererView />}
		</div>
	);
}
