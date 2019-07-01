import { Component, Input } from '@angular/core';
import { UserInfo } from 'firebase';

// import { AuthService } from '../../core/auth/auth.service';
import { UserService } from 'src/app/core/user/user.service';


@Component({
  selector: 'app-premises-info',
  templateUrl: './premises-info.component.html',
  styleUrls: ['./premises-info.component.scss']
})

export class PremisesInfoComponent {
  user: UserInfo = this.userService.currentUser;

  @Input() hint: string;

  constructor(private userService: UserService) { }

}
