import { Component, OnInit } from '@angular/core';
import { CartService } from '../cart.service';
import { Product } from '../../models/product';

@Component({
  selector: 'app-cart-view',
  templateUrl: './cart-view.component.html',
  styleUrl: './cart-view.component.css'
})
export class CartViewComponent implements OnInit {

  cart: Product[] = [];
  totalPrice: number = 0;

  constructor(public cartService: CartService) {}

  ngOnInit(): void {
    this.cartService.getCart().subscribe( data => {
      this.cart = data;
      this.totalPrice = this.getTotalPrice();
    })
  }

  private getTotalPrice(): number {
    let total = 0;
    for (let item of this.cart) {
      total += item.price;
    }
    return total;
  }

  public clearCart(): void {
    this.cartService.deleteCart().subscribe();
  }

  public checkout(): void {
    if (this.cart.length > 0) {
      this.cartService.checkoutCart(this.cart).subscribe();
    }
  }

}
