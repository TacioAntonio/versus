import { FormControl } from "@angular/forms";
import { Component, Injector, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { SocketClient } from "../../services/socket-client.service";
import { SocketController } from "../../classes/socket-controller";
import { ChatService } from "./services/chat.service";
import { IMessage } from "./interfaces";
import { IMPORTS } from "./imports";

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [IMPORTS],
  providers: [ChatService],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent extends SocketController implements OnInit {
  @Input() shouldCheckRoomJoined: boolean = true;
  showChat: boolean = false;
  messageHistory: Array<IMessage> = [];
  message = new FormControl('');
  countNotifications = 0;

  get isRoomJoinedValid() {
    return this.shouldCheckRoomJoined ? this.roomJoined : true;
  }

  constructor(
    protected readonly injector: Injector,
    private readonly chatService: ChatService
  ) {
    super(
      injector.get(SocketClient),
      injector.get(Router)
    );
  }

  ngOnInit(): void {
    this.listenerMessageReceived();
  }

  handleUsernameChatPosition(username: string) {
    return this.hostUsername === username ? 'chat__username-container--left' : 'chat__username-container--right';
  }

  handleShowChat() {
    this.showChat = !this.showChat;
    this.countNotifications = 0;
  }

  private listenerMessageReceived() {
    this.chatService.listenerJoinRoom(this.storeMessageInHistory.bind(this));
  }

  private storeMessageInHistory(socketSendMessage: string, partnerUsername: string, message: string) {
    if (this.hostUsername === partnerUsername && !this.showChat) this.countNotifications++;

    this.messageHistory.push({
      username: socketSendMessage,
      message
    });
  }

  onSubmit(event: Event) {
    event.preventDefault();

    if (!this.roomJoined || !this.message.value?.trim()) return;

    this.chatService.emitMessage(this.hostUsername, this.roomJoined, this.partnerUsername, this.message.value);
    this.message.reset();
  }
}
