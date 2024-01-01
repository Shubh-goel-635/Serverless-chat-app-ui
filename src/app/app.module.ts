import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClipboardModule } from '@angular/cdk/clipboard'
import { GroupChatComponent } from './group-chat/group-chat.component';
import { TimeStampToTimePipe } from './pipes/Time-stamp-to-time.pipe';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    GroupChatComponent,
    TimeStampToTimePipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    ClipboardModule
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
