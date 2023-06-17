import { Injectable } from '@angular/core';
//importing httpclient(service) from angular library in order to show db data on UI 
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { map } from 'rxjs/operators';


//thats how we import in js
// var countries = require("i18n-iso-countries");
//thats how we import in typescript
import * as countriesLib from 'i18n-iso-countries';
declare const require;


//importing environment.ts file from root folder
// import {environment} from '../../../../../environments/environment';
//shortcut created in (tsconfig.base.json)- importing environment.ts file from root folder
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  apiURLUsers = environment.apiURL + 'users';

  constructor(private http: HttpClient) {
    // require will ask from the library to bring english file which has all countries list which is located here
    countriesLib.registerLocale(require("i18n-iso-countries/langs/en.json"));
   }

    //to return Array of Users
    //Observable< type >
  getUsers(): Observable<User[]>  {
    //this is returning something called observable, inside this observable there is user array
    // return this.http.get<User[]>('http://localhost:3000/api/v1/categories/');
    return this.http.get<User[]>(this.apiURLUsers);

  }

  // Getting a single user based on userId
  getUser( userId : string ): Observable<User>  {
    // return this.http.get<User>('http://localhost:3000/api/v1/categories/' + userId );
    // return this.http.get<User>(`http://localhost:3000/api/v1/categories/${userId}`);
    return this.http.get<User>(`${this.apiURLUsers}/${userId}`);

  }

  //Add DATA entered by user on UI onto the DB
  createUser( user: User ): Observable<User>{
    // ( url, specify the data gathered from the UI)
    // return this.http.post<User>('http://localhost:3000/api/v1/categories/', user);
    return this.http.post<User>(this.apiURLUsers, user);

  }

  updateUser( user: User ): Observable<User>{
    // ( url, specify the data gathered from the UI)
    // return this.http.put<User>('http://localhost:3000/api/v1/categories/'+ user.id  , user);
    return this.http.put<User>(`${this.apiURLUsers}/${user.id}`  , user);

  }

  //taking ID, returning onservating of some type ie object
  //Observable<object> - return Object
  //Observable<any>- return any type
  deleteUser( userId: string): Observable<any>{
    return this.http.delete<any>(`${this.apiURLUsers}/${userId}`)
  }

  getCountries(){
    // require will ask from the library to bring english file which has all countries list which is located here
    //moving this to the contructor of user service as it will require by both user-list and user-form,in turn avoiding calling of library again and again
    // countriesLib.registerLocale(require("i18n-iso-countries/langs/en.json"));
    //output is object but our dropdown needs countries of array or list
    // console.log(countriesLib.getNames("en", {select: "official"})); 
    //object.entries will help loop over all the entries like they are an array then .map will operations on it entry by entry
    return Object.entries(countriesLib.getNames("en", {select: "official"})).map(entry => {
        // console.log(entry);
        return {
            id: entry[0],
            name: entry[1]
        }
    })
    // console.log(this.countries);
  }

  getCountry( countryKey: string): string{
    return countriesLib.getName(countryKey, 'en'); 
   }

  // //V1 
  // getUsersCount(): Observable<{ userCount: number }>{
  //   return this.http.get<{ userCount: number }>(`${this.apiURLUsers}/get/count`);
  // }

  //V2
  getUsersCount(): Observable<number> {
    return this.http
      .get<number>(`${this.apiURLUsers}/get/count`)
      .pipe(map((objectValue: any) => objectValue.userCount));
  }
}
