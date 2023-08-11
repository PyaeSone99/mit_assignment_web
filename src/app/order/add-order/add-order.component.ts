import { Component, OnInit} from '@angular/core';
import { FormArray,FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { OrderServiceService } from 'src/app/services/order-service.service';
import { ProductServicesService } from 'src/app/services/product-services.service';
import { SelectedProductService } from 'src/app/services/selected-product.service';
import { AlertDialogComponent } from 'src/app/utils/alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-add-order',
  templateUrl: './add-order.component.html',
  styleUrls: ['./add-order.component.css']
})
export class AddOrderComponent implements OnInit{
  products:any
  currentPage:number = 0
  size:number = 3
  totalPages:Array<number> = [];
  totalElement:number = 0;

  submittedProducts:any[]= []

  orderForm:FormGroup
  

  ngOnInit(): void {
    this.getAllProduct();
  }

  constructor(private _router:Router,private _productServices:ProductServicesService,
              private _selectedProductService:SelectedProductService,private _formBuilder:FormBuilder,
              private _services:OrderServiceService,private _dialog:MatDialog){
      this.orderForm = _formBuilder.group({
        customerName : ['',[Validators.required,Validators.minLength(5)]],
        customerPhoneNumber : ['',[Validators.required,Validators.minLength(8)]],
        address : ['',Validators.required],
        orderItems : _formBuilder.array([],Validators.minLength(1)),
      })

  }

  get orderItems(){
    return this.orderForm.get('orderItems') as FormArray;
  }

  addOrderItems(){
     for(let product of this.submittedProducts){
      const orderItem = this._formBuilder.group({
        productId : product.id,
        quantity : [1,Validators.maxLength(product.quantity)]
      });
      this.orderItems.push(orderItem);
     }
  }

  onSubmit(){
    if(confirm("Are You sure to Order Products")){
      if(this.orderForm.valid){
        this._services.createOrder(this.orderForm.value).subscribe(
          result => {
            this._router.navigate(['order'])
            const dialogConfig = new MatDialogConfig();
            dialogConfig.data = {
              title: 'Adding Order',
              message: 'Order Added Successfully',
            };
            dialogConfig.width = '400px';
            this._dialog.open(AlertDialogComponent,dialogConfig)
          }
        )
      }else{
        console.log(this.orderForm.value,"error");
  
      }
    }
  }

  getAllProduct(){
    this._productServices.findAllProduct('',this.currentPage,this.size).subscribe(
      productsData=>{
        this.products = productsData.content[0]
        this.totalPages = new Array(productsData['totalPages']);
        for(let product of this.products){
            product.selected = false;
        }

      }
    )
  }

  // Delete selected from list
  deleteSelected(product:any){
    this._selectedProductService.deleteCheckedProduct(product)
    this.submittedProducts = this._selectedProductService.checkedProducts;
    this.orderItems.clear();
    this.addOrderItems()
    
  }

  // For adding checked products

  // This is for product list start
  check(product:any,ev:any){
    this._selectedProductService.addCheckedProduct(product,ev.target.checked);
    
  }

  checkState(product:any){
    return this._selectedProductService.isChecked(product);
  }

  modelBoxCancel(){
    this._selectedProductService.clearSelectedProducts();
  }

  // This is for product list end
// After submit products start
  submitSelectedProduct(){
    this.submittedProducts = this._selectedProductService.checkedProducts;
    this.orderItems.clear();
    this.addOrderItems()
  }

  // After submit products end

  // going back to order list page
  protected goBack(){
    this._router.navigateByUrl("order")
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



  isLastPage(): boolean {
    return this.currentPage === (this.totalElement/this.size);
  }
// Pagination End

// Price Calculation Start
calculateTotalPrice(product: any, quantity: number): number {
  return product.price * quantity;
}

calculateProductTotal(product: any, index: number) {
  const quantityControl = this.orderItems.at(index)?.get('quantity');
  const quantity = quantityControl?.value || 0; 
  return this.calculateTotalPrice(product, quantity);
}

calculateOverallTotal(): number {
  let overallTotal = 0;
  for (let i = 0; i < this.submittedProducts.length; i++) {
    const product = this.submittedProducts[i];
    const quantityControl = this.orderItems.at(i)?.get('quantity');
    const quantity = quantityControl?.value || 0;
    overallTotal += this.calculateTotalPrice(product, quantity);
  }
  return overallTotal;
}
// Price Calculation End
}
