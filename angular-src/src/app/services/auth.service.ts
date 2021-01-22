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
    return this.http.post('http://localhost:8080/users/register', user);
  }

  authenticateUser(user: { username: String; password: String }) {
    return this.http.post('http://localhost:8080/users/auth', user);
  }

  getProfile() {
    return this.http.get(
      'http://localhost:8080/users/profile',
      this.setHeaders()
    );
  }

  getUserDetails() {
    this.loadToken();
    return this.user;
  }

  setHeaders() {
    this.loadToken();
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: this.authToken,
      }),
    };
  }

  storeUserData(token: any, user: any) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('cart', JSON.stringify(user.cart));
  }

  loadToken() {
    this.authToken = localStorage.getItem('token');
    this.user = JSON.parse(localStorage.getItem('user') || 'null');
  }

  loggedIn() {
    this.loadToken();
    return !this.jwtHelper.isTokenExpired(this.authToken);
  }

  logout() {
    this.authToken = null;
    this.user = null;
    localStorage.clear();
  }
}
