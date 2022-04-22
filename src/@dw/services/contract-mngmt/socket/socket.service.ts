import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';
import { io } from 'socket.io-client';
import { Socket } from 'socket.io-client/build/socket';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  // private url = 'http://localhost:8081'; // whiteBoard 통합전 서버주소
  // private url = 'http://localhost:3000/socketWebRTC';
  private url = environment.socketUrl;
  private _socket: Socket;

  constructor() {
    this._socket = io(this.url+'/socketWebRTC', { transports: ['websocket'], path:'/socketWebRTC' });
		// console.log(this._socket);
  }

  get socket() {
		return this._socket;
	}

}
