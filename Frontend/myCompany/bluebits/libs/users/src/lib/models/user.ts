export class User {
    //? means its optional / not mandatory in case if its missing it will not throw the error

    id? : string;
    name? : string;
    email? : string;
    password? : string;
    phone? : string;
    token? : string;
    isAdmin? : string;
    street? : string;
    apartment? : string;
    zip? : string;
    city? : string;
    country? : string;
}