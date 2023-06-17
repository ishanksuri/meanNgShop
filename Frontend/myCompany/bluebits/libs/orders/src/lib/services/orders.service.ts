import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
//this map is not from array, its from rxjs.. so we need to use pipe( inside pipe ) along with it
import { map } from 'rxjs/operators';
import { Order } from '../models/order';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  apiURLOrders = environment.apiURL + 'orders';

  constructor(private http: HttpClient) {}

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiURLOrders);
  }

  getOrder(orderId: string): Observable<Order> {
    return this.http.get<Order>(`${this.apiURLOrders}/${orderId}`);
  }

  createOrder(order: Order): Observable<Order> {
    return this.http.post<Order>(this.apiURLOrders, order);
  }

  //only updating status of order ie. 0 or,1,2,3
  //not using order: Order because we are only sending status in json like this {"status": "2"}
  // orderStaus: user defined type
  //we also need to pass orderId
  //after udating the order we'll get order itself ie. Observable<Order> 
  updateOrder(orderStaus: { status: string }, orderId: string): Observable<Order> {
    return this.http.put<Order>(`${this.apiURLOrders}/${orderId}`, orderStaus);
  }

  deleteOrder(orderId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiURLOrders}/${orderId}`);
  }

  //V1
  // as this is the response what we get in postman, form of object thats why
  //{
  //  "orderCount": 9
  // }
  // so we're expecting in the same format
  //as it is returning object so
  //in dashboard.component.html file, we'll using statistics[0].orderCount to display
  //<span class="number">{{ statistics[0].orderCount }}</span>
  // getOrdersCount(): Observable<{ orderCount: number}>{
  //   return this.http.get<{ orderCount: number }>(`${this.apiURLOrders}/get/count`).pipe();
  // }

  //v2
  // but here we want to store value directly to the array statistics
  // and we want to extract value like this in fronend directly
  //<span class="number">{{ statistics[0] }}</span>
  //we expect only number to return here but api will return object
  // so we'll be using map and pipes to make it store number only
  //use like this- objectValue.orderCount will return number as ( api is returning orderCount in an object )
  getOrdersCount(): Observable<number> {
    return this.http
      .get<number>(`${this.apiURLOrders}/get/count`)
      .pipe(map((objectValue: any) => objectValue.orderCount));
  }
  //V1
  // getTotalSales(): Observable<{totalsales: number}>{
  //   return this.http.get<{ totalsales: number }>(`${this.apiURLOrders}/get/totalsales`).pipe();
  // }

  //V2
  getTotalSales(): Observable<number> {
    return this.http
      .get<number>(`${this.apiURLOrders}/get/totalsales`)
      .pipe(map((objectValue: any) => objectValue.totalsales));
  }

  
}
