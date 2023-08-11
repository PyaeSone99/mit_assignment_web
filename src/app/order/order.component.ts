import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrderServiceService } from '../services/order-service.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AlertDialogComponent } from '../utils/alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit{
  Orders:any
  currentPage = 0;
  pageSize = 3;
  totalPages:Array<number> = [];
  totalElement:number = 0;
  searchTerm: any='';

  ngOnInit(): void {
    this.getAllOrders();
  }

  constructor(private _router:Router,private _services:OrderServiceService,
              private _dialog:MatDialog){}

  getAllOrders(){
    this._services.findAllOrders(this.searchTerm,this.currentPage,this.pageSize).subscribe(
      result =>{
        this.Orders = result.content;
        this.totalPages = new Array(result['totalPages']);
        this.totalElement = result['totalElements'];
      }
    )
  }

  addOrder(){
    this._router.navigate(['order/addOrder']);
  }

  goBack(){
    // this._router.navigateByUrl('product')
    console.log();
    
  }

  goDetail(id:number){
    this._router.navigate(['/order/detail',id])
  }

  goUpdate(id:number){
    this._router.navigate(['/order/updateOrder',id])
    
  }

  goDelete(id:number){
    if(confirm("Are you sure you want to delete this Order")){
      this._services.deleteOrder(id).subscribe(
        result => {
          this._router.navigate(['order'])
          const dialogConfig = new MatDialogConfig();
              dialogConfig.data = {
                title: 'Deleting Order',
                message: 'Order Deleted Successfully',
              };
              dialogConfig.width = '400px';
              this._dialog.open(AlertDialogComponent,dialogConfig)
          this.getAllOrders();
        }
      )
    }
  }

  // Pagination Start
  goPrevious(){
    this.currentPage --;
    this.getAllOrders();
  }

  goNext(){
    this.currentPage ++;
    this.getAllOrders();
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages.length) {
      this.currentPage = page;
      this.getAllOrders();
    }
  }

  isLastPage(): boolean {
    return this.currentPage === (this.totalElement/this.pageSize);
  }
// Pagination End
}
