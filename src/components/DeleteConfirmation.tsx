
import React from 'react';
import { useInventory } from '../context/InventoryContext';

interface DeleteConfirmationProps {
  onClose: () => void;
}

const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({ onClose }) => {
  const { selectedItems, deleteItems } = useInventory();
  
  const handleDelete = async () => {
    await deleteItems(selectedItems);
    onClose();
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
        <h2 className="text-xl font-medium mb-4 text-center">삭제하시겠습니까?</h2>
        <p className="text-center text-gray-600 mb-6">
          {selectedItems.length}개의 항목을 삭제합니다.
        </p>
        <div className="flex space-x-3">
          <button 
            onClick={onClose}
            className="flex-1 py-3 border border-gray-300 rounded-md"
          >
            취소
          </button>
          <button
            onClick={handleDelete}
            className="flex-1 bg-destructive text-white py-3 rounded-md"
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmation;
