import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderServiceService } from 'src/app/services/order-service.service';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css']
})
export class OrderDetailsComponent implements OnInit{

  id:any
  orders:any

  ngOnInit(): void {
    this.id = this._route.snapshot.paramMap.get('id');
    this._service.findByOrderId(this.id).subscribe(
      result=>{
        this.orders = result
      }
    )    
  } 

  constructor(private _route:ActivatedRoute,private _service:OrderServiceService,
              private _router:Router){}

  goBack(){
    this._router.navigate(['order'])
  }
}
