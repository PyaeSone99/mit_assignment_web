import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderServiceService } from 'src/app/services/order-service.service';
import { ProductServicesService } from 'src/app/services/product-services.service';
import { SelectedProductService } from 'src/app/services/selected-product.service';

@Component({
  selector: 'app-update-order',
  templateUrl: './update-order.component.html',
  styleUrls: ['./update-order.component.css']
})
export class UpdateOrderComponent implements OnInit{
    products:any
    id:any
    order:any
    orderForm:FormGroup
    currentPage:number = 0
    size:number = 3
    selectedProducts:any[]= []
    totalElement:number = 0;

    ngOnInit(): void {
      this.id = this._route.snapshot.paramMap.get("id");
      this.getOrderData();
    }

    constructor(private _router:Router,private _formBuilder:FormBuilder,
                private _route:ActivatedRoute,private _services:OrderServiceService,
                private _productServices:ProductServicesService,
              private _selectedProductService:SelectedProductService){
        this.orderForm = _formBuilder.group({
        customerName : ['',Validators.required],
        customerPhoneNumber : ['',Validators.required],
        address : ['',Validators.required],
        orderItems : _formBuilder.array([]),
        totalPrice : ['20',Validators.required]
        })
    }

    get orderItems(){
      return this.orderForm.get('orderItems') as FormArray;
    }
  
    addOrderItems(){
      for(let orderData of this.order.orderItems){
        const orderItem = this._formBuilder.group({
          productId : orderData.id,
          quantity : orderData.quantity
        });
        this.orderItems.push(orderItem);
      }
    }

    getOrderData(){
      this._services.findByOrderId(this.id).subscribe(
        result=>{
          this.order = result
          this.orderForm.patchValue({
            customerName : this.order.customerName,
            customerPhoneNumber : this.order.customerPhone,
            address : this.order.address
          })
        }
      )
    }

    getAllProduct(){
      this._productServices.findAllProduct('',this.currentPage,this.size).subscribe(
        productsData=>{
          this.products = productsData.content[0]
          for(let product of this.products){
              product.selected = false;
          }
  
        }
      )
    }

    onSubmit(){
      // this.addOrderItems();
       if(confirm("Are You sure to update Order")){
        if(this.orderForm.valid){
          this._services.createOrder(this.orderForm.value).subscribe(
            result => {
              this._router.navigate(['order'])
            }
          )
        }else{
          console.log(this.orderForm.value,"error");
    
        }
       }
     }
  
    // Delete selected from list
    deleteSelected(id:number){
      let filterProducts = this.selectedProducts.filter(p => p.id !== id)
      this._selectedProductService.deleteSubmittedProduct();
      this.modelBoxCancel();
      this._selectedProductService.submit(filterProducts);
      this.selectedProducts = this._selectedProductService.submittedProducts;
      this.addOrderItems();
    }
  
    // For adding checked products
    change(product:any,ev:any){
      this._selectedProductService.selectProduct(product,ev.target.checked);
    }
  
    state(id:number){
      return this._selectedProductService.isChecked(id);
    }
  
    modelBoxCancel(){
      this._selectedProductService.clearSelectedProducts();
    }
  
    submitSelectedProduct(){
      this._selectedProductService.submit(this._selectedProductService.selectedProducts);
      this.selectedProducts = this._selectedProductService.submittedProducts;
       this.addOrderItems();
    }
  
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
}
