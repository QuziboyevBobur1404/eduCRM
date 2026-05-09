import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../store/auth.store';
import { useNotificationsStore } from '../store/notifications.store';
import { toast } from 'sonner';

export function useSocket() {
  const socketRef = useRef<Socket | null>(null);
  const { accessToken } = useAuthStore();
  const qc = useQueryClient();
  const { incrementUnread } = useNotificationsStore();

  useEffect(() => {
    if (!accessToken) return;

    const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3001';

    const socket = io(`${WS_URL}/ws`, {
      auth: { token: accessToken },
      transports: ['websocket'],
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('✅ Socket connected:', socket.id);
    });

    socket.on('disconnect', () => {
      console.log('❌ Socket disconnected');
    });

    socket.on('notification:new', (notification) => {
      qc.invalidateQueries({ queryKey: ['notifications'] });
      incrementUnread();
      toast.info(notification.title, {
        description: notification.body,
      });
    });

    socket.on('attendance:updated', () => {
      qc.invalidateQueries({ queryKey: ['attendance'] });
    });

    socket.on('payment:received', () => {
      qc.invalidateQueries({ queryKey: ['payments'] });
      qc.invalidateQueries({ queryKey: ['analytics'] });
      qc.invalidateQueries({ queryKey: ['dashboard'] });
    });

    socket.on('student:created', () => {
      qc.invalidateQueries({ queryKey: ['students'] });
      qc.invalidateQueries({ queryKey: ['dashboard'] });
    });

    socket.on('student:absence_exceeded', (data) => {
      toast.warning("O'quvchi davomat limiti oshdi", {
        description: `${data.absenceCount} ta dars o'tkazilgan`,
      });
    });

    socket.on('dashboard:refresh', () => {
      qc.invalidateQueries({ queryKey: ['dashboard'] });
      qc.invalidateQueries({ queryKey: ['analytics'] });
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [accessToken, qc, incrementUnread]);

  return socketRef.current;
}
