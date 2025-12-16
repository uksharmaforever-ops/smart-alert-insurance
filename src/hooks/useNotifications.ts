import { useEffect, useCallback } from 'react';
import { Customer } from '@/types/customer';
import { differenceInDays, parseISO, format } from 'date-fns';

export const useNotifications = (customers: Customer[], language: 'en' | 'hi') => {
  const requestPermission = useCallback(async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  }, []);

  const sendNotification = useCallback((title: string, body: string) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
      });
    }
  }, []);

  const checkAndNotify = useCallback(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    customers.forEach(customer => {
      const expiry = parseISO(customer.expiryDate);
      const daysLeft = differenceInDays(expiry, today);
      
      const expiryFormatted = format(expiry, 'dd/MM/yyyy');

      if (daysLeft === 15 || daysLeft === 7 || daysLeft === 2) {
        const title = language === 'hi' 
          ? `बीमा समाप्ति अनुस्मारक` 
          : 'Insurance Expiry Reminder';
        
        const body = language === 'hi'
          ? `${customer.name} की बीमा पॉलिसी ${daysLeft} दिनों में (${expiryFormatted}) समाप्त हो रही है।`
          : `${customer.name}'s insurance policy is expiring in ${daysLeft} days (${expiryFormatted}).`;
        
        sendNotification(title, body);
      }
    });
  }, [customers, language, sendNotification]);

  useEffect(() => {
    // Check on mount and every hour
    checkAndNotify();
    const interval = setInterval(checkAndNotify, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, [checkAndNotify]);

  return { requestPermission, sendNotification, checkAndNotify };
};
