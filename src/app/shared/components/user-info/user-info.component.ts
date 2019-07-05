import { Component, Input } from '@angular/core';
import { UserInfo } from 'firebase';

import { UserService } from '../../../core/user/user.service';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss']
})
export class UserInfoComponent {
  user: UserInfo = this.userService.currentUser;
  auth: boolean = this.authService.isAuth();

  @Input() hint: string;

  constructor(private userService: UserService,
              private authService: AuthService) { }

}
