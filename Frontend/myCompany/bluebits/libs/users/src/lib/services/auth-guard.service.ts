import { state } from '@angular/animations';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { LocalstorageService } from './localstorage.service';

@Injectable({
  providedIn: 'root'
})

//CanActivate
//Interface that a class can implement to be a guard deciding if a route can be activated.
// If all guards return true, navigation continues. If any guard returns false, navigation is cancelled. If any guard returns a UrlTree, the current navigation is cancelled and a new navigation begins to the UrlTree returned from the guard.
export class AuthGuard implements CanActivate {

  constructor( 
    private router: Router,
    private localStorageToken: LocalstorageService
     ) {  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
    //getToken helps retrive token from localstorage
    const token = this.localStorageToken.getToken();

    if(token){
      //The atob() function decodes a string of data which has been encoded using Base64 encoding.
      //1st step to validate the token because anyone can put jwtToken = 'aassddfggghsdd' and access the urls based on old code
      // split will happen based on '.' and store it in an array. we need 2nd part( data) ie. [1]
      //{"userId":"633c7f4db439ec5a8bf0365d","isAdmin":true,"iat":1683177197,"exp":1683263597}
      // const tokenDecode = atob(token.split('.')[1]);
      //JSON.parse() is a built-in JavaScript method that allows you to convert a JSON string into a JavaScript object
      
      const tokenDecode = JSON.parse(atob(token.split('.')[1]));
      // console.log(tokenDecode);
      // //v-1 if token is found and has "isAdmin":true 
      // if(tokenDecode.isAdmin){
      //   //if token is found and has "isAdmin":true means no guarding is required, it will let you login
      //   return true;
      // }
      //v-2 check  "isAdmin":true and expiration time
      if( tokenDecode.isAdmin && !this._tokenExpired(tokenDecode.exp)){
        return true;
      }
      
    }
    //redirect the user to login page if token not found in localStorage
    this.router.navigate(['/login']);
    //false is for guarding
    return false;
  }

  //checking if the token expired or not or you can google momentjs or another library to check the validity of token, here we did it with vanilla javascript
  // return typr is boolean
  private _tokenExpired(expiration): boolean {
    // if current time >= exp time set for a current user token then true
    return Math.floor( new Date().getTime()/ 1000) >= expiration;
  }

}
