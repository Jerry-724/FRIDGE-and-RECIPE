
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

interface LoginFormProps {
  onToggleSignup: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onToggleSignup }) => {
  const [login_id, setLoginId] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const { login, isLoading } = useAuth();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!login_id || !password) {
      toast("모든 필드를 입력해주세요.");
      return;
    }
    
    try {
      await login(login_id, password);
    } catch (error) {
      toast(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.');
    }
  };
  
  return (
    <div className="w-full max-w-md px-6 animate-slide-down">
      <h2 className="text-2xl font-bold text-center mb-6" style={{ color: '#70B873' }}>뭐먹을냉?</h2>
      
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <input
            type="text"
            className="input-field mb-2"
            placeholder="아이디"
            value={login_id}
            onChange={(e) => setLoginId(e.target.value)}
            disabled={isLoading}
          />
        </div>
        
        <div>
          <input
            type="password"
            className="input-field mb-2"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
          />
        </div>
        
        <button
          type="submit"
          className="w-full bg-primary hover:bg-primary-dark text-white py-3 rounded-md transition-colors mt-2"
          disabled={isLoading}
        >
          {isLoading ? '로그인 중...' : '로그인'}
        </button>
      </form>
      
      <div className="mt-4 text-center">
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
