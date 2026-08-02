export type NotificationType = 'info' | 'success' | 'error' | 'warning';

export interface Notification {
    id: number;
    message: string;
    type: NotificationType;
}
