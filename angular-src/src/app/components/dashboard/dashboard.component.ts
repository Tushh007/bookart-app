import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Book } from 'src/app/models/book';
import { BookService } from 'src/app/services/book.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements AfterViewInit {
  books: any;
  clickedBook!: Book;
  displayedColumns: string[] = [
    'imageUrl',
    'name',
    'price',
    'rating',
    'authors',
    'genres',
  ];
  dataSource!: MatTableDataSource<Book>;

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  @ViewChild(MatSort)
  sort!: MatSort;

  constructor(private bookService: BookService, private router: Router) {
    this.bookService.getAllBooks().subscribe((res) => {
      this.books = res;
      this.dataSource = new MatTableDataSource(this.books);

      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  ngAfterViewInit() {
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  bookDetails(book: any) {
    this.clickedBook = book;
    this.router.navigate(['/book', this.clickedBook._id]);
  }
}
