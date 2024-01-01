import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject, Subject } from 'rxjs';
import { WebSocketSubject, webSocket } from 'rxjs/webSocket';
import { requestMessage, responseMessage } from '../models/websocket.model';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private socket: WebSocket | undefined;
  private webSocketInstance: WebSocket | undefined;
  private connectionEstablished = new Subject<boolean>();
  private receivedDataSubject = new Subject<any>();
  private name!: string;
  private groupId!: string;

  connectWebSocket(name: string, groupId: string): Observable<boolean> {
    const socketUrl = `wss://ryp9iofo33.execute-api.us-east-1.amazonaws.com/dev?groupId=${groupId}&name=${name}`;
    this.socket = new WebSocket(socketUrl);

    this.name = name;
    this.groupId = groupId;

    this.socket.onopen = (event) => {
      this.webSocketInstance = this.socket as WebSocket;
      this.connectionEstablished.next(true);
    };

    this.socket.onmessage = (event) => {
      this.receivedDataSubject.next(JSON.parse(event.data));
    };

    this.socket.onclose = (event) => {
    };

    this.socket.onerror = (error) => {
    };
    return this.connectionEstablished.asObservable();
  }

  private sendMessage(message: any): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    } else {
    }
  }

  closeConnection(): void {
    if (this.socket) {
      this.socket.close();
    } else {
    }
  }

  receiveData(): Observable<any> {
    return this.receivedDataSubject.asObservable();
  }

  isConnected(): boolean {
    return this.webSocketInstance !== undefined && this.webSocketInstance.readyState === WebSocket.OPEN;
  }

  public getName(): string {
    return this.name;
  }

  public getGroupId(): string {
    return this.groupId;
  }

  public sendMessageToGroup(message: string) {
    const request: requestMessage = { 
      action: 'sendMessage', 
      groupId: this.groupId,
      name: this.name,
      message: message
    };
    this.sendMessage(request);
  }

  public getAllMessages() {
    const request: requestMessage = { 
      action: 'getAllMessages', 
      groupId: this.groupId 
    };
    this.sendMessage(request); 
  }

  public getAllConnections() {
    const request: requestMessage = { 
      action: 'getAllConnections', 
      groupId: this.groupId 
    };
    this.sendMessage(request); 
  }

  public clearGroupChat() {
    const request: requestMessage = { 
      action: 'deleteChat', 
      groupId: this.groupId 
    };
    this.sendMessage(request);
    this.closeConnection();
  } 
}
