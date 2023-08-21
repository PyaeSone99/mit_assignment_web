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
     for(let product of this._itemArray){
      const orderItem = this._formBuilder.group({
        productId : product.id,
        quantity :  product.ordQ
      });
      this.orderItems.push(orderItem);
     }
  }

  onSubmit(){
    this.addOrderItems();
    
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
    this._productServices.findAllProduct2().subscribe(
      productsData=>{
        this.products = productsData
        this.totalPages = new Array(productsData['totalPages']);
        for(let product of this.products){
            product.selected = false;
        }

      }
    )
  }


  // going back to order list page
  protected goBack(){
    this._router.navigateByUrl("order")
  }

// order item add

data:{} = {
  id : '',
  code : '',
  name : '',
  price : '',
  quantity : '',
  ordQ : ''
}

_itemArray:any = []

  ngSelectOrder(){
    this.data = {
      id : '',
      code : '',
      name : '',
      price : '',
      quantity : '',
      ordQ : ''
    }
    this._itemArray.push(this.data)
  }
  qq:any
  productSelected(e:any,i:any){
    this._itemArray[i].id = e.id;
    this._itemArray[i].code = e.code;
    this._itemArray[i].name = e.name;
    this._itemArray[i].price = e.price;
    this._itemArray[i].quantity = e.quantity;
  }

  goRemove(i:number){
    this._itemArray.splice(i,1)
  }
  // Calculate total
  totalPrice : number = 0;
  test(p:number,q:number){
    this.totalPrice += (p*q)
  }
}
