import { Injectable } from '@angular/core';
//importing httpclient(service) from angular library in order to show db data on UI 
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product';
import { map } from 'rxjs/operators';


//importing environment.ts file from root folder
// import {environment} from '../../../../../environments/environment';
//shortcut created in (tsconfig.base.json)- importing environment.ts file from root folder
import { environment } from '@env/environment';


@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  apiURLProducts = environment.apiURL + 'products';

  constructor(private http: HttpClient) { }

    //to return Array of Categories
    //Observable< type >
  getProducts(): Observable<Product[]>  {
    //this is returning something called observable, inside this observable there is category array
    // return this.http.get<Category[]>('http://localhost:3000/api/v1/categories/');
    return this.http.get<Product[]>(this.apiURLProducts);

  }

  // //Add DATA entered by user on UI onto the DB
  // productData will accept FormData
  createProduct( productData: FormData ): Observable<Product>{
    // ( url, specify the data gathered from the UI)
    // return this.http.post<Category>('http://localhost:3000/api/v1/categories/', category);
    return this.http.post<Product>(this.apiURLProducts, productData);

  }

    // Getting a single product based on productId
  getProduct( productId : string ): Observable<Product>  {
    // return this.http.get<Category>('http://localhost:3000/api/v1/categories/' + categoryId );
    // return this.http.get<Category>(`http://localhost:3000/api/v1/categories/${categoryId}`);
    return this.http.get<Product>(`${this.apiURLProducts}/${productId}`);

  }

  //we can get product id from productData or FormData but this format is better
  updateProduct( productData: FormData, productid: string ): Observable<Product>{
    // ( url, specify the data gathered from the UI)
    // return this.http.put<Category>('http://localhost:3000/api/v1/categories/'+ category.id  , category);
    return this.http.put<Product>(`${this.apiURLProducts}/${productid}`  , productData);

  }

  //taking ID, returning onservating of some type ie object
  //Observable<object> - return Object
  //Observable<any>- return any type
  deleteProduct( productId: string): Observable<any>{
    return this.http.delete<any>(`${this.apiURLProducts}/${productId}`)
  }

  //V1
  // getProductsCount(): Observable<{ productCount: number}>{
  //   return this.http.get<{ productCount: number }>(`${this.apiURLProducts}/get/count`).pipe();
  // }

  //V2
  getProductsCount(): Observable<number> {
    return this.http
      .get<number>(`${this.apiURLProducts}/get/count`)
      .pipe(map((objectValue: any) => objectValue.productCount));
  }

}
