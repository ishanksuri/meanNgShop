import { Component } from '@angular/core';
import { Router } from '@angular/router';
//importing
import { CategoriesService, Category } from '@bluebits/products';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
    selector: 'admin-categories-list',
    templateUrl: './categories-list.component.html',
    styles: []
})
export class CategoriesListComponent {

    // //hardcoded 
    // categories = [
    //     {
    //         id: 1,
    //         name: "category-1",
    //         icon: "icon-1",         
    //     },
    //     {
    //         id: 2,
    //         name: "category-2",
    //         icon: "icon-2",         
    //     }
    //     ,
    //     {
    //         id: 3,
    //         name: "category-3",
    //         icon: "icon-3",         
    //     }

    // ];

    // categories: type
    categories: Category[] = [];

    //service to get data from DB
    constructor( 
        private categoriesService: CategoriesService,
        private messageService: MessageService,
        //for confirm dialogue before deletion
        private confirmationService: ConfirmationService,
        //using router class to edit category( redirecting it to category-form component page)
        private router: Router
         ){}

    // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
    ngOnInit(): void {
        //calling getCategories service via method
        this._getCategories()
        
    }

    deleteCategory( categoryId: string){
        //for confirmation dialogue
        this.confirmationService.confirm({
            message: 'Do you want to delete this Category?',
            header: 'Delete Category',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                //calling category service which is responsible for deleting
                this.categoriesService.deleteCategory(categoryId).subscribe( 
                    () =>{
                    //after succesful response i want to call categories display page again.
                    this._getCategories(); 
                    this.messageService.add({
                        severity:'success', 
                        summary:'Success', 
                        detail:'Category is Deleted!'
                    });
                },
                ()=> {
                    this.messageService.add({
                        severity:'error', 
                        summary:'Error', 
                        detail:'Category is not Deleted'
                    });
                    
                }
                )
                
            },
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            reject: () => {
                // switch(type) {
                //     case ConfirmEventType.REJECT:
                //         this.messageService.add({severity:'error', summary:'Rejected', detail:'You have rejected'});
                //     break;
                //     case ConfirmEventType.CANCEL:
                //         this.messageService.add({severity:'warn', summary:'Cancelled', detail:'You have cancelled'});
                //     break;
                // }
            }
        });
    } 

    private _getCategories(){
        //calling getCategories service
        this.categoriesService.getCategories().subscribe( cats => {
            this.categories = cats;
        })
    }

    //edit category
    updateCategory(categoryid: string){
        //when user click on edit button, it will navigate to below link first
        this.router.navigateByUrl(`categories/form/${categoryid}`)
    }
}
