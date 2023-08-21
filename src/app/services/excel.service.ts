import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from './environment';

const Product_Domain = `${environment.baseUrl}/order`

@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  private _excelExportUrl = `${Product_Domain}/export`

  private _excelImportUrl = `${Product_Domain}/import`

  constructor(private _http:HttpClient) { }

  exportToExcel(): Observable<HttpResponse<Blob>> {
    const headers = new HttpHeaders({ 'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        return this._http.get(this._excelExportUrl, {
            headers: headers,
            responseType: 'blob',
            observe: 'response'
        });
  }

  uploadExcelFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this._http.post(this._excelImportUrl, formData);
  }
}
