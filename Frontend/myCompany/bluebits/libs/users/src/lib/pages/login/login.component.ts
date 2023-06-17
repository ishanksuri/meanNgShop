import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { LocalstorageService } from '../../services/localstorage.service';
import { Router } from '@angular/router';

@Component({
    selector: 'users-login',
    templateUrl: './login.component.html',
    styles: []
})
export class LoginComponent implements OnInit {
    loginFormGroup: FormGroup;
    isSubmitted = false;
    authError = false;
    //based on the status of error we can define different error messages
    //for eg: status 500 is server error
    //status 400 is user error,ie pass or email is wrong
    authMessage = 'Email or Password are wrong';

    constructor( 
        private formBuilder: FormBuilder,
        private auth: AuthService,
        private localstorageService: LocalstorageService,
        private router: Router
        ){}

    ngOnInit(): void {
        this._initLoginForm();
    }

    //for validations
    private _initLoginForm(){
        this.loginFormGroup = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required ]
        });
    }

    onSubmit(){
        this.isSubmitted = true;

        if(this.loginFormGroup.invalid) return;

        // const loginData = {
        //     email: this.loginForm['email'].value,
        //     password: this.loginForm['password'].value
        // }
        // this.auth.login(loginData.email, loginData.password);

        //since it will return observable, so we need to subscribe
        this.auth.login(this.loginForm['email'].value, this.loginForm['password'].value).subscribe(
            (user)=>{
            // console.log(user);
            //if after enetering wrong password, user re-enters right paswword then the 'Email or Password are wrong' mesage should be gone from UI
            this.authError = false;
            //after succesful login, we're using localstorageService to store user's token
            // Also, we have defined expiration time for this token in the backend
            this.localstorageService.setToken(user.token);
            //we need to gaurd the admin panel from users who are not authorised or authenticated to login
            //this is redirect to homepage
            this.router.navigate(['/']);

        },
        (error: HttpErrorResponse ) => {
            // console.log(error);
            this.authError = true;

            //ie. status 500 or something related to server
            if( error.status !== 400){
                this.authMessage = "Error in the Server, please try again later!"
            }
            //else authMessage = 'Email or Password are wrong'; which is by default
        }
        );

    }

    get loginForm(){
        return this.loginFormGroup.controls;
    }
}
