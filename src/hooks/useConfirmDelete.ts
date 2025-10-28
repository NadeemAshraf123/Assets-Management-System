import { useState, useCallback } from 'react';


interface ConfirmDeleteState {
    isOpen: boolean;
    title?: string;
    message?: string;
    onConfirm?: () => void;
}

export const useConfirmDelete = () => {
    const [confirmState, setConfirmState] = useState<ConfirmDeleteState>({
        isOpen: false,
        title: "Are you sure you want to delete this item?",
    });


    const showConfirm = useCallback((

        onConfirm: () => void,
        options?: { title?: string; message?: string }
    ) => {
        setConfirmState({
            isOpen: true,
            onConfirm,
            title: options?.title || "Are you sure?",
            message: options?.message || "Are you sure you want to delete this item?",
        });

    }, []);

    const hideConfirm = useCallback(() => {
        setConfirmState(prev => ({ ...prev, isOpen: false}));
    }, []);


    const handleConfirm = useCallback(() => {
        if (confirmState.onConfirm) {
            confirmState.onConfirm();
        }
        hideConfirm();
    }, [confirmState.onConfirm, hideConfirm]);

    return {
        isOpen: confirmState.isOpen,
        title: confirmState.title,
        message: confirmState.message,
        showConfirm,
        hideConfirm,
        handleConfirm, 
    };
};

