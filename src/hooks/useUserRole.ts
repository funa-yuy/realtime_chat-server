import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type UserRole = 'questioner' | 'answerer' | null;

/* 現状、synchro内で使用。 */

/**
 * sessionStorageからユーザーの役割（role）を読み込むカスタムフック。
 * 役割が存在しない場合は、指定されたリダイレクト先に遷移させる。
 * @param redirectTo - 役割が存在しない場合のリダイレクト先URL。デフォルトはアプリケーションのTOPページ
 */
export function useUserRole(redirectTo: string = '/'): UserRole {
	const [userRole, setUserRole] = useState<UserRole>(null);
	const router = useRouter();

	useEffect(() => {
		const savedRole = sessionStorage.getItem('userRole') as UserRole;

		if (savedRole) {
			setUserRole(savedRole);
		} else {
			// 役割が設定されていない場合はリダイレクト
			alert('役割が設定されていません。役割選択ページに戻ります。');
			router.push(redirectTo);
		}
	}, [router, redirectTo]);

	return userRole;
}
