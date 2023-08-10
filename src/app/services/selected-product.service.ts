import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SelectedProductService {
  selectedProducts:any[] = [];

  submittedProducts:any[] = []
  constructor(){}

  selectProduct(product:any,isChecked:boolean){
    if(isChecked){
      product.selected = isChecked;
      this.selectedProducts.push(product);

    }else{
      const index = this.selectedProducts.indexOf(product);
      let test = this.selectedProducts.find(p => p.code == product.code);
      if(test){
        test.selected = false
      }
      if (index !== -1) {
        product.selected = false;
        this.selectedProducts.splice(index, 1);
      }
    }
  }

  isChecked(id:number){
    let test = this.selectedProducts.find(p => p.code == id);
    if(test){
      return test.selected
    }
  }

  clearSelectedProducts(){
    this.selectedProducts.splice(0,this.selectedProducts.length);
  }

  submit(product:any){
    if(!this.submittedProducts.every(p => this.selectedProducts.includes(p))){
      console.log("here");
      let filterProduct:any
      for (let selp of product){
        filterProduct = this.selectedProducts.filter(p => p.id == selp.id)
      }
      this.submittedProducts.push(...filterProduct)
    }else{
      this.submittedProducts.push(...product);
    }
    
  }

  deleteSubmittedProduct(){
    this.submittedProducts.splice(0,this.submittedProducts.length)
  }
}
