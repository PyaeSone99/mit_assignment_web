import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductServicesService } from 'src/app/services/product-services.service';


@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit{

  id:any
  product:any
  ngOnInit(): void {
    this.id = this._route.snapshot.paramMap.get('id');
    this._service.findById(this.id).subscribe(
      result => {
        this.product = result
      }
    )
  }

  constructor(private _route:ActivatedRoute,private _service:ProductServicesService,
              private _router:Router){}

  goBack(){
    this._router.navigateByUrl('product')
  }
  
}
