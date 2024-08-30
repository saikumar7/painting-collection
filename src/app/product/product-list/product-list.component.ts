import { Component, OnInit } from '@angular/core';
import { ProductService } from '../product.service';
import { Product } from '../../models/product';
import { CartService } from '../../cart/cart.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  filteredProducts: Product[] = [];
  sortMethod: string = 'popular';

  constructor(private productService: ProductService, private cartService: CartService, private snackBar: MatSnackBar) { }
  ngOnInit(): void {
    this.productService.getProducts().subscribe(products => {
      this.products = products;
      this.filteredProducts = products;
    })
  }

public addToCart(product: Product): void {
  this.cartService.addToCart(product).subscribe({
    next: () => {
      this.snackBar.open( product.name + " added to cart", '', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top'
      });
    }
  });
}

public applyFilter(event: Event): void {
  let searchTerm = (event.target as HTMLInputElement).value;
  searchTerm = searchTerm.toLowerCase();

  this.filteredProducts = this.products.filter( product => 
    product.name.toLocaleLowerCase().includes(searchTerm)
  )

  this.sortProducts(this.sortMethod);
}

public sortProducts(sort: string): void {
  this.sortMethod = sort;
  switch (this.sortMethod) {
    case 'priceLowToHigh':
        this.filteredProducts.sort((a, b) => a.price - b.price);
        break;
    case 'priceHighToLow':
        this.filteredProducts.sort((a,b) => b.price - a.price);
        break;
    default:
        this.filteredProducts
        break;
  }

}

}
