import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ProductServicesService } from 'src/app/services/product-services.service';
import { AlertDialogComponent } from 'src/app/utils/alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent {
  
  productForm:FormGroup

  constructor(private _router:Router,private _builder:FormBuilder,private _service:ProductServicesService,
    private _dialog:MatDialog){
    this.productForm = _builder.group({
      code : ['',[Validators.required,Validators.minLength(2)]],
      name : ['',[Validators.required,Validators.minLength(5)]],
      price : ['',Validators.required],
      image : [null,Validators.required],
      quantity : ['',Validators.required],
      description : ['',[Validators.required,Validators.minLength(3)]]
    })
  }

  onFileSelected(event:any){
    this.productForm.patchValue({image : event.target.files[0]});
  }


  onSubmit(){
    if(confirm("Are you Sure To Add Product")){
      if(this.productForm.valid){
        const formData = new FormData();
        formData.append('code',this.productForm.get('code')?.value)
        formData.append('name',this.productForm.get('name')?.value)
        formData.append('price',this.productForm.get('price')?.value)
        formData.append('image',this.productForm.get('image')?.value)
        formData.append('quantity',this.productForm.get('quantity')?.value)
        formData.append('description',this.productForm.get('description')?.value)
        this._service.createProduct(formData).subscribe(result => {
          this._router.navigate(["product"])
          const dialogConfig = new MatDialogConfig();
          dialogConfig.data = {
            title: 'Adding Product',
            message: 'Product Added Successfully',
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
