import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Subscription } from 'rxjs';
import { Cart } from 'src/app/models/cart';
import { AuthService } from 'src/app/services/auth.service';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit, OnDestroy, AfterViewInit {
  currentCart!: Cart[];
  orderedCart: Cart[] = [];
  subscription: Subscription;
  cartStatus: any;
  username: any;

  displayedColumns: string[] = ['imageUrl', 'name', 'quantity', 'totalAmount'];
  dataSource!: MatTableDataSource<Cart>;

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  @ViewChild(MatSort)
  sort!: MatSort;

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private flashMessage: FlashMessagesService,
    private router: Router
  ) {
    this.username = this.authService.getUserDetails().username;
    this.subscription = this.cartService.currentCart.subscribe((x) => {
      this.currentCart = x;
      this.dataSource = new MatTableDataSource(this.currentCart);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {}

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  /** Gets the total cost of all books. */
  getTotalCost() {
    return this.currentCart
      .map((t) => t.totalAmount)
      .reduce((acc, value) => acc + value, 0);
  }

  updateCart(cart: any, msg: any, timeout: number) {
    this.cartService
      .updateCart({ username: this.username, currentCart: cart })
      .subscribe((res) => {
        this.cartStatus = res;
        if (this.cartStatus.success) {
          this.cartService.setcurrentCartValue(cart);
          this.flashMessage.show(msg, {
            cssClass: 'alert-success',
            timeout: timeout,
          });
          this.router.navigate(['/']);
        } else {
          this.flashMessage.show(`something went wrong`, {
            cssClass: 'alert-danger',
            timeout: 5000,
          });
        }
      });
  }

  placeOrder() {
    this.updateCart([], 'Your order has been successfully placed.', 10000);
  }
}
