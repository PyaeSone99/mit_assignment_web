import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductComponent } from './product.component';
import { AddProductComponent } from './add-product/add-product.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { UpdateProductComponent } from './update-product/update-product.component';

const routes: Routes = [
  {path : '',component : ProductComponent },
  {path : 'addProduct',component : AddProductComponent},
  {path : 'detail/:id',component : ProductDetailsComponent},
  {path : 'updateProduct/:id',component : UpdateProductComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductRoutingModule { }
