import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GroupChatComponent } from './group-chat/group-chat.component';
import { HomeComponent } from './home/home.component';
import { WebSocketService } from './service/web-socket.service';
import { AuthGuard } from './Guards/auth.guard';

const routes: Routes = [
  { 
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'group',
    canActivate: [AuthGuard],
    component: GroupChatComponent,
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'home',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
  public isConnected:boolean;
  constructor(private webSocketService: WebSocketService) {
    this.isConnected = this.webSocketService.isConnected();
  }
 }
