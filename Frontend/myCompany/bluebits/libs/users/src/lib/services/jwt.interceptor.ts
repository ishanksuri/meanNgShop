import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { LocalstorageService } from './localstorage.service';
import { environment } from '@env/environment';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  //we need to load the token over the request with help of interceptor in angular
  //( like we used to pass token in bearer authentication in postman )
  // and observing all the requests going out of frontend to the backend api, then load the token after checking
  // basically interceptor is somthing that will loaded over the http service and it will load the token over it.
  // because every req going in your application is going over headers
  //so authentication will be loaded over the header of the request

  constructor( private localstorageToken : LocalstorageService ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.localstorageToken.getToken();
    //every request going from the fronend is http request
    //we have to intercept them
    // the url will be inside the user data in request, we need url as it will be our api url
    // means if api url starts with apiURL: 'http://localhost:3000/api/v1/' then only intercept
    const isAPIUrl = request.url.startsWith(environment.apiURL)
    //putting token inside the header ( similar to bearer token authorisation)
    if( token && isAPIUrl ){
      //if condtn is true , add headers to the request
      //clone the current request and then adjusst headers
      request = request.clone({
        //putting token into the headers of the request
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      })
    }
    return next.handle(request);
  }
}

//ONE CONCERN IS anybody can send token from postman and bypass this ,
//but in backend we're using a secret( in env file) on which the token will be generated, so below token will be analysed based on that secret
//under inspect
//network-> headers
//you can see the bearer token which i'm passing
//Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MzNjN2Y0ZGI0MzllYzVhOGJmMDM2NWQiLCJpc0FkbWluIjp0cnVlLCJpYXQiOjE2ODM0NDQ2MDQsImV4cCI6MTY4MzUzMTAwNH0.xDVByWquUAu5cxZXAI_2K46XIYwcQoJfZDvyqTurNqA
// 