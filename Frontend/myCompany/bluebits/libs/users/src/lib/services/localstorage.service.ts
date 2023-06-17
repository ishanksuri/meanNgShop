import { Injectable } from '@angular/core';

const TOKEN = 'jwtToken'

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {

  constructor() { }
  //when user login for the first time 
  setToken(data){
    localStorage.setItem(TOKEN, data);
  }

  //when we need to get token back
  getToken(): string {
    return localStorage.getItem(TOKEN);
  }

  //when the user logouts
  removeToken() {
    localStorage.removeItem(TOKEN);
  }
}
