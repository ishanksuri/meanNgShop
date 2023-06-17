import { NgModule } from '@angular/core';
import { ShellComponent } from './shared/shell/shell.component';
import { AuthGuard } from '@bluebits/users';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { CategoriesListComponent } from './pages/categories/categories-list/categories-list.component';
import { CategoriesFormComponent } from './pages/categories/categories-form/categories-form.component';
import { ProductsListComponent } from './pages/products/products-list/products-list.component';
import { ProductsFormComponent } from './pages/products/products-form/products-form.component';
import { UsersListComponent } from './pages/users/users-list/users-list.component';
import { UsersFormComponent } from './pages/users/users-form/users-form.component';
import { OrdersListComponent } from './pages/orders/orders-list/orders-list.component';
import { OrdersDetailComponent } from './pages/orders/orders-detail/orders-detail.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {   
        //we are protecting this route and its children using AuthGuard based on it will return true or false in auth-guard.service.ts
        path: '',
        component: ShellComponent,
        //guard is actually a service which is observing always the router and see if its allowed or not to enter this route
        canActivate: [AuthGuard],
        children: [
            {
                // path: 'dashboard',
                path: '',
                component: DashboardComponent
            },
            {
                path: 'categories',
                component: CategoriesListComponent
            },
            //add category
            {
                path: 'categories/form',
                component: CategoriesFormComponent
            },
            //update Category
            {
                path: 'categories/form/:id',
                component: CategoriesFormComponent
            },

            //start products
            //get products
            {
                path: 'products',
                component: ProductsListComponent
            },
            //add products
            {
                path: 'products/form',
                component: ProductsFormComponent
            },
            //update products
            {
                path: 'products/form/:id',
                component: ProductsFormComponent
            },

            //users starts
            {
                path: 'users',
                component: UsersListComponent
            },
            //add
            {
                path: 'users/form',
                component: UsersFormComponent
            },
            //update user
            {
                path: 'users/form/:id',
                component: UsersFormComponent
            },

            //orders start
            {
                path: 'orders',
                component: OrdersListComponent
            },
            //as we don't have form, only detail instead
            {
                path: 'orders/:id',
                component: OrdersDetailComponent
            }
        ]
    }
    //its very imp to be at end, this is for when any user try something like this link
    // http://localhost:4200/ajdndsklds
    //we have to redirect user to homepage ie ''
    //The double asterisks (**) is a wildcard that matches any URL. Therefore, this route will act as a catch-all or fallback route, meaning it will be used when no other routes match the requested URL.
    //pathMatch: 'full' means that the entire URL must match the specified path for this route to be activated. It ensures that only when the full URL matches ** (wildcard), the redirection will take place.
    // {
    //     path: '**',
    //     redirectTo: '',
    //     pathMatch: 'full'

    // }
];


@NgModule({
    imports: [
        // theory? 
        RouterModule.forRoot(routes, { initialNavigation: 'enabledBlocking' })
    ],
    exports: [RouterModule],
    declarations: [],
    providers: [],
})
export class AppRoutingModule { }
