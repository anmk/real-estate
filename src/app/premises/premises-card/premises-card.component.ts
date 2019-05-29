import { Component, Input } from '@angular/core';

import { Premises } from './../../shared/models';

@Component({
  selector: 'app-premises-card',
  templateUrl: './premises-card.component.html',
  styleUrls: ['./premises-card.component.scss']
})

export class PremisesCardComponent {
  @Input() premise: Premises;
}
