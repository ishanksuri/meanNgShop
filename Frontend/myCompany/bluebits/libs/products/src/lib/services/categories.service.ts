import { Injectable } from '@angular/core';
//importing httpclient(service) from angular library in order to show db data on UI 
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../models/category';

//importing environment.ts file from root folder
// import {environment} from '../../../../../environments/environment';
//shortcut created in (tsconfig.base.json)- importing environment.ts file from root folder
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  apiURLCategories = environment.apiURL + 'categories';

  constructor(private http: HttpClient) { }

    //to return Array of Categories
    //Observable< type >
  getCategories(): Observable<Category[]>  {
    //this is returning something called observable, inside this observable there is category array
    // return this.http.get<Category[]>('http://localhost:3000/api/v1/categories/');
    return this.http.get<Category[]>(this.apiURLCategories);

  }

  // Getting a single category based on categoryId
  getCategory( categoryId : string ): Observable<Category>  {
    // return this.http.get<Category>('http://localhost:3000/api/v1/categories/' + categoryId );
    // return this.http.get<Category>(`http://localhost:3000/api/v1/categories/${categoryId}`);
    return this.http.get<Category>(`${this.apiURLCategories}/${categoryId}`);

  }

  //Add DATA entered by user on UI onto the DB
  createCategory( category: Category ): Observable<Category>{
    // ( url, specify the data gathered from the UI)
    // return this.http.post<Category>('http://localhost:3000/api/v1/categories/', category);
    return this.http.post<Category>(this.apiURLCategories, category);

  }

  updateCategory( category: Category ): Observable<Category>{
    // ( url, specify the data gathered from the UI)
    // return this.http.put<Category>('http://localhost:3000/api/v1/categories/'+ category.id  , category);
    return this.http.put<Category>(`${this.apiURLCategories}/${category.id}`  , category);

  }

  //taking ID, returning onservating of some type ie object
  //Observable<object> - return Object
  //Observable<any>- return any type
  deleteCategory( categoryId: string): Observable<any>{
    return this.http.delete<any>(`${this.apiURLCategories}/${categoryId}`)
  }
}
