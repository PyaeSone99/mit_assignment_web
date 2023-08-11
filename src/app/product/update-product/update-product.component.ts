import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductServicesService } from 'src/app/services/product-services.service';
import { AlertDialogComponent } from 'src/app/utils/alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-update-product',
  templateUrl: './update-product.component.html',
  styleUrls: ['./update-product.component.css']
})
export class UpdateProductComponent implements OnInit{

  id:any
  product:any
  productForm:FormGroup

  ngOnInit(): void {
    this.id = this._route.snapshot.paramMap.get('id');
    this.getProductData();
  }

  constructor(private _router:Router,private _builder:FormBuilder,private _service:ProductServicesService,
              private _route:ActivatedRoute,private _dialog:MatDialog){
    this.productForm = _builder.group({
      code : ['',[Validators.required,Validators.minLength(2)]],
      name : ['',[Validators.required,Validators.minLength(5)]],
      price : ['',Validators.required],
      image : [null],
      quantity : ['',Validators.required],
      description : ['',[Validators.required,Validators.minLength(3)]]
    })
  }

  getProductData(){
    this._service.findById(this.id).subscribe(
      result => {
        this.product = result
        this.productForm.patchValue({
          code : this.product.code,
          name : this.product.name,
          price : this.product.price,
          quantity : this.product.quantity,
          description : this.product.description
        })
      }
    )
  }

  onFileSelected(event:any){
    this.productForm.patchValue({image : event.target.files[0]});
  }

  onSubmit(){
    if(confirm("Are you sure To Update")){
      if(this.productForm.valid){
        const formData = new FormData();
        formData.append('code',this.productForm.get('code')?.value)
        formData.append('name',this.productForm.get('name')?.value)
        formData.append('price',this.productForm.get('price')?.value)
        formData.append('image',this.productForm.get('image')?.value)
        formData.append('quantity',this.productForm.get('quantity')?.value)
        formData.append('description',this.productForm.get('description')?.value)
        this._service.updateProduct(formData,this.id).subscribe(result => {
          this._router.navigate(["product"])
          const dialogConfig = new MatDialogConfig();
          dialogConfig.data = {
            title: 'Updating Product',
            message: 'Product Updated Successfully.',
          };
          dialogConfig.width = '400px';
          this._dialog.open(AlertDialogComponent,dialogConfig)
        })
        
      }
    }
  }

  goBack(){
    this._router.navigateByUrl('product')
  }

}
