// src/context/AuthContext.tsx

import React, { createContext, useState, useContext, useEffect } from 'react';
import api, { setAuthToken } from '@/api';
import { User, TokenResponse } from '../types/api';  // TokenResponse 가져오기

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (login_id: string, password: string) => Promise<void>;
  signup: (
    login_id: string,
    username: string,
    password1: string,
    password2: string
  ) => Promise<void>;
  logout: () => void;
  updateUser: (user: Partial<User>) => Promise<void>;
  deleteAccount: (password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 초기 로컬스토리지에서 가져오기
  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser && savedUser !== 'undefined') {
      setAuthToken(token);
      try {
        const u: User = JSON.parse(savedUser);
        setUser(u);
        setIsAuthenticated(true);
      } catch {
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (login_id: string, password: string) => {
    setIsLoading(true);
    try {
      // 1) 로그인 API 호출
      const res = await api.post<TokenResponse>('/user/login', { login_id, password });
      const { access_token, login_id: rid, user_id } = res.data;

      // 2) 토큰 세팅
      setAuthToken(access_token);

      // 3) 최소한의 유저 객체 생성 (백엔드에서 user 정보를 더 받아오는 API가 있으면 그걸 호출하세요)
      const u: User = {
        user_id,
        login_id: rid,
        username: rid,           // 백엔드에서 username을 받아올 엔드포인트가 없으므로 임시로 login_id로 셋업
        notification: true,      // 기본값
        fcm_token: null,
      };
      setUser(u);
      localStorage.setItem('user', JSON.stringify(u));
      setIsAuthenticated(true);
    } catch (err: any) {
      console.error('Login failed:', err);
      throw new Error(err.response?.data?.detail || '로그인에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (
    login_id: string,
    username: string,
    password1: string,
    password2: string
  ) => {
    setIsLoading(true);
    try {
      // 회원가입 API 호출 (204 No Content)
      await api.post('/user/create', { login_id, username, password1, password2 });
      // 이후 자동 로그인 없이, 사용자에게 로그인 유도
    } catch (err: any) {
      console.error('Signup failed:', err);
      throw new Error(err.response?.data?.detail || '회원가입에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setAuthToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  // 나머지 updateUser, deleteAccount는 샘플 그대로
  const updateUser = async (updatedFields: Partial<User>) => {
    setIsLoading(true);
    try {
      // 실제 API 호출이 필요하면 여기서 api.patch…
      const updated = { ...user!, ...updatedFields };
      setUser(updated);
      localStorage.setItem('user', JSON.stringify(updated));
    } catch {
      throw new Error('사용자 정보 업데이트에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteAccount = async (password: string) => {
    setIsLoading(true);
    try {
      // 실제 API 호출: DELETE /user/{user_id}/delete
      await api.delete(`/user/${user!.user_id}/delete`, { data: { password } });
      logout();
    } catch (err: any) {
      throw new Error(err.response?.data?.detail || '계정 삭제에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        signup,
        logout,
        updateUser,
        deleteAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
