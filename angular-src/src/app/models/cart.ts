import { Book } from "./book";

export interface Cart {
    book: Book;
    quantity: number;
    totalAmount: number;
}
