// src/components/LoginForm.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface LoginFormProps {
  onToggleSignup: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onToggleSignup }) => {
  const [login_id, setLoginId] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const { login, isLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!login_id || !password) {
      toast({
        title: '오류',
        description: '아이디와 비밀번호를 모두 입력해주세요.',
        variant: 'destructive',
      });
      return;
    }

    try {
      await login(login_id, password);
      toast({
        title: '로그인 성공',
        description: '환영합니다!',
      });
      // 로그인 성공 후 내 냉장고 페이지로 이동
      navigate('/inventory');
    } catch (error: any) {
      toast({
        title: '로그인 실패',
        description: error.message || '아이디 또는 비밀번호를 확인해주세요.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="w-full max-w-md px-6 animate-slide-down">
      <h2 className="text-2xl font-medium text-center mb-8">로그인</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          className="input-field"
          placeholder="아이디"
          value={login_id}
          onChange={e => setLoginId(e.target.value)}
          disabled={isLoading}
        />
        <input
          type="password"
          className="input-field"
          placeholder="비밀번호"
          value={password}
          onChange={e => setPassword(e.target.value)}
          disabled={isLoading}
        />
        
        <button
          type="submit"
          className="w-full bg-primary hover:bg-primary-dark text-white py-3 rounded-md transition-colors"
          disabled={isLoading}
        >
          {isLoading ? '로그인 중...' : '로그인'}
        </button>
      </form>
      
      <div className="mt-6 text-center">
        <button
          onClick={onToggleSignup}
          className="text-primary hover:text-primary-dark transition-colors"
          disabled={isLoading}
        >
          회원가입
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
