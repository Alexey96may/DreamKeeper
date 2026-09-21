export interface Toast {
    id: string;
    message: string;
    type?: 'info' | 'success' | 'error' | 'warning';
    duration?: number;
    showProgress?: boolean;
    actionLabel?: string;
    onAction?: () => void;
}
