import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SelectedProductService {
  checkedProducts:any[] = [];

  constructor(){}
// This is for product check box Start
  addCheckedProduct(product:any,isChecked:boolean){
    if(isChecked){
      product.selected = isChecked;
      this.checkedProducts.push(product);   
    }else{
      let oldCheckedProductData = this.checkedProducts.find(p => p.code == product.code)
      let index = this.checkedProducts.indexOf(product);
      if(oldCheckedProductData > -1){
        oldCheckedProductData.selected = false
        this.checkedProducts.splice(index,1)
      }
      
    }
  }

  isChecked(id:number){
    let selectedData = this.checkedProducts.find(p => p.code == id);
    if(selectedData){
      return selectedData.selected
    }
  }

  clearSelectedProducts(){
    this.checkedProducts.length = 0
  }

  deleteCheckedProduct(product:any){
    let oldCheckedProductData = this.checkedProducts.find(p => p.code == product.code)
    let deleteProductIndex = this.checkedProducts.indexOf(product);
    if(deleteProductIndex > -1){
      oldCheckedProductData.selected = false
      this.checkedProducts.splice(deleteProductIndex,1)
    }
  }
  
  
  // This is for product check box End

}
