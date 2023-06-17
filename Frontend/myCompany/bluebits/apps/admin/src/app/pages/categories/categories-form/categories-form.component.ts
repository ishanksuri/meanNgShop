/* eslint-disable @angular-eslint/use-lifecycle-interface */
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoriesService, Category } from '@bluebits/products';
//to fire the toast notification
import { MessageService } from 'primeng/api';
import { timer } from 'rxjs';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'admin-categories-form',
    templateUrl: './categories-form.component.html',
    styles: []
})
export class CategoriesFormComponent {

    //variables
    // form: type
    form: FormGroup;
    isSubmitted = false;

    //using editmode basically we using same categories-form( which was intially made to add categories)
    //will now be used for (edit category)
    editmode = false;
    // setting global variablr for current ID to null
    currentCategoryId : string ;

    //constructor 
    //to build a reactive form in angular we need to use a service( called FormBuilder )
    //calling this service through constructor
    constructor(
        private formBuilder: FormBuilder, 
        private categoriesServices: CategoriesService,
        //helps in calling any particular service eg: deleteCategory() 
        private messageService: MessageService,
        private location: Location, 
        // this is used to figure out if we have a paramter in the url or not
        private route: ActivatedRoute
        ){}

    ngOnInit(): void{
        //when i click on new this component will be initialized
        //defining controls like Name, Icon here
        //also angular will interact/validate here to see every error user can put4
        //form builder
        this.form = this.formBuilder.group({
            name: ['', Validators.required],
            icon: ['', Validators.required],
            //seettinf default value of color picket to white, when no value comes from db/user
            color: ['#fff']
        });

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
        // console.log(this.categoryForm['name'].value);
        // console.log(this.categoryForm['icon'].value);
        //v3 - Adding data to db which i collected from the user on screen 
        const category: Category = {
            id: this.currentCategoryId,
            name: this.categoryForm['name'].value,
            icon: this.categoryForm['icon'].value,
            color: this.categoryForm['color'].value
        };

        //Updating a Category in backend if editmode is true
        if( this.editmode){
            this._updateCategory(category)
        }else{
            this._addCategory(category)
        }


               
    }

    onCancel(){
        this.location.back();
    }

    //acception JSON data not FormData
    private _addCategory(category: Category){
        // subscribe()- convert an array to an observable
        //( if i seee response: show success mssg else show error message)
        this.categoriesServices.createCategory(category).subscribe( 
            //response
            (category: Category) => {
            this.messageService.add({
                severity:'success', 
                summary:'Success', 
                detail:`Category ${category.name} is created!`
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
                detail:'Category is not created'
            });
            
        }
        ); 
    }

    private _updateCategory(category: Category){
        //calling updateCategory service
         // subscribe()- convert an array to an observable
        //( if i seee response: show success mssg else show error message)
        this.categoriesServices.updateCategory(category).subscribe( 
            (category: Category) => {
            this.messageService.add({
                severity:'success', 
                summary:'Success', 
                detail:`Category ${category.name} is updated!`
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
                detail:'Category is not updated'
            });
            
        }
        ); 


    }

    // checking if it is editmode or addmode for category
    private _checkEditMode(){
        //way to read the paramter/id coming with url
        this.route.params.subscribe( params => {
            //id should be the same keyword from path: 'categories/form/:id' in app.module
            if(params['id']) {
                this.editmode = true;
                //after chceking if id is there , setting id to global variable
                this.currentCategoryId = params['id'];
                //calling getCatgory service
                this.categoriesServices.getCategory(params['id']).subscribe( category =>{
                    //setting category data on input blank of name and icon using categoryForm ( and category.name is getting data from backend using id)
                    this.categoryForm['name'].setValue(category.name);
                    this.categoryForm['icon'].setValue(category.icon);
                    this.categoryForm['color'].setValue(category.color)
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


    //setting getters , setters for categoryForm( when i want to access controls of this form)
    get categoryForm(){
        return this.form.controls;
    }

    
}
