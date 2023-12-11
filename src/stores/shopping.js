import { defineStore } from 'pinia';
export let useShoppingStore= defineStore('shopping', {
    state: ()=> {return {shoppingList:{}, R:Math.pow(10,9)}},
    getters: {
        totalAmount:(state)=> {
            let total_amount= {};
            let shoppingRecord= state.shoppingList;
            if(Object.keys(shoppingRecord).length>0) {
                for(let shop in shoppingRecord) {
                    let currentProductList= shoppingRecord[shop].list
                    total_amount[shop]= 0;
                    for(let p in currentProductList) {
                        if(currentProductList[p].count&& currentProductList[p].actuallyChosen) {
                            total_amount[shop] += currentProductList[p].count;
                        }
                    } 
                } 
            }
            return total_amount;
        },
        totalPrice:(state)=> {
            let total_price= {};
            let shoppingRecord= state.shoppingList;
            if(Object.keys(shoppingRecord).length>0) {
                for(let shop in shoppingRecord) {
                    let currentProductList= shoppingRecord[shop].list
                    total_price[shop]= 0;
                    for(let p in currentProductList) {
                        if(currentProductList[p].count&& currentProductList[p].actuallyChosen) {
                            total_price[shop]= (total_price[shop]*state.R + (currentProductList[p].count*state.R)* (Number(currentProductList[p].price)*state.R)/state.R)/state.R;
                        }
                        
                    } 
                }

            }
            return total_price;
        }
    }
})