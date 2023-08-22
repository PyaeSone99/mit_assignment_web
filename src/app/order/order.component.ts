import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrderServiceService } from '../services/order-service.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AlertDialogComponent } from '../utils/alert-dialog/alert-dialog.component';
import { ExcelService } from '../services/excel.service';

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
              private _dialog:MatDialog,private _excelService:ExcelService){}

  getAllOrders(){
    this._services.findAllOrders(this.searchTerm,this.currentPage,this.pageSize).subscribe(
      result =>{
        this.Orders = result.items;

        this.totalPages = new Array(result['totalPages']);
        this.totalElement = result['totalCount'];
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

// Excel export
  exportToExcel(): void {

      this._excelService.exportToExcel().subscribe(response => {
        const blob = new Blob([response.body as BlobPart], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const downloadLink = document.createElement('a');
            downloadLink.href = URL.createObjectURL(blob);
            downloadLink.download = 'orders.xlsx';
            
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
    });
    };

    selectedFile: File | undefined;
    // onFileSelected(event: any) {
    //   this.selectedFile = event.target.files[0];
    // }
  
    uploadFile() {
      this._router.navigate(['order'])
          const dialogConfig = new MatDialogConfig();
              dialogConfig.data = {
                title: 'Excel Importing',
                message: 'Excel Import Successfully',
              };
              dialogConfig.width = '400px';
              this._dialog.open(AlertDialogComponent,dialogConfig)
          this.getAllOrders();
      if (this.selectedFile) {
        this._excelService.uploadExcelFile(this.selectedFile).subscribe(
          response => {
            console.log('Upload successful', response);
          },
          error => {
            console.error('Upload failed', error);
          }
        );
      }
      
    }

    // Excel import button
    // selectedFile: File | undefined; 
 
  onFileSelected(event: any) { 
    const file: File = event.target.files[0]; 
    if (file) { 
      this.selectedFile = file; 
    } 
  } 
 
  exportFile() { 
    if (this.selectedFile) {
      console.log("success");
      
    }
  } 
  cancelSelection() { 
    this.selectedFile = undefined; 
  }
}


