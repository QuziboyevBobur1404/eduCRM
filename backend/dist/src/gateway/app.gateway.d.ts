import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import { ConfigService } from '@nestjs/config';
import { Server, Socket } from 'socket.io';
export declare class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private config;
    server: Server;
    private readonly logger;
    private connectedUsers;
    constructor(config: ConfigService);
    afterInit(): void;
    handleConnection(client: Socket): Promise<void>;
    handleDisconnect(client: Socket): void;
    handleJoinGroup(client: Socket, groupId: string): {
        event: string;
        data: string;
    };
    handleLeaveGroup(client: Socket, groupId: string): void;
    handlePing(): {
        event: string;
        data: string;
    };
    sendNotificationToUser(userId: string, notification: any): void;
    onAttendanceCreated(payload: any): void;
    onPaymentReceived(payload: any): void;
    onStudentCreated(payload: any): void;
    onAbsenceLimitExceeded(payload: any): void;
    onAnyCreated(payload: any): void;
}
