import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  httpOptions = this.authService.setHeaders();
  
  constructor(private http: HttpClient, private authService: AuthService) { }

  getAllBooks() {
    return this.http.get('http://localhost:8080/books/retrive/all', this.httpOptions);
  }

  getBookById(id: string) {
    return this.http.get(`http://localhost:8080/books/retrive/${id}`, this.httpOptions);
  }
}
