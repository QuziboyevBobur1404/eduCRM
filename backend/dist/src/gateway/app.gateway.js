"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AppGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const config_1 = require("@nestjs/config");
const socket_io_1 = require("socket.io");
const jwt = __importStar(require("jsonwebtoken"));
let AppGateway = AppGateway_1 = class AppGateway {
    constructor(config) {
        this.config = config;
        this.logger = new common_1.Logger(AppGateway_1.name);
        this.connectedUsers = new Map();
    }
    afterInit() {
        this.logger.log('✅ WebSocket Gateway initialized');
    }
    async handleConnection(client) {
        try {
            const token = client.handshake.auth?.token ||
                client.handshake.headers.authorization?.split(' ')[1];
            if (!token) {
                client.disconnect();
                return;
            }
            const secret = this.config.get('JWT_SECRET');
            const payload = jwt.verify(token, secret);
            client.data.user = payload;
            this.connectedUsers.set(client.id, payload.sub);
            client.join(`user:${payload.sub}`);
            client.join(`role:${payload.role}`);
            client.join(`tenant:${payload.tenantId}`);
            this.logger.log(`Connected: ${payload.email} [${client.id}]`);
        }
        catch {
            this.logger.warn(`Unauthorized WS connection: ${client.id}`);
            client.disconnect();
        }
    }
    handleDisconnect(client) {
        this.connectedUsers.delete(client.id);
    }
    handleJoinGroup(client, groupId) {
        client.join(`group:${groupId}`);
        return { event: 'joined', data: `group:${groupId}` };
    }
    handleLeaveGroup(client, groupId) {
        client.leave(`group:${groupId}`);
    }
    handlePing() {
        return { event: 'pong', data: new Date().toISOString() };
    }
    sendNotificationToUser(userId, notification) {
        this.server.to(`user:${userId}`).emit('notification:new', notification);
    }
    onAttendanceCreated(payload) {
        this.server.to(`role:ADMIN`).emit('attendance:updated', {
            groupId: payload.groupId,
            date: payload.date,
            count: payload.records?.length ?? 0,
        });
        this.server
            .to(`group:${payload.groupId}`)
            .emit('attendance:group_updated', payload);
    }
    onPaymentReceived(payload) {
        this.server
            .to(`tenant:${payload.tenantId}`)
            .emit('payment:received', {
            studentId: payload.payment?.studentId,
            amount: payload.payment?.amount,
            month: payload.payment?.month,
        });
    }
    onStudentCreated(payload) {
        this.server
            .to(`role:ADMIN`)
            .to(`role:SUPER_ADMIN`)
            .emit('student:created', { studentId: payload.student?.id });
    }
    onAbsenceLimitExceeded(payload) {
        this.server
            .to(`role:ADMIN`)
            .to(`role:SUPER_ADMIN`)
            .emit('student:absence_exceeded', {
            studentId: payload.studentId,
            absenceCount: payload.absenceCount,
        });
    }
    onAnyCreated(payload) {
        if (payload?.tenantId) {
            this.server
                .to(`tenant:${payload.tenantId}`)
                .emit('dashboard:refresh');
        }
    }
};
exports.AppGateway = AppGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], AppGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('join:group'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", void 0)
], AppGateway.prototype, "handleJoinGroup", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('leave:group'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", void 0)
], AppGateway.prototype, "handleLeaveGroup", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('ping'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppGateway.prototype, "handlePing", null);
__decorate([
    (0, event_emitter_1.OnEvent)('attendance.bulk_created'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AppGateway.prototype, "onAttendanceCreated", null);
__decorate([
    (0, event_emitter_1.OnEvent)('payment.received'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AppGateway.prototype, "onPaymentReceived", null);
__decorate([
    (0, event_emitter_1.OnEvent)('student.created'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AppGateway.prototype, "onStudentCreated", null);
__decorate([
    (0, event_emitter_1.OnEvent)('student.absence_limit_exceeded'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AppGateway.prototype, "onAbsenceLimitExceeded", null);
__decorate([
    (0, event_emitter_1.OnEvent)('*.created'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AppGateway.prototype, "onAnyCreated", null);
exports.AppGateway = AppGateway = AppGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({
        namespace: '/ws',
        cors: {
            origin: process.env.FRONTEND_URL || 'http://localhost:3000',
            credentials: true,
        },
    }),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AppGateway);
//# sourceMappingURL=app.gateway.js.map