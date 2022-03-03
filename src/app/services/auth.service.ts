import { Injectable } from '@angular/core';
//import { User } from '../interfaces/user.interface';
import { Router } from '@angular/router';
import { User } from '../login/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isSignedIn: boolean;

  constructor(private router: Router) { }

  public isLoggedIn() {
    return true;
  }

  public loginInfo(userInfo: User) {
    if (userInfo !== undefined) {
      this.isSignedIn = true;
      JSON.stringify(localStorage.setItem('USER_INFO', JSON.stringify(userInfo)));
    }
  }

  public getLoggedUser() {
    return JSON.parse(localStorage.getItem('USER_INFO'));
  }

  public logout() {
    this.router.navigateByUrl('');
  }
}
