import { Component, OnInit } from '@angular/core';
import { OrdersService } from '@bluebits/orders';
import { ProductsService } from '@bluebits/products';
import { UsersService } from '@bluebits/users';
import { combineLatest } from 'rxjs';

import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'admin-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  statistics: any[]= [];
  constructor(
    private userService: UsersService,
    private productService: ProductsService,
    private ordersService: OrdersService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    //we are not using subscribe() here with each invidual service( like getOrdersCount().subscribe()), instead 
    //we're using "combineLatest" in rxjs to combine multiple observable when all of them are ready, 
    //then we subscribe to them , then we'll get array of values in exactly the same order as below
    combineLatest([
      this.ordersService.getOrdersCount(),// 0th position in an array
      this.productService.getProductsCount(),// 1st
      this.userService.getUsersCount(),//2nd
      this.ordersService.getTotalSales()//3rd
    ]).subscribe((values) => {
      this.statistics = values;
    });
  }
}
