import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductListComponent } from './product-list.component';
import { ProductService } from '../product.service';
import { CartService } from '../../cart/cart.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { Product } from '../../models/product';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let productServiceSpy: jasmine.SpyObj<ProductService>;
  let cartServiceSpy: jasmine.SpyObj<CartService>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;
  
  const mockProducts: Product[] = [
    { id: 1, name: 'Painting 1', price: 100, image_url: 'image1.jpg', description: 'Description 1' },
    { id: 2, name: 'Painting 2', price: 200, image_url: 'image2.jpg', description: 'Description 2' },
    { id: 3, name: 'Abstract Art', price: 150, image_url: 'image3.jpg', description: 'Description 3' }
  ];

  beforeEach(async () => {
    productServiceSpy = jasmine.createSpyObj('ProductService', ['getProducts']);
    cartServiceSpy = jasmine.createSpyObj('CartService', ['addToCart']);
    snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
    
    productServiceSpy.getProducts.and.returnValue(of(mockProducts));
    cartServiceSpy.addToCart.and.callFake((product: Product) => of(product));

    await TestBed.configureTestingModule({
      declarations: [ProductListComponent],
      imports: [
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatCardModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: ProductService, useValue: productServiceSpy },
        { provide: CartService, useValue: cartServiceSpy },
        { provide: MatSnackBar, useValue: snackBarSpy }
      ]
    }).compileComponents();
    
    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load products on init', () => {
    expect(productServiceSpy.getProducts).toHaveBeenCalled();
    expect(component.products).toEqual(mockProducts);
    expect(component.filteredProducts).toEqual(mockProducts);
  });

  it('should filter products based on search term', () => {
    const event = new Event('input');
    Object.defineProperty(event, 'target', { value: { value: 'abstract' } });
    
    component.applyFilter(event);
    
    expect(component.filteredProducts.length).toBe(1);
    expect(component.filteredProducts[0].name).toBe('Abstract Art');
  });

  it('should sort products by price low to high', () => {
    component.sortProducts('priceLowToHigh');
    
    expect(component.filteredProducts[0].price).toBe(100);
    expect(component.filteredProducts[1].price).toBe(150);
    expect(component.filteredProducts[2].price).toBe(200);
  });

  it('should sort products by price high to low', () => {
    component.sortProducts('priceHighToLow');
    
    expect(component.filteredProducts[0].price).toBe(200);
    expect(component.filteredProducts[1].price).toBe(150);
    expect(component.filteredProducts[2].price).toBe(100);
  });

  it('should add product to cart and show notification', () => {
    const product = mockProducts[0];
    component.addToCart(product);
    
    expect(cartServiceSpy.addToCart).toHaveBeenCalledWith(product);
    expect(snackBarSpy.open).toHaveBeenCalledWith(
      'Painting 1 added to cart',
      '',
      {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top'
      }
    );
  });

  it('should maintain filtered products after sorting', () => {
    const event = new Event('input');
    Object.defineProperty(event, 'target', { value: { value: 'painting' } });
    
    component.applyFilter(event);
    component.sortProducts('priceLowToHigh');
    
    expect(component.filteredProducts.length).toBe(2);
    expect(component.filteredProducts[0].price).toBe(100);
    expect(component.filteredProducts[1].price).toBe(200);
  });
});
