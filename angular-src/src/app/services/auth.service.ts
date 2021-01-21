import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user';
import { HttpHeaders } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  authToken: any;
  user: any;

  constructor(private http: HttpClient, public jwtHelper: JwtHelperService) {}

  registerUser(user: User) {
    return this.http.post('users/register', user);
  }

  authenticateUser(user: { username: String; password: String }) {
    return this.http.post('users/auth', user);
  }

  getProfile() {
    this.loadToken();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: this.authToken,
      }),
    };

    return this.http.get('users/profile', httpOptions);
  }

  storeUserData(token: any, user: any) {
    localStorage.setItem('id_token', token);
    localStorage.setItem('user', JSON.stringify(user));

    this.authToken = token;
    this.user = user;
  }

  loadToken() {
    const token = localStorage.getItem('id_token');
    this.authToken = token;
  }

  loggedIn() {
    this.loadToken();
    return this.jwtHelper.isTokenExpired(this.authToken);
  }

  logout() {
    this.authToken = null;
    this.user = null;
    localStorage.clear();
  }
}
