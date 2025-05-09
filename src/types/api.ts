// src/types/api.ts

// Category 모델 타입
export interface Category {
  category_id: number;
  category_major_name: string;
  category_sub_name: string;
}

// Item 모델 타입
export interface Item {
  item_id: number;
  user_id: number;
  category_id: number;
  item_name: string;
  expiry_date: string;    // ISO 문자열 ("YYYY-MM-DD")
  created_at: string;     // ISO 문자열 (timestamp)
  category?: Category;    // 필요 시 포함
}

// User 모델 타입
export interface User {
  user_id: number;
  login_id: string;
  username: string;
  notification: boolean;
  fcm_token: string | null;
  items?: Item[];         // 유저의 재고 목록 (선택)
}

// 로그인/회원가입 후 받아오는 응답 타입
// export interface AuthResponse {
//   token: string;  // JWT 토큰
//   user: User;     // 로그인한 유저 정보
// }

export interface TokenResponse {
  access_token: string;
  token_type: string;
  login_id: string;
  user_id: number;
}