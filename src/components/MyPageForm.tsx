// src/components/MyPageForm.tsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';

const MyPageForm: React.FC = () => {
  const { user, updateUser, logout, deleteAccount } = useAuth();
  const { toast } = useToast();

  // 모달 오픈/클로즈 상태
  const [isChangeNicknameOpen, setIsChangeNicknameOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isDeleteAccountOpen, setIsDeleteAccountOpen] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);

  // 폼 필드 상태
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [notification, setNotification] = useState(user?.notification || false);
  const [deleteConfirmPassword, setDeleteConfirmPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // 알림 토글
  const handleNotificationChange = async () => {
    try {
      await updateUser({ notification: !notification });
      setNotification(!notification);
      toast({ title: '알림 설정이 변경되었습니다.' });
    } catch {
      toast({
        title: '오류',
        description: '알림 설정 변경에 실패했습니다.',
        variant: 'destructive',
      });
    }
  };

  // 닉네임 변경
  const handleChangeNickname = async () => {
    if (!newUsername) {
      toast({
        title: '오류',
        description: '새 닉네임을 입력해주세요.',
        variant: 'destructive',
      });
      return;
    }
    try {
      await updateUser({ username: newUsername });
      setSuccessMessage('닉네임이 변경되었습니다.');
      setTimeout(() => {
        setSuccessMessage(null);
        setIsChangeNicknameOpen(false);
        setNewUsername('');
        setCurrentPassword('');
      }, 2000);
    } catch {
      toast({
        title: '오류',
        description: '닉네임 변경에 실패했습니다.',
        variant: 'destructive',
      });
    }
  };

  // 비밀번호 변경
  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword) {
      toast({
        title: '오류',
        description: '모든 필드를 입력해주세요.',
        variant: 'destructive',
      });
      return;
    }
    try {
      // 실제 API 호출 로직 필요 시 여기에 작성
      setSuccessMessage('비밀번호가 변경되었습니다.');
      setTimeout(() => {
        setSuccessMessage(null);
        setIsChangePasswordOpen(false);
        setNewPassword('');
        setCurrentPassword('');
      }, 2000);
    } catch {
      toast({
        title: '오류',
        description: '비밀번호 변경에 실패했습니다.',
        variant: 'destructive',
      });
    }
  };

  // 회원 탈퇴
  const handleDeleteAccount = async () => {
    if (!deleteConfirmPassword) {
      toast({
        title: '오류',
        description: '비밀번호를 입력해주세요.',
        variant: 'destructive',
      });
      return;
    }
    try {
      await deleteAccount(deleteConfirmPassword);
      setSuccessMessage('계정이 삭제되었습니다.');
      setTimeout(() => setSuccessMessage(null), 2000);
    } catch {
      toast({
        title: '오류',
        description: '계정 삭제에 실패했습니다.',
        variant: 'destructive',
      });
    }
  };

  // 로그아웃
  const handleLogout = () => {
    logout();
    toast({ title: '로그아웃 되었습니다.' });
  };

  return (
    <div className="p-4 space-y-4">
      {/* 푸시 알림 설정 */}
      <div className="bg-white rounded-lg shadow p-6 flex items-center justify-between">
        <span>푸시 알림</span>
        <Switch checked={notification} onCheckedChange={handleNotificationChange} />
      </div>

      {/* 계정 정보 */}
      <div className="bg-white rounded-lg shadow p-6 space-y-3">
        <div className="flex justify-between items-center">
          <span>닉네임</span>
          <div className="flex items-center space-x-2">
            <span className="text-gray-700">{user?.username}</span>
            <button onClick={() => setIsChangeNicknameOpen(true)} className="text-primary text-sm">
              변경
            </button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span>비밀번호</span>
          <button onClick={() => setIsChangePasswordOpen(true)} className="text-primary text-sm">
            변경
          </button>
        </div>
      </div>

      {/* 회원 탈퇴 버튼 */}
      <div className="bg-white rounded-lg shadow p-6">
        <button
          onClick={() => setIsDeleteAccountOpen(true)}
          className="w-full py-3 text-destructive border border-destructive rounded-md"
        >
          회원 탈퇴
        </button>
      </div>

      {/* 로그아웃 버튼 */}
      <div className="bg-white rounded-lg shadow p-6">
        <button
          onClick={() => setIsLogoutConfirmOpen(true)}
          className="w-full py-3 bg-gray-200 text-gray-800 rounded-md"
        >
          로그아웃
        </button>
      </div>

      {/* 닉네임 변경 모달 */}
      <Dialog open={isChangeNicknameOpen} onOpenChange={setIsChangeNicknameOpen}>
        <DialogContent
          className="sm:max-w-[425px]"
          aria-describedby={undefined}
        >
          <DialogHeader>
            <DialogTitle>닉네임 변경</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            새 닉네임을 입력하고 “변경” 버튼을 눌러주세요.
          </DialogDescription>
          {successMessage ? (
            <div className="py-10 text-center text-primary">{successMessage}</div>
          ) : (
            <div className="space-y-4 py-4">
              <input
                type="password"
                className="input-field"
                placeholder="현재 비밀번호"
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
              />
              <input
                type="text"
                className="input-field"
                placeholder="새 닉네임"
                value={newUsername}
                onChange={e => setNewUsername(e.target.value)}
              />
              <DialogFooter className="justify-end space-x-2">
                <button
                  onClick={() => setIsChangeNicknameOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md"
                >
                  취소
                </button>
                <button
                  onClick={handleChangeNickname}
                  className="px-4 py-2 bg-primary text-white rounded-md"
                >
                  변경
                </button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* 비밀번호 변경 모달 */}
      <Dialog open={isChangePasswordOpen} onOpenChange={setIsChangePasswordOpen}>
        <DialogContent
          className="sm:max-w-[425px]"
          aria-describedby={undefined}
        >
          <DialogHeader>
            <DialogTitle>비밀번호 변경</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            현재 비밀번호와 새 비밀번호를 입력해 주세요.
          </DialogDescription>
          {successMessage ? (
            <div className="py-10 text-center text-primary">{successMessage}</div>
          ) : (
            <div className="space-y-4 py-4">
              <input
                type="password"
                className="input-field"
                placeholder="현재 비밀번호"
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
              />
              <input
                type="password"
                className="input-field"
                placeholder="새 비밀번호"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
              />
              <DialogFooter className="justify-end space-x-2">
                <button
                  onClick={() => setIsChangePasswordOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md"
                >
                  취소
                </button>
                <button
                  onClick={handleChangePassword}
                  className="px-4 py-2 bg-primary text-white rounded-md"
                >
                  변경
                </button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* 회원 탈퇴 모달 */}
      <Dialog open={isDeleteAccountOpen} onOpenChange={setIsDeleteAccountOpen}>
        <DialogContent
          className="sm:max-w-[425px]"
          aria-describedby={undefined}
        >
          <DialogHeader>
            <DialogTitle className="text-center">정말 탈퇴하시겠어요?</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            탈퇴하시면 모든 데이터가 삭제되어 복구할 수 없습니다.
          </DialogDescription>
          {successMessage ? (
            <div className="py-10 text-center text-primary">{successMessage}</div>
          ) : (
            <div className="space-y-4 py-4">
              <input
                type="password"
                className="input-field"
                placeholder="비밀번호 확인"
                value={deleteConfirmPassword}
                onChange={e => setDeleteConfirmPassword(e.target.value)}
              />
              <DialogFooter className="justify-center space-x-4">
                <button
                  onClick={() => setIsDeleteAccountOpen(false)}
                  className="px-6 py-2 border border-gray-300 rounded-md"
                >
                  취소
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="px-6 py-2 bg-destructive text-white rounded-md"
                >
                  탈퇴
                </button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* 로그아웃 확인 모달 */}
      <Dialog open={isLogoutConfirmOpen} onOpenChange={setIsLogoutConfirmOpen}>
        <DialogContent
          className="sm:max-w-[425px]"
          aria-describedby={undefined}
        >
          <DialogHeader>
            <DialogTitle className="text-center">로그아웃 하시겠습니까?</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            로그아웃하시면 다시 로그인하셔야 서비스를 이용할 수 있습니다.
          </DialogDescription>
          <DialogFooter className="justify-center space-x-4">
            <button
              onClick={() => setIsLogoutConfirmOpen(false)}
              className="px-6 py-2 border border-gray-300 rounded-md"
            >
              취소
            </button>
            <button
              onClick={handleLogout}
              className="px-6 py-2 bg-primary text-white rounded-md"
            >
              확인
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyPageForm;
