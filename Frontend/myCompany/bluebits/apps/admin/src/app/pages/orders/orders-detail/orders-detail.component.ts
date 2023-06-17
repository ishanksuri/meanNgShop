import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Order, OrdersService } from '@bluebits/orders';
import { MessageService } from 'primeng/api';
import { ORDER_STATUS } from '../order.constants';

@Component({
  selector: 'admin-orders-detail',
  templateUrl: './orders-detail.component.html',
  styles: []
})
export class OrdersDetailComponent implements OnInit {
  order: Order;
  //Was getting error using the orderStatuses = [];
  //because when we enable the strict mode then the type must be specified
  orderStatuses: unknown[] =  [];
  selectedStatus: any;

  constructor(
    private orderService: OrdersService,
    private messageService: MessageService,
    //activated route is used to get information while router is used to navigate 
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    //should call before getting the order
    this._mapOrderStatus();
    this._getOrder();
  }

  //turning dictionary into array ( of dictionary(each order) )
  private _mapOrderStatus() {
    // console.log( Object.keys(ORDER_STATUS));
    // console.log( ORDER_STATUS[0]);
    this.orderStatuses = Object.keys(ORDER_STATUS).map((key) => {
      return {
    // console.log( ORDER_STATUS[key]);
        id: key,
        // since only need to display name/label in the dropdown ( not using color)
        name: ORDER_STATUS[key].label
      };
    }); 

    // console.log(this.orderStatuses);
  }

  private _getOrder() {
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.orderService.getOrder(params['id']).subscribe((order) => {
          this.order = order;
          console.log(this.order);
          //to update the ngmodel finally
          this.selectedStatus = order.status;
        });
      }
    });
  }

  // changes status of dropdown when 
  onStatusChange(event) {
    // as we saw previously in the console log, using optionValue="id" in .html we're getting value
    this.orderService.updateOrder({ status: event.value }, this.order.id).subscribe( 
      // (order) =>{
      //   console.log(order);
      // },
      
      () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Order is updated!'
        });
      },
      () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Order is not updated!'
        });
      }
    );
  }
}
