import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderServiceService } from 'src/app/services/order-service.service';
import { ProductServicesService } from 'src/app/services/product-services.service';
import { SelectedProductService } from 'src/app/services/selected-product.service';
import { AlertDialogComponent } from 'src/app/utils/alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-update-order',
  templateUrl: './update-order.component.html',
  styleUrls: ['./update-order.component.css'],
})
export class UpdateOrderComponent implements OnInit {
  products: any;
  id: any;
  order: any;
  currentPage: number = 0;
  size: number = 3;

  totalPages: Array<number> = [];
  totalElement: number = 0;

  submittedProducts: any[] = [];

  orderForm: FormGroup;

  ngOnInit(): void {
    this.id = this._route.snapshot.paramMap.get('id');
    this.getOrderData();
    this.getAllProduct();
  }

  constructor(
    private _router: Router,
    private _formBuilder: FormBuilder,
    private _route: ActivatedRoute,
    private _services: OrderServiceService,
    private _productServices: ProductServicesService,
    private _dialog: MatDialog,
    private _selectedProductService: SelectedProductService
  ) {
    this.orderForm = _formBuilder.group({
      customerName: ['', [Validators.required, Validators.minLength(5)]],
      customerPhoneNumber: ['', [Validators.required, Validators.minLength(8)]],
      address: ['', Validators.required],
      orderItems: _formBuilder.array([], Validators.minLength(1)),
    });
  }

  get orderItems() {
    return this.orderForm.get('orderItems') as FormArray;
  }

  addOrderItems() {
    for (let product of this._itemArray) {
      const orderItem = this._formBuilder.group({
        productId: product.id,
        quantity: [
          product.ordQ,
          Validators.maxLength(product.quantity),
        ],
      });
      this.orderItems.push(orderItem);
    }
  }

  orderQuantityChange(ev: any, i: number) {
    const parsedValue = ev.target.value !== null ? +ev.target.value : 0; // Parse the input value or default to 0
    this.orderItems.at(i).get('quantity')?.setValue(parsedValue);
  }

  getOrderData() {
    this._services.findByOrderId(this.id).subscribe((result) => {
      this.order = result;   
      this.orderForm.patchValue({
        customerName: this.order.customerName,
        customerPhoneNumber: this.order.customerPhone,
        address: this.order.address,
      });

      for (let orderItem of this.order.orderItems) {
        this.products.forEach( (p:any) => {
          if( p.name == orderItem.productName){
            p.ordQ = orderItem.quantity
            this._itemArray.push(p)
          }
        });
      }
    });
  }
  getAllProduct() {
    this._productServices.findAllProduct2().subscribe((productsData) => {
      this.products = productsData;
    });
  }

  onSubmit() {
    this.addOrderItems();
    if (confirm('Are You sure to update Order')) {
      if (this.orderForm.valid) {
        this._services
          .updataOrder(this.orderForm.value, this.id)
          .subscribe((result) => {
            this._router.navigate(['order']);
            const dialogConfig = new MatDialogConfig();
            dialogConfig.data = {
              title: 'Updating Order',
              message: 'Order Updated Successfully',
            };
            dialogConfig.width = '400px';
            this._dialog.open(AlertDialogComponent, dialogConfig);
          });
      } else {
        console.log(this.orderForm.value, 'error');
      }
    }
    // console.log(this.orderForm.value);
    
  }

  // Delete selected from list
  deleteSelected(product: any) {
    this._selectedProductService.deleteCheckedProduct(product);
    console.log(product);

    this.submittedProducts = this._selectedProductService.checkedProducts;

    this.orderItems.clear();
    this.addOrderItems();
  }

  // going back to order list page
  protected goBack() {
    this._router.navigateByUrl('order');
  }

  // order item add

  data: {} = {
    id: '',
    code: '',
    name: '',
    price: '',
    quantity: '',
    ordQ: '',
  };

  _itemArray: any = [];

  ngSelectOrder() {
    this.data = {
      id: '',
      code: '',
      name: '',
      price: '',
      quantity: '',
      ordQ: '',
    };
    this._itemArray.push(this.data);
  }
  qq: any;
  productSelected(e: any, i: any) {
    this._itemArray[i].id = e.id;
    this._itemArray[i].code = e.code;
    this._itemArray[i].name = e.name;
    this._itemArray[i].price = e.price;
    this._itemArray[i].quantity = e.quantity;
  }

  goRemove(i: number) {
    this._itemArray.splice(i, 1);
  }
  // Calculate total
  totalPrice: number = 0;
  test(p: number, q: number) {
    this.totalPrice += p * q;
  }

  // Delete order items 
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
              this.goBack();
        }
      )
    }
  }
}
