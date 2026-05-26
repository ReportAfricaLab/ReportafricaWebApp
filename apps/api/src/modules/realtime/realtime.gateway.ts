import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatMessageEntity } from '../../database/entities';

@WebSocketGateway({ cors: { origin: '*' }, namespace: '/realtime' })
export class RealtimeGateway {
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(RealtimeGateway.name);
  private viewerCounts = new Map<string, number>();

  constructor(
    @InjectRepository(ChatMessageEntity)
    private readonly chatRepo: Repository<ChatMessageEntity>,
  ) {}

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    // Decrement viewer counts for rooms this client was in
    const rooms = Array.from(client.rooms);
    rooms.forEach((room) => {
      if (room.startsWith('stream:')) {
        const count = (this.viewerCounts.get(room) || 1) - 1;
        this.viewerCounts.set(room, Math.max(0, count));
        this.server.to(room).emit('viewers:update', { room, count: Math.max(0, count) });
      }
    });
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join:country')
  handleJoinCountry(@ConnectedSocket() client: Socket, @MessageBody() country: string) {
    client.join(`country:${country}`);
    this.logger.log(`${client.id} joined country:${country}`);
  }

  @SubscribeMessage('join:report')
  handleJoinReport(@ConnectedSocket() client: Socket, @MessageBody() reportId: string) {
    client.join(`report:${reportId}`);
  }

  @SubscribeMessage('join:stream')
  handleJoinStream(@ConnectedSocket() client: Socket, @MessageBody() streamId: string) {
    const room = `stream:${streamId}`;
    client.join(room);
    const count = (this.viewerCounts.get(room) || 0) + 1;
    this.viewerCounts.set(room, count);
    this.server.to(room).emit('viewers:update', { room, count });
    this.logger.log(`${client.id} joined stream:${streamId} (${count} viewers)`);
  }

  @SubscribeMessage('leave:stream')
  handleLeaveStream(@ConnectedSocket() client: Socket, @MessageBody() streamId: string) {
    const room = `stream:${streamId}`;
    client.leave(room);
    const count = (this.viewerCounts.get(room) || 1) - 1;
    this.viewerCounts.set(room, Math.max(0, count));
    this.server.to(room).emit('viewers:update', { room, count: Math.max(0, count) });
  }

  @SubscribeMessage('chat:send')
  async handleChat(@ConnectedSocket() client: Socket, @MessageBody() data: { roomId: string; text: string; userId: string; username: string }) {
    if (!data.text?.trim() || !data.roomId) return;

    const message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      roomId: data.roomId,
      userId: data.userId,
      username: data.username,
      text: data.text.trim().substring(0, 500),
      type: 'message',
      createdAt: new Date().toISOString(),
    };

    // Broadcast to room
    this.server.to(data.roomId).emit('chat:new', message);

    // Persist asynchronously
    this.chatRepo.save({
      roomId: data.roomId,
      userId: data.userId,
      username: data.username,
      text: message.text,
      type: 'message',
    }).catch((err) => this.logger.error('Failed to persist chat message', err));
  }

  @SubscribeMessage('comment:send')
  handleComment(@ConnectedSocket() client: Socket, @MessageBody() data: { reportId: string; text: string; username: string }) {
    this.server.to(`report:${data.reportId}`).emit('comment:new', {
      text: data.text,
      username: data.username,
      timestamp: new Date().toISOString(),
    });
  }

  // Called from services to broadcast events
  emitNewReport(country: string, report: any) {
    this.server.to(`country:${country}`).emit('report:new', report);
  }

  emitEmergencyAlert(country: string, alert: any) {
    this.server.to(`country:${country}`).emit('emergency:alert', alert);
  }

  emitReportUpdate(reportId: string, update: any) {
    this.server.to(`report:${reportId}`).emit('report:updated', update);
  }

  emitStreamEvent(streamId: string, event: string, data: any) {
    this.server.to(`stream:${streamId}`).emit(event, data);
  }

  getViewerCount(streamId: string): number {
    return this.viewerCounts.get(`stream:${streamId}`) || 0;
  }
}
