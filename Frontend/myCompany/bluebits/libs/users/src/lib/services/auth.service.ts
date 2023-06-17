import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { LocalstorageService } from './localstorage.service';
// import { LocalstorageService } from './localstorage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  //doing to mimicking the server error
  // apiURLUsers = environment.apiURL + 'susers';
  apiURLUsers = environment.apiURL + 'users';


  constructor(  
    private http: HttpClient,
    private token: LocalstorageService,
    private router: Router
    ) { }

    //it will return observable of user( or a user with a token from this observer)
    //why using http client here ?
  login(email: string, password: string): Observable<User> {
    //if you notice thats how we are giving data to api in postman { email: email, password: password }
    // return this.http.post<User>(`${this.apiURLUsers}/login`, { email: email, password: password });
    //if key and value name is same
    //retun type is User
    return this.http.post<User>(`${this.apiURLUsers}/login`, { email, password });
  }

  //just delete the token from local storage to logout
  logout(){
    this.token.removeToken();
    //redirect to login page after token deletion
    this.router.navigate(['/login']);
  }
}
