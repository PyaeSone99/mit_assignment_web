import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderComponent } from './order/order.component';

const routes: Routes = [
  { path: 'product',loadChildren: ()=> import('./product/product.module').then(m=>m.ProductModule) },
  { path: "order",loadChildren: ()=> import('./order/order.module').then(m => m.OrderModule)},
  {path : '',redirectTo:'/product',pathMatch:"full"},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
