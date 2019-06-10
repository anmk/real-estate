import { Component, Input } from '@angular/core';
import { UserInfo } from 'firebase';

import { AuthService } from '../../core/auth/auth.service';


@Component({
  selector: 'app-premises-info',
  templateUrl: './premises-info.component.html',
  styleUrls: ['./premises-info.component.scss']
})

export class PremisesInfoComponent {
  user: UserInfo = this.authService.user;

  @Input() hint: string;

  constructor(private authService: AuthService) { }

}
