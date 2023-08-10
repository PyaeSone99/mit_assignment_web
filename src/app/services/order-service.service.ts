import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from './environment';
import { Observable } from 'rxjs';

const Product_Domain = `${environment.baseUrl}/order`

@Injectable({
  providedIn: 'root'
})
export class OrderServiceService {
  constructor(private _http:HttpClient) { }

  createOrder(data:any):Observable<any>{
    return this._http.post<any>(`${Product_Domain}/create`,data);
  }

  findAllOrders(searchKey:any,currentPage:any,pageSize:any):Observable<any>{
    const params = new HttpParams()
    .set('searchKey',searchKey)
    .set('current',currentPage)
    .set('size',pageSize)
    return this._http.get<any>(Product_Domain,{params})
  }

  findByOrderId(id:number):Observable<number>{
    return this._http.get<number>(`${Product_Domain}/details/${id}`);
  }

  updataOrder(data:any,id:number):Observable<any>{
    return this._http.put<any>(`${Product_Domain}/updateOrder/${id}`,data);
  }

  deleteOrder(id:number):Observable<number>{
    return this._http.delete<number>(`${Product_Domain}/deleteOrder/${id}`);
  }

}
