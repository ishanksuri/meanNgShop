import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductsService, Product, CategoriesService, Category } from '@bluebits/products';

//to fire the toast notification
import { MessageService } from 'primeng/api';
import { timer } from 'rxjs';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'admin-products-form',
    templateUrl: './products-form.component.html',
    styles: []
})
export class ProductsFormComponent {

    

    editmode = false;
    //To build this form group we need to use a service called form builder
    form: FormGroup
    isSubmitted = false;
    categories: Category[];
    imageDisplay: string | ArrayBuffer;
    currentProductId: string;

    constructor( 
        //service called form builder
        private formBuilder: FormBuilder,
        private location: Location,
        private productsServices: ProductsService,
        private categoriesService: CategoriesService,
        private messageService: MessageService,
        // this is used to figure out if we have a paramter in the url or not
        private route: ActivatedRoute

    ){}

    ngOnInit(): void {
        //private method
        this._initForm();
        //for dropdown
        this._getCategories();
        this._checkEditMode();
    }

    //here, unlike categories. won't send data to backend as JSON but we will be sending data as FormData format 
    //because we have a file file which is image, it needs to get uploaded
    onSubmit(){
        //when user click on blue create button, it became true( tracking if user clicked or not)
        this.isSubmitted = true;

        if(this.form.invalid){
            return;

        }
        //sending data asa formdata to backend-> FormData comes with basic JavaScript , its not a library.
        //This FormData we're going to pass it to the service which will Add Product and send it to the backend.
        const productFormData = new FormData();

        //moving data enetered by the user on UI to FormData
        //manual method
        // productFormData.append('name', this.productForm['name'].value)
        // productFormData.append('brand', this.productForm['brand'].value)
        // productFormData.append('price', this.productForm['price'].value)

        //looping method for multiple fields
        //give values of keys of this productForm, map-> means go through all of them, ((key-> means give me back all keys one by one))
        Object.keys(this.productForm).map((key) => {
            // console.log(key)
            // console.log(this.productForm[key].value);
            productFormData.append(key, this.productForm[key].value)

        })
        if(this.editmode){
            this._updateProduct(productFormData);
        } else {
            this._addProduct(productFormData);
        }
    }

    onCancel(){
        this.location.back()
    }
    onImageUpload(event) {
        //file getting from event
        // console.log(event);
        //we need only the first element of array
        const file = event.target.files[0];
        //making sure if we got something inside the file or not
        if(file){
            //Adding this code before file gets read by filereader for image preview, as we need this file to send to the backend
            //patching value to the form-> patch value means add value to the key(image) so that it can be used to send image to the backend when user uploads
            this.form.patchValue({image: file});
            //need to update the value after patching and validate using this method to confirm everything is working fine.
            this.form.get('image')?.updateValueAndValidity();

            //using filereader, wecan read through data present in file as "image preview on ui"
            const fileReader = new FileReader();
            //onload should be before readAsDataURL, onload is an event and it must be defined before reading the url
            // this is callback in diffrent way
            fileReader.onload = () => {
                // this.imageDisplay = fileReader.result!;
                //"strictNullChecks": false, in tsconfig.json
                this.imageDisplay = fileReader.result;

            }
            //how to read using fileReader
            fileReader.readAsDataURL(file);
        }

    }

    private _initForm(){
        //when i click on new this component will be initialized
        //defining controls like Name, Icon here
        //also angular will interact/validate here to see every error user can put4
        //form builder
        this.form = this.formBuilder.group({
            //this group members will be exactly the same of the fields of the product itself.
            name: ['', Validators.required],
            brand: ['', Validators.required],
            price: ['', Validators.required], 
            //category will be coming from backend list a list, it will be a selector
            category: ['', Validators.required],
            countInStock: ['', Validators.required],
            description: ['', Validators.required],
            richDescription: [''],
            image: ['', Validators.required],
            isFeatured: [false]
           
        });
    }

    private _getCategories(){
        this.categoriesService.getCategories().subscribe( categoriess => {
            this.categories = categoriess;
        })
    }

    //Accepting FormData unlike category which is accepting JSON data
    private _addProduct(productData: FormData){
        // subscribe()- convert an array to an observable
        //( if i seee response: show success mssg else show error message)
        this.productsServices.createProduct(productData).subscribe( 
            //response
            (product: Product) => {
            this.messageService.add({
                severity:'success', 
                summary:'Success', 
                detail:`Product ${product.name} is created!`
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
                detail:'Product is not created'
            });
            
        }
        ); 
    }

    //using FormData instead of JSON to send data yo backend
    private _updateProduct(productFormData: FormData){
        //calling updateCategory service
         // subscribe()- convert an array to an observable
        //( if i seee response: show success mssg else show error message)
        this.productsServices.updateProduct(productFormData, this.currentProductId).subscribe( 
            (product: Product) => {
            this.messageService.add({
                severity:'success', 
                summary:'Success', 
                detail:`Product ${product.name} is updated!` 
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
                detail:'Product is not updated'
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
                this.currentProductId = params['id'];
                //calling getProduct service, getting product from backend
                this.productsServices.getProduct(params['id']).subscribe( product =>{
                    //setting category data on input blank of name and icon using categoryForm ( and category.name is getting data from backend using id)
                    // this.categoryForm['name'].setValue(category.name);
                    this.productForm['name'].setValue(product.name);
                    this.productForm['category'].setValue(product.category?.id);
                    this.productForm['brand'].setValue(product.brand);
                    this.productForm['price'].setValue(product.price);
                    this.productForm['countInStock'].setValue(product.countInStock);
                    this.productForm['isFeatured'].setValue(product.isFeatured);
                    this.productForm['description'].setValue(product.description);
                    this.productForm['richDescription'].setValue(product.richDescription);
                    //as image url is stored in imageDisplay, so using that
                    this.imageDisplay = product.image;
                    //unlike name or brand, image field is acting differently, when i'm trying to update any one isFeatured or brand
                    //image field is saying" image is required"  so in short while creating the product is should saying " image is required" not while updating the product
                    //removing validation rule for _updateProduct( checkEditMode ) only
                    this.productForm['image'].setValidators([]);
                    //updating 
                    this.productForm['image'].updateValueAndValidity();


                })
            }
        })
    }    


    //setting getters , setters for categoryForm( when i want to access controls of this form)
    get productForm(){
        return this.form.controls;
    }


}
