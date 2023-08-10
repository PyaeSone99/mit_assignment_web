import { RouterModule, Routes } from "@angular/router";
import { OrderComponent } from "./order.component";
import { NgModule } from "@angular/core";
import { AddOrderComponent } from "./add-order/add-order.component";
import { OrderDetailsComponent } from "./order-details/order-details.component";
import { UpdateOrderComponent } from "./update-order/update-order.component";

const routes:Routes=[
    {path : '',component: OrderComponent},
    {path : 'addOrder',component : AddOrderComponent},
    {path : 'detail/:id',component : OrderDetailsComponent},
    {path : 'updateOrder/:id',component : UpdateOrderComponent}
]

@NgModule({
    imports : [RouterModule.forChild(routes)],
    exports : [RouterModule]
})

export class OrderRoutingModule{}