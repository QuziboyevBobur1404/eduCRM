import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ConfigService } from '@nestjs/config';
import { Server, Socket } from 'socket.io';
import * as jwt from 'jsonwebtoken';

@WebSocketGateway({
  namespace: '/ws',
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
})
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(AppGateway.name);
  private connectedUsers = new Map<string, string>();

  constructor(private config: ConfigService) {}

  afterInit() {
    this.logger.log('✅ WebSocket Gateway initialized');
  }

  async handleConnection(client: Socket) {
    try {
      const token =
        client.handshake.auth?.token ||
        client.handshake.headers.authorization?.split(' ')[1];

      if (!token) {
        client.disconnect();
        return;
      }

      const secret = this.config.get<string>('JWT_SECRET');
      const payload = jwt.verify(token, secret!) as any;

      client.data.user = payload;
      this.connectedUsers.set(client.id, payload.sub);

      client.join(`user:${payload.sub}`);
      client.join(`role:${payload.role}`);
      client.join(`tenant:${payload.tenantId}`);

      this.logger.log(`Connected: ${payload.email} [${client.id}]`);
    } catch {
      this.logger.warn(`Unauthorized WS connection: ${client.id}`);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.connectedUsers.delete(client.id);
  }

  @SubscribeMessage('join:group')
  handleJoinGroup(client: Socket, groupId: string) {
    client.join(`group:${groupId}`);
    return { event: 'joined', data: `group:${groupId}` };
  }

  @SubscribeMessage('leave:group')
  handleLeaveGroup(client: Socket, groupId: string) {
    client.leave(`group:${groupId}`);
  }

  @SubscribeMessage('ping')
  handlePing() {
    return { event: 'pong', data: new Date().toISOString() };
  }

  sendNotificationToUser(userId: string, notification: any) {
    this.server.to(`user:${userId}`).emit('notification:new', notification);
  }

  @OnEvent('attendance.bulk_created')
  onAttendanceCreated(payload: any) {
    this.server.to(`role:ADMIN`).emit('attendance:updated', {
      groupId: payload.groupId,
      date: payload.date,
      count: payload.records?.length ?? 0,
    });
    this.server
      .to(`group:${payload.groupId}`)
      .emit('attendance:group_updated', payload);
  }

  @OnEvent('payment.received')
  onPaymentReceived(payload: any) {
    this.server
      .to(`tenant:${payload.tenantId}`)
      .emit('payment:received', {
        studentId: payload.payment?.studentId,
        amount: payload.payment?.amount,
        month: payload.payment?.month,
      });
  }

  @OnEvent('student.created')
  onStudentCreated(payload: any) {
    this.server
      .to(`role:ADMIN`)
      .to(`role:SUPER_ADMIN`)
      .emit('student:created', { studentId: payload.student?.id });
  }

  @OnEvent('student.absence_limit_exceeded')
  onAbsenceLimitExceeded(payload: any) {
    this.server
      .to(`role:ADMIN`)
      .to(`role:SUPER_ADMIN`)
      .emit('student:absence_exceeded', {
        studentId: payload.studentId,
        absenceCount: payload.absenceCount,
      });
  }

  @OnEvent('*.created')
  onAnyCreated(payload: any) {
    if (payload?.tenantId) {
      this.server
        .to(`tenant:${payload.tenantId}`)
        .emit('dashboard:refresh');
    }
  }
}
