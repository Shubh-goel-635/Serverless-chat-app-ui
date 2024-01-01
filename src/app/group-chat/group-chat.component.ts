import { AfterViewChecked, AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { WebSocketService } from '../service/web-socket.service';
import { responseMessage } from '../models/websocket.model';
import { Subject, takeUntil } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Clipboard } from '@angular/cdk/clipboard'; 

@Component({
  selector: 'app-group-chat',
  templateUrl: './group-chat.component.html',
  styleUrls: ['./group-chat.component.scss'],
})
export class GroupChatComponent
  implements OnInit, OnDestroy, AfterViewInit, AfterViewChecked
{
  public messages: Array<responseMessage> = [];
  public name!: string;
  public groupId!: string;
  public connections: Array<responseMessage> = [];
  public latestConnection: responseMessage = {};
  public isConnectionLeft = false;
  private ngUnsubscribe = new Subject<void>();
  public message: string = '';
  public color!: any;
  @ViewChild('inputField') input!: ElementRef;
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  constructor(
    private webSocket: WebSocketService,
    private router: Router,
    private route: ActivatedRoute,
    private clipboard: Clipboard
  ) {}

  ngOnInit(): void {
    this.color = {
      defaultColor: 'hsl(0, 0%, 0%)',
    };
    this.webSocket.getAllMessages();
    this.webSocket.getAllConnections();
    this.webSocket
      .receiveData()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data) => {
        let response: Array<responseMessage>;
        if (
          data.hasOwnProperty('length') &&
          data.hasOwnProperty('connections')
        ) {
          response = data['connections'] as Array<responseMessage>;
          this.connections = [...this.connections, ...response];
        } else {
          response = data as Array<responseMessage>;
          if (response.length && response[0].message) {
            this.setColor(response);
            this.messages = [...this.messages, ...response];
          } else if (response.length) {
            const oldConnectionsLength = this.connections.length;
            this.connections = this.connections.filter(
              (connection) =>
                connection.connectionId !== response[0].connectionId &&
                connection.name !== response[0].name
            );
            if (this.connections.length === oldConnectionsLength) {
              this.isConnectionLeft = false;
              (this.connections = [...response, ...this.connections]),
                (response[0].isConnectionLeft = false);
              this.messages = [...this.messages, ...response];
            } else {
              this.isConnectionLeft = true;
              this.messages = [...this.messages, ...response];
              response[0].isConnectionLeft = true;
            }
            this.latestConnection = response[0];
          }
        }
      });
    this.name = this.webSocket.getName();
    this.groupId = this.webSocket.getGroupId();
  }

  ngAfterViewInit(): void {
    this.input.nativeElement.focus();
  }

  ngOnDestroy(): void {
    this.webSocket.clearGroupChat();
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.unsubscribe();
    if (this.webSocket.isConnected()) {
      this.webSocket.closeConnection();
    }
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.scrollContainer.nativeElement.scrollTop =
        this.scrollContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.error(err);
    }
  }

  sendMessage() {
    if (this.message.trim().length) {
      this.webSocket.sendMessageToGroup(this.message.trim());
      this.message = '';
    }
  }

  logout() {
    this.router.navigate(['/home']);
  }

  private getRandomLightColor() {
    const minLightness = 30;
    const maxLightness = 40;

    const red = Math.floor(Math.random() * 256);
    const green = Math.floor(Math.random() * 256);
    const blue = Math.floor(Math.random() * 256);

    const hslColor = `hsl(${red}, ${green}%, ${
      minLightness + Math.random() * (maxLightness - minLightness)
    }%)`;
    return hslColor;
  }

  private setColor(messages: Array<responseMessage>) {
    messages.forEach((message) => {
      if (message.name && !this.color[message.name]) {
        this.color[message.name] = this.getRandomLightColor();
      }
    });
  }

  public share() {
    this.clipboard.copy(window.location.host + `/home?groupId=${this.groupId}`);
    window.alert('Link copied. Share to let others join.');
  }
}
