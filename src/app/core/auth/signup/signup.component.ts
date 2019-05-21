import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html'
})

export class SignupComponent implements OnInit {
  signupForm: FormGroup;

  constructor(private authService: AuthService,
              private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.buildSignupForm();
  }

  private buildSignupForm(): void {
    this.signupForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email] ],
      password: ['', [Validators.required] ]
    });
  }

  onSubmit(): void {
    this.authService.registerUser({
      email: this.signupForm.value.email,
      password: this.signupForm.value.password
    });
  }
}
