import { Component, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from './../../core/auth/auth.service';
import { HeaderComponent } from '../header/header.component';


@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})

export class SidenavComponent extends HeaderComponent {
  @Output() closeSidenav = new EventEmitter<void>();

  constructor(protected router: Router,
              protected authService: AuthService ) {
    super(router, authService);
  }

  onCloseSidenav(): void {
    this.closeSidenav.emit();
  }

  onLogout(): void {
    this.onCloseSidenav();
    this.authService.logout();
  }
}
