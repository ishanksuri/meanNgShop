import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { User, UsersService  } from '@bluebits/users';
//thats how we import in js
// var countries = require("i18n-iso-countries");
//thats how we import in typescript
// import * as countriesLib from 'i18n-iso-countries';



@Component({
    selector: 'admin-users-list',
    templateUrl: './users-list.component.html',
    styles: []
})
export class UsersListComponent {

     // users: type
     users: User[] = [];

     //service to get data from DB
     constructor( 
         private usersService: UsersService,
         private messageService: MessageService,
         //for confirm dialogue before deletion
         private confirmationService: ConfirmationService,
         //using router class to edit category( redirecting it to category-form component page)
         private router: Router
          ){}
 
     // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
     ngOnInit(): void {
         //calling getCategories service via method
         this._getUsers()
         
     }
 
     deleteUser( userId: string){
         //for confirmation dialogue
         this.confirmationService.confirm({
             message: 'Do you want to delete this User?',
             header: 'Delete User',
             icon: 'pi pi-exclamation-triangle',
             accept: () => {
                 //calling category service which is responsible for deleting
                 this.usersService.deleteUser(userId).subscribe( 
                     () =>{
                     //after succesful response i want to call categories display page again.
                     this._getUsers(); 
                     this.messageService.add({
                         severity:'success', 
                         summary:'Success', 
                         detail:'User is Deleted!'
                     });
                 },
                 ()=> {
                     this.messageService.add({
                         severity:'error', 
                         summary:'Error', 
                         detail:'User is not Deleted'
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
     getCountryName( countryKey: string){
        if ( countryKey){
            return this.usersService.getCountry(countryKey);
        }
        // else{
        //     return 1
        // }
        
        //solution2
        // "noImplicitReturns": false,
    }
     
     private _getUsers(){
        //calling getCategories service
        this.usersService.getUsers().subscribe( people => {
            this.users = people;
        })
    }

    //edit category
    updateUser(userid: string){
        //when user click on edit button, it will navigate to below link first
        this.router.navigateByUrl(`users/form/${userid}`)
    }

    




}
