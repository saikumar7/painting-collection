import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../models/product';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private apiUrl = environment.apiUrl + '/cart';
  private checkoutApiUrl = environment.apiUrl + '/checkout';
  constructor(private http: HttpClient) { }

  public addToCart(product: Product): Observable<Product>{
    return this.http.post<Product>(this.apiUrl, product)
  }

  public getCart(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl)
  }

  public deleteCart(): Observable<void> {
    return this.http.delete<void>(this.apiUrl)
  }

  public checkoutCart(product: Product[]): Observable<void> {
    return this.http.post<void>(this.checkoutApiUrl, product)
  }
}
