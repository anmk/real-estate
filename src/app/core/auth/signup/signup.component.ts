import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./../auth.component.scss']
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  hide = true;

  constructor(private authService: AuthService,
              private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.buildSignupForm();
  }

  private buildSignupForm(): void {
    this.signupForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(30),
                      Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$')]]
    });
  }

  signUp() {
    return this.authService.registerUser({
      email: this.signupForm.value.email,
      password: this.signupForm.value.password
    });
  }
}
