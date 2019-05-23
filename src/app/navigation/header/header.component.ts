import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { AuthService } from './../../core/auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuth = false;
  private authSubscription: Subscription;

  @Output() toggleSidenav = new EventEmitter<void>();

  constructor( protected authService: AuthService ) {}

  ngOnInit(): void {
    this.changeAuth();
  }

  private changeAuth(): void {
    this.authSubscription = this.authService.authChange
      .subscribe(authStatus => {
        this.isAuth = authStatus;
      });
  }

  onToggleSidenav(): void {
    this.toggleSidenav.emit();
  }

  onLogout(): void {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

}
