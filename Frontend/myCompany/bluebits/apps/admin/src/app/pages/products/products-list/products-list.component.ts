import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Product, ProductsService } from '@bluebits/products';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
    selector: 'admin-products-list',
    templateUrl: './products-list.component.html',
    styles: []
})
export class ProductsListComponent {
    products: Product[] = [];

    constructor(
        private productsService : ProductsService,
        private router : Router,
        //for confirm dialogue before deletion
        private confirmationService: ConfirmationService,
        //using router class to edit product( redirecting it to product-form component page)
        private messageService: MessageService
        ){}

    ngOnInit(): void{
        this._getProducts();
          
    }

    private _getProducts(){
        //products will return in the callback of the subscribe
        this.productsService.getProducts().subscribe( (productss) => {
            this.products = productss;
        });
    }

    deleteProduct(productId: string){
        //for confirmation dialogue
        this.confirmationService.confirm({
            message: 'Do you want to delete this Product?',
            header: 'Delete Product',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                //calling product service which is responsible for deleting
                this.productsService.deleteProduct(productId).subscribe( 
                    () =>{
                    //after succesful response i want to call products display page again.
                    this._getProducts(); 
                    this.messageService.add({
                        severity:'success', 
                        summary:'Success', 
                        detail:'Product is Deleted!'
                    });
                },
                ()=> {
                    this.messageService.add({
                        severity:'error', 
                        summary:'Error', 
                        detail:'Product is not Deleted'
                    });
                    
                }
                )
                
            },
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            // reject: () => {
            //     // switch(type) {
            //     //     case ConfirmEventType.REJECT:
            //     //         this.messageService.add({severity:'error', summary:'Rejected', detail:'You have rejected'});
            //     //     break;
            //     //     case ConfirmEventType.CANCEL:
            //     //         this.messageService.add({severity:'warn', summary:'Cancelled', detail:'You have cancelled'});
            //     //     break;
            //     // }
            // }
        }); 
    }

    updateProduct(productid: string){
        this.router.navigateByUrl(`products/form/${productid}`) 
    }



}
