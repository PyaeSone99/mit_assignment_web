import { ProductsData } from './../utils/product';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductServicesService } from '../services/product-services.service';

import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AlertDialogComponent } from '../utils/alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit{

  products : ProductsData[] =[];
  currentPage = 0;
  pageSize = 3;
  totalPages:Array<number> = [];
  totalElement:number = 0;
  imageUrl:any = "http://localhost:8080/Product/assignment/product/image/"
  searchTerm: any='';
  

  ngOnInit(): void {
    this.getAllProduct();
  }

  constructor(private _router:Router,private _services:ProductServicesService,
              private _dialog:MatDialog){}

  getAllProduct(){
    this._services.findAllProduct(this.searchTerm,this.currentPage,this.pageSize).subscribe(
      productsData => {
        this.products = productsData.items;
        this.totalPages = new Array(productsData['totalPages']);
        this.totalElement = productsData['totalCount'];

      }
    )
  }



  addProduct(){
    this._router.navigateByUrl('/product/addProduct')
  }

  goBack(){
    this._router.navigateByUrl('product')
  }

  goDetail(id:number){
    this._router.navigate(['/product/detail',id])
  }

  goUpdate(id:number){
    this._router.navigate(['/product/updateProduct',id])
  }

  goDelete(id:number){
    if(confirm("Are you sure to delete ")) {
      this._services.deleteProduct(id).subscribe(
        result => {
          this._router.navigateByUrl('product')
          const dialogConfig = new MatDialogConfig();
          dialogConfig.data = {
            title: 'Deleting Product',
            message: 'Product Deleted Successfully.',
          };
          dialogConfig.width = '400px';
          this._dialog.open(AlertDialogComponent,dialogConfig)
          this.getAllProduct();
        }
      )
    }
  }

// Pagination Start
  goPrevious(){
    this.currentPage --;
    this.getAllProduct();
  }

  goNext(){
    this.currentPage ++;
    this.getAllProduct();
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages.length) {
      this.currentPage = page;
      this.getAllProduct();
    }
  }

  isLastPage(): boolean {
    return this.currentPage === (this.totalElement/this.pageSize);
  }
// Pagination End



}
