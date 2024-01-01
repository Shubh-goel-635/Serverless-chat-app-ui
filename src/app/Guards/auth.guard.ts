import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { WebSocketService } from '../service/web-socket.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  canActivate() {
      if(!this.webSocketService.isConnected()) {
        this.router.navigate(['home']);
        window.alert("Don't have access");
        return false;
      }
      return true;
  }

  constructor(private router:Router, private webSocketService: WebSocketService) {}
  
}
