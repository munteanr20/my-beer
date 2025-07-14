'use client';

import { useNotification } from '../../contexts/NotificationContext';

export default function NotificationToast() {
  const { notifications, removeNotification } = useNotification();

  const getNotificationStyles = (type: 'success' | 'error' | 'info') => {
    switch (type) {
      case 'success':
        return 'bg-green-600 border-green-500 text-white shadow-lg';
      case 'error':
        return 'bg-red-600 border-red-500 text-white shadow-lg';
      case 'info':
        return 'bg-blue-600 border-blue-500 text-white shadow-lg';
      default:
        return 'bg-[var(--tavern-gold)] border-[var(--tavern-copper)] text-[var(--tavern-dark)] shadow-lg';
    }
  };

  const getIcon = (type: 'success' | 'error' | 'info') => {
    switch (type) {
      case 'success':
        return '🍺';
      case 'error':
        return '❌';
      case 'info':
        return 'ℹ️';
      default:
        return '🍺';
    }
  };

  return (
    <div className="fixed bottom-4 left-4 z-50 space-y-2 hidden md:block">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`
            ${getNotificationStyles(notification.type)}
            border rounded-lg p-4 max-w-sm
            notification-enter
            backdrop-blur-sm
          `}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-xl">{getIcon(notification.type)}</span>
              <span className="text-sm font-medium">{notification.message}</span>
            </div>
            <button
              onClick={() => removeNotification(notification.id)}
              className="ml-3 p-1 hover:bg-black hover:bg-opacity-20 rounded-full transition-colors duration-200 flex-shrink-0"
              aria-label="Close notification"
            >
              <span className="text-lg font-bold">×</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
} 