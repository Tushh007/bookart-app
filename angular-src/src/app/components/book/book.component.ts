import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Subscription } from 'rxjs';
import { Cart } from 'src/app/models/cart';
import { AuthService } from 'src/app/services/auth.service';
import { BookService } from 'src/app/services/book.service';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css'],
})
export class BookComponent implements OnInit, OnDestroy {
  book: any;
  username: any;
  newCart!: Cart;
  currentCart: Cart[] = [];
  quantity: number = 1;
  cartStatus: any;
  subscription: Subscription;

  constructor(
    private authService: AuthService,
    private bookService: BookService,
    private cartService: CartService,
    private route: ActivatedRoute,
    private flashMessage: FlashMessagesService
  ) {
    this.username = this.authService.getUserDetails().username
    this.subscription = this.cartService.currentCart.subscribe((x) => {
      this.currentCart = x;
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.bookService.getBookById(params.id).subscribe((book) => {
        this.book = book;
      });
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  addToCart() {
    const newbook = {
      book: this.book,
      quantity: this.quantity,
      totalAmount: this.quantity * this.book.price,
    };

    const bookNotInCart = this.currentCart.findIndex(
      (cartItem) => cartItem.book._id === this.book._id
    );

    if (!bookNotInCart) {
      this.currentCart[bookNotInCart].quantity += this.quantity;
      this.currentCart[bookNotInCart].totalAmount =
        this.currentCart[bookNotInCart].quantity * this.book.price;
    } else this.currentCart.push(newbook);

    // adding to localstorage and to the backend
    this.cartService.updateCart({username: this.username, currentCart: this.currentCart}).subscribe((res) => {
      this.cartStatus = res;
      if (this.cartStatus.success) {
        this.cartService.setcurrentCartValue(this.currentCart);
        this.flashMessage.show(
          `${this.quantity} x ${this.book.name} worth ₹ ${
            this.quantity * this.book.price
          } successfully added to the cart!`,
          {
            cssClass: 'alert-success',
            timeout: 5000,
          }
        );
      } else {
        this.flashMessage.show(
          `something went wrong`,
          {
            cssClass: 'alert-danger',
            timeout: 5000,
          }
        );
      }
    });
  }
}
