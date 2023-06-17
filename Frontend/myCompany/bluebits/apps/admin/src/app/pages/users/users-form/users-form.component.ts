import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User, UsersService } from '@bluebits/users';
//to fire the toast notification
import { MessageService } from 'primeng/api';
import { timer } from 'rxjs';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
// //thats how we import in js
// // var countries = require("i18n-iso-countries");
// //thats how we import in typescript
// import * as countriesLib from 'i18n-iso-countries';

// declare const require;

@Component({
    selector: 'admin-users-form',
    templateUrl: './users-form.component.html',
    styles: []
})
export class UsersFormComponent {

    //variables
    // form: type
    form: FormGroup;
    isSubmitted = false;
    //using editmode basically we using same categories-form( which was intially made to add categories)
    //will now be used for (edit user)
    editmode = false;
    // setting global variablr for current ID to null
    currentUserId : string ;
    countries = [];

    //constructor 
    //to build a reactive form in angular we need to use a service( called FormBuilder )
    //calling this service through constructor
    constructor(
        private formBuilder: FormBuilder, 
        private usersServices: UsersService,
        //helps in calling any particular service eg: deleteCategory() 
        private messageService: MessageService,
        private location: Location, 
        // this is used to figure out if we have a paramter in the url or not
        private route: ActivatedRoute
        ){}

    ngOnInit(): void{
        
        //private method
        this._initUserForm();
        // for dropdown
        this._getCountries();
        this._checkEditMode()
    }
    
    onSubmit(){

        //when user click on blue create button, it became true( tracking if user clicked or not)
        this.isSubmitted = true;

        //checking if inputs are empty then return nothing
        if ( this.form.invalid ){
            return;
        }        
        //v1
        // console.log(this.form.controls['name'].value);
        // console.log(this.form.controls['icon'].value);
        //v2 showing in console
        // console.log(this.userForm['name'].value);
        // console.log(this.userForm['icon'].value);
        //v3 - Adding data to db which i collected from the user on screen 
        const user: User = {
            id: this.currentUserId,
            name: this.userForm['name'].value,
            email: this.userForm['email'].value,
            password: this.userForm['password'].value,
            phone: this.userForm['phone'].value,
            isAdmin: this.userForm['isAdmin'].value,
            street: this.userForm['street'].value,
            apartment: this.userForm['apartment'].value,
            zip: this.userForm['zip'].value,
            city: this.userForm['city'].value,
            country: this.userForm['country'].value
        };

        //Updating a User in backend if editmode is true
        if( this.editmode){
            this._updateUser(user)
        }else{
            this._addUser(user)
        }
               
    }

    onCancel(){
        this.location.back();
    }

    private _initUserForm(){
        //when i click on new this component will be initialized
        //defining controls like Name, Icon here
        //also angular will interact/validate here to see every error user can put4
        //form builder
        this.form = this.formBuilder.group({
            name: ['', Validators.required],
            //we can use multiple validators in a array
            email: ['', [Validators.required, Validators.email]],
            //password is required while creating/adding but not required while updating( its a user choice to update pass or not while updating)
            password: ['', Validators.required],
            phone: ['', Validators.required],
            isAdmin: [false],
            street: [''],
            apartment: [''],
            zip: ['' ],
            city: [''],
            country: ['']    
            //seettinf default value of color picket to white, when no value comes from db/user
            // color: ['#fff']
        });
        
    }

    //moving to user.service
    // private _getCountries(){
    //     // require will ask from the library to bring english file which has all countries list which is located here
    //     countriesLib.registerLocale(require("i18n-iso-countries/langs/en.json"));
    //     //output is object but our dropdown needs countries of array or list
    //     // console.log(countriesLib.getNames("en", {select: "official"})); 
    //     //object.entries will help loop over all the entries like they are an array then .map will operations on it entry by entry
    //     this.countries = Object.entries(countriesLib.getNames("en", {select: "official"})).map(entry => {
    //         // console.log(entry);
    //         return {
    //             id: entry[0],
    //             name: entry[1]
    //         }
    //     })
    //     console.log(this.countries);
    // }

    private _getCountries(){
        this.countries = this.usersServices.getCountries();
    }

    //acception JSON data not FormData
    private _addUser(user: User){
        // subscribe()- convert an array to an observable
        //( if i seee response: show success mssg else show error message)
        this.usersServices.createUser(user).subscribe( 
            //response
            (user: User) => {
            this.messageService.add({
                severity:'success', 
                summary:'Success', 
                detail:`User ${user.name} is created!`
            });
            //after success msg we'are taking user back from categories form page to categories display page 
            //timer( 2000 miliseconds after the sucess msg it will execute)
            timer( 2000 ).toPromise().then( ()=> {
                //redirect to previous page( categories display page)
                this.location.back();

            })
        },
        ()=> {
            this.messageService.add({
                severity:'error', 
                summary:'Error', 
                detail:'User is not created'
            });
            
        }
        ); 
    }

    private _updateUser(user: User){
        //calling updateUser service
         // subscribe()- convert an array to an observable
        //( if i seee response: show success mssg else show error message)
        this.usersServices.updateUser(user).subscribe( 
            (user: User) => {
            this.messageService.add({
                severity:'success', 
                summary:'Success', 
                detail:`User ${user.name} is updated!`
            });
            //after success msg we'are taking user back from categories form page to categories display page 
            //timer( 2000 miliseconds after the sucess msg it will execute)
            timer( 2000 ).toPromise().then( ()=> {
                //redirect to previous page( categories display page)
                this.location.back();

            })
        },
        ()=> {
            this.messageService.add({
                severity:'error', 
                summary:'Error', 
                detail:'User is not updated'
            });
            
        }
        ); 


    }

    // checking if it is editmode or addmode for user
    private _checkEditMode(){
        //way to read the paramter/id coming with url
        this.route.params.subscribe( params => {
            //id should be the same keyword from path: 'categories/form/:id' in app.module
            if(params['id']) {
                this.editmode = true;
                //after chceking if id is there , setting id to global variable
                this.currentUserId = params['id'];
                //calling getCatgory service
                this.usersServices.getUser(params['id']).subscribe( user =>{
                    //setting user data on input blank of name and icon using userForm ( and user.name is getting data from backend using id)
                    this.userForm['name'].setValue(user.name);
                    this.userForm['email'].setValue(user.email);
                    this.userForm['phone'].setValue(user.phone);
                    this.userForm['isAdmin'].setValue(user.isAdmin);
                    this.userForm['street'].setValue(user.street);
                    this.userForm['apartment'].setValue(user.apartment);
                    this.userForm['zip'].setValue(user.zip);
                    this.userForm['city'].setValue(user.city);
                    this.userForm['country'].setValue(user.country);
                    //password is required while creating/adding but not required while updating( its a user choice to update pass or not while updating) so removing validation for this
                    this.userForm['password'].setValidators([]);
                    this.userForm['password'].updateValueAndValidity();

                })
            }
        })
    }

    // private _cancelButton(){
    //     timer( 2000 ).toPromise().then( ()=> {
    //         //redirect to previous page( categories display page)
    //         this.location.back();

    //     }
    // }


    //setting getters , setters for userForm( when i want to access controls of this form)
    get userForm(){
        return this.form.controls;
    }
}
