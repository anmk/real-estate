import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})

export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(private authService: AuthService,
              private formBuilder: FormBuilder ) { }

  ngOnInit(): void  {
    this.buildLoginForm();
  }

  private buildLoginForm(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email] ],
      password: ['', [Validators.required] ]
    });
  }

  onSubmit(): void  {
    this.authService.login({
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    });
  }

}
