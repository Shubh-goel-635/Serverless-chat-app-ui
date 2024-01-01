import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WebSocketService } from '../service/web-socket.service';
import { Subject, takeUntil } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  joinGroup: FormGroup;
  private unsubscribe$ = new Subject<void>();
  public isSubmitted = false;
  public inputmessage = '';

  constructor(
    private fb: FormBuilder,
    private webSocketService: WebSocketService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.joinGroup = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(12)]],
      groupId: ['', [Validators.required, Validators.maxLength(8)]],
    });
  }

  ngOnInit(): void {
    if (this.webSocketService.isConnected()) {
      this.webSocketService.closeConnection();
    }
    if(this.route.snapshot.queryParams['groupId']) {
      const groupId = this.route.snapshot.queryParams['groupId']
      this.joinGroup.get('groupId')?.setValue(groupId);
      this.joinGroup.get('groupId')?.disable();
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onSubmit() {
    if (this.joinGroup.valid) {
      this.isSubmitted = true;
      const name = this.joinGroup.controls['name'].value as string;
      const groupId = this.joinGroup.controls['groupId'].value as string;

      this.webSocketService
        .connectWebSocket(name.toLowerCase(), groupId)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(() => {
          this.router.navigate(['/group'], { queryParams: { groupId, name } });
        });
    } else {
      console.error('Form is invalid.');
    }
  }
}
