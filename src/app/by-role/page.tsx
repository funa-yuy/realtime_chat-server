'use client'

import Link from "next/link";
import { useRouter } from 'next/navigation';

export type UserRole = 'questioner' | 'answerer' | null;

export default function RoleSelection() {
	const router = useRouter();

	const handleRoleSelect = (role: 'questioner' | 'answerer') => {
		// 選択した役割をローカルストレージに保存
		localStorage.setItem('userRole', role);
		// チャット画面に遷移
		router.push('/by-role/text');
	};

	return (
		<div>
			<h1>役割を選択してください</h1>
			<div>
				<div className="btn-wrapper">
					<button className="btn" onClick={() => handleRoleSelect('questioner')}>
						質問者として参加
					</button>
				</div>
				<div className="btn-wrapper">
					<button className="btn" onClick={() => handleRoleSelect('answerer')}>
						回答者として参加
					</button>
				</div>
			</div>
			<div className="btn-wrapper">
				<Link href="/" className="btn">アプリケーションTOPへ</Link>
			</div>
		</div>
	);
}
