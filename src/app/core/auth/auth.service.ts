import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { Subject } from 'rxjs';
import { UserInfo } from 'firebase';

import { AuthData } from './auth-data.model';
import { MatSnackBar } from '@angular/material';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private isAuthenticated = false;
  userData: UserInfo;
  authChange = new Subject<boolean>();

  constructor(private router: Router,
              private angularFireAuth: AngularFireAuth,
              private matSnackBarToast: MatSnackBar) { }

  registerUser(authData: AuthData): void {
    this.angularFireAuth.auth
    .createUserWithEmailAndPassword(
      authData.email,
      authData.password)
      .then(result => {
        this.matSnackBarToast.open('User account has been succesfully created!', '', { panelClass: 'toast-success' });
        // console.log(result);
      })
      .catch(error => {
        this.matSnackBarToast.open(error.message, '', { panelClass: 'toast-error' });
        // console.log(error);
      });
  }

  login(authData: AuthData): void {
    this.angularFireAuth.auth
    .signInWithEmailAndPassword(
      authData.email,
      authData.password)
      .then(result => {
        this.successfullyAuth();
        this.userData = result.user;
        this.matSnackBarToast.open('Logged in successfully as: ', this.userData.email, { panelClass: 'toast-success' });
        // console.log(result);
      })
      .catch(error => {
        this.matSnackBarToast.open(error.message, '', { panelClass: 'toast-error' });
        // console.log(error);
      });
  }

  get user() {
    return this.userData;
  }

  logout(): void {
    this.authChange.next(false);
    this.router.navigate(['/login']);
    this.isAuthenticated = false;
    this.matSnackBarToast.open('Logged out successfully!', '', { panelClass: 'toast-success' });
  }

  private successfullyAuth(): void {
    this.isAuthenticated = true;
    this.authChange.next(true);
    this.router.navigate(['/dashboard']);
  }

  isAuth() {
    return this.isAuthenticated;
  }

}
