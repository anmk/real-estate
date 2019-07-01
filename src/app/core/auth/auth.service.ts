import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { MatSnackBar } from '@angular/material';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Subject, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { AuthData } from './auth-data.model';
import { User } from './../user/user-data.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = false;
  firebaseUser: Observable<firebase.User>;
  authChange = new Subject<boolean>();

  constructor(private afAuth: AngularFireAuth,
              private afs: AngularFirestore,
              private router: Router,
              private matSnackBarToast: MatSnackBar) {
    this.firebaseUser = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );
  }

  private updateUserData(user: User) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    const data: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL
    };
    return userRef.set(data, { merge: true });
  }

  login(authData: AuthData) {
    return this.afAuth.auth
    .signInWithEmailAndPassword(authData.email, authData.password)
    .then(() => {
      this.successfullyAuth();
    })
    .then(() => {
      this.matSnackBarToast.open('Logged in successfully as: ', authData.email, { panelClass: 'toast-success' });
    })
    .then(() => {
      console.log('Logged in successfully as: ', authData.email);
    })
    .catch(error => {
      this.matSnackBarToast.open(error.message, '', { panelClass: 'toast-error' });
    })
    .catch(error => {
      console.log(error.message);
    });
  }

  registerUser(authData: AuthData) {
    return this.afAuth.auth
    .createUserWithEmailAndPassword(authData.email, authData.password)
    .then(credential => {
      this.updateUserData(credential.user);
      this.successfullyAuth();
    })
    .then(() => {
      this.matSnackBarToast.open('User account has been succesfully created using the email: ',
        authData.email, { panelClass: 'toast-success' });
    })
    .then(() =>  {
      console.log('User account has been succesfully created!');
    })
    .catch(error => {
      this.matSnackBarToast.open(error.message, '', { panelClass: 'toast-error' });
    })
    .catch(error => {
      console.log(error.message);
    });
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
