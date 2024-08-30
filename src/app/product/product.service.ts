import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Product } from '../models/product';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = environment.apiUrl + '/products';
  constructor(private http: HttpClient){}

  public getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl)
  }

}
