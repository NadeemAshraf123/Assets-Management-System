
import React, {useRef} from 'react';
import { useOutSideClick } from '../../../hooks/useOutSideClick';

interface ConfirmDeleteProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  type?: 'delete' | 'warning' | 'danger';
}

const ConfirmDelete: React.FC<ConfirmDeleteProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message = "Are you sure you want to delete this item?",
  confirmText = "Delete",
  cancelText = "Cancel",
  isLoading = false,
  type = 'delete'
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  useOutSideClick(modalRef, () => {
    if (isOpen) onClose();
  });

  if (!isOpen) return null;


  const typeStyles = {
    delete: {
      button: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
      icon: (
        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      )
    },
    warning: {
      button: "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500",
      icon: (
        <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      )
    },
    danger: {
      button: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
      icon: (
        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  };

  const styles = typeStyles[type];

  return (
    <div  className="fixed inset-0 bg-black/40 bg-opacity-50  flex items-center justify-center pt-20 p-4 z-50">
      <div ref={modalRef} className="bg-white rounded-lg max-w-md w-full mx-auto shadow-xl">

        <div className="flex items-center space-x-3 p-4 border-b border-gray-200">
          <div className="flex-shrink-0">
            {styles.icon}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>
        </div>

    
        <div className="p-3 text-center font-bold text-gray-900">
          <p className="text-gray-600">{message}</p>
        </div>

    
        <div className="flex justify-between space-x-3 p-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2  rounded-md bg-blue-500 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-4 py-2 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${styles.button} disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Deleting...</span>
              </div>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDelete;