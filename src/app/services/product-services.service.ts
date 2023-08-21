import { Injectable } from '@angular/core';
import { environment } from './environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';


const Product_Domain = `${environment.baseUrl}/product`

@Injectable({
  providedIn: 'root'
})
export class ProductServicesService {

  constructor(private _http:HttpClient) { }

  createProduct(formData : FormData):Observable<String>{
    return this._http.post<String>(`${Product_Domain}/create`,formData);
  }

  findAllProduct(searchkey:any,currentPage:number,pageSize:number):Observable<any>{
    const params = new HttpParams()
    .set('search',searchkey)
    .set('page',currentPage)
    .set('limit',pageSize)
    return this._http.get<any>(`${Product_Domain}/findWithPager`,{params});
  }

  findAllProduct2():Observable<any>{
    return this._http.get<any>(`${Product_Domain}/findAll`);
  }

  findById(id:number):Observable<number>{
    return this._http.get<number>(`${Product_Domain}/details/${id}`);
  }

  updateProduct(formData : FormData,id :number):Observable<any>{
    return this._http.put<any>(`${Product_Domain}/update/${id}`,formData)
  }

  deleteProduct(id:number):Observable<number>{
    return this._http.delete<number>(`${Product_Domain}/deleteProduct/${id}`)
  }

  findByProductName(name:any):Observable<any>{
    return this._http.get<any>(`${Product_Domain}/withProductName/${name}`);
  }
}
