import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { Observable, catchError, delay, throwError, retry, tap } from 'rxjs';
import { IProduct } from '../models/product';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  constructor(private http: HttpClient, private errorService: ErrorService) {}

  products: IProduct[] = [];

  getAll(): Observable<IProduct[]> {
    return this.http
      .get<IProduct[]>('https://fakestoreapi.com/products', {
        //   params: new HttpParams().append('limit', 5),
        //   params: new HttpParams({
        //     fromString: 'limit=5',
        //   }),
        params: new HttpParams({
          fromObject: { limit: 5 },
        }),
      })
      .pipe(
        delay(500),
        retry(2),
        tap((products) => (this.products = products)),
        catchError(this.errorHandler.bind(this))
      );
  }

  create(product: IProduct): Observable<IProduct> {
    return this.http
      .post<IProduct>('https://fakestoreapi.com/products', product)
      .pipe(tap((prod) => this.products.unshift(prod)));
  }

  private errorHandler(error: HttpErrorResponse) {
    this.errorService.handle(error.message);
    return throwError(() => error.message);
  }
}

//! Сгенерировать файл обрабортки ошибки - ng g s services/error --skip-tests
//?g=generate; s=service; services/error = path

//! Готовый компонент ошибки  ng g c components/global-error --skip-tests
//? c=component

//! Filter pipes ?? ng g p pipes/filter-products
//? p=pipe

//!Генерируем новый компонент ng g c components/modal --skip-tests
