import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Cart } from '../models/cart';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private currentCartSubject: BehaviorSubject<Cart[]>;
  public currentCart: Observable<Cart[]>;

  // httpOptions = this.authService.setHeaders();

  constructor(private http: HttpClient, private authService: AuthService) {
    this.currentCartSubject = new BehaviorSubject<Cart[]>(
      JSON.parse(localStorage.getItem('cart') || '[]')
    );
    this.currentCart = this.currentCartSubject.asObservable();
  }

  setcurrentCartValue(cart: Cart[]) {
    localStorage.setItem('cart', JSON.stringify(cart));
    this.currentCartSubject.next(cart)
  }

  updateCart(updatedCart: any) {
    return this.http.patch(
      'users/cart',
      updatedCart
      // ,
      // this.httpOptions
    );
  }

  logout() {
    this.currentCartSubject.next([]);
  }
}
