import { Category } from "./category";

export class Product {
    //? means its optional / not mandatory in case if its missing it will not throw the error

    id? : string;
    name? : string;
    description? : string;
    richDescription? : string;
    image?: string;
    images?: string[];
    brand?: string;
    price?: number;
    category?: Category;
    countInStock?: number;
    rating?: number;
    numReviews?: number;
    isFeatured?: boolean;
    dateCreated?: string;
}