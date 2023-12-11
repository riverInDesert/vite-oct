<script setup>
    import { ref, onMounted, computed } from 'vue';
    import router from '../router';
    import { useShoppingStore } from '../stores/shopping';
    import splicer from '../assets/utilities/urlSplicer';
    
    //pinia实例
    let store= useShoppingStore();

    //返回上页
    function goBack() {
        router.back();
    }

    //订单需要的信息
    onMounted(()=> {
        store.$state.shoppingList= JSON.parse(localStorage.shoppingRecord);
    })
    let shoppingRecord= JSON.parse(localStorage.shoppingRecord);
    //console.log(shoppingRecord);
    let currentShop= shoppingRecord[shoppingRecord.currentShopId].shopName;
    let currentList= shoppingRecord[shoppingRecord.currentShopId].list;
    let finalList= [];
    for(let key of Object.keys(currentList)) {
        if(currentList[key].actuallyChosen) {
            finalList.push(currentList[key]);
        }
    }
    //console.log(currentList);
    //每种商品的单价乘数量
    function itemPrice(singlePrice, amount) {
        let coefficient= store.$state.R;
        let item_price= ((singlePrice*coefficient)* (amount*coefficient))/coefficient/coefficient;
        return item_price;
    }
    //计算重量
    let weight= 0;
    finalList.forEach((v)=> {
        let singleWeight= Number(v.name.match(/\d+/)[0])*v.count;
        weight+= singleWeight/1000;
    })
    //小计功能
    //描述订单列表是否折叠
    let compressed= ref(true);
    if(finalList.length<= 2) {
        compressed.value= false;
    }
    //订单列表高度
    let height= computed(()=> {
        if(finalList.length>2&& compressed.value== true) {
            return `${2*3.875}rem`;
        } else {
            return `${finalList.length*3.875}rem`;
        }
    })
    //展开与折叠订单列表
    function compressClicker() {
        if(finalList.length>2) {
            compressed.value= !compressed.value;
        }
    }

    //描述toast是否弹出
    let isShow= ref(false);
    //去支付
    function toPay() {
        fetch(splicer('/api/order'), {
            method: "POST",
            headers: new Headers({"content-Type": "application/json"}),
            body: JSON.stringify({
                addressId: 1,
                shopId: shoppingRecord.currentShopId,
                shopName: currentShop,
                isCanceled: false,
                products: finalList
            })
        })
        .then(response=> response.json())
        .then(data=> {
            if(data.errno===0) {
                console.log(data.data);
                delete shoppingRecord[shoppingRecord.currentShopId];
                localStorage.shoppingRecord= JSON.stringify(shoppingRecord);
                store.$patch((state)=> {
                    delete state.shoppingList[shoppingRecord.currentShopId].list;
                })
                goBack();
            }
        })
        .catch(error=>console.log(error))
    }
</script>
<template>
    <div class="confirm-order">
        <div class="gradient"></div>
        <div class="main-part">
            <div class="title">
                <div class="return-btn" @click="goBack">
                    <div class="virtual-up"></div>
                    <div class="virtual-down"></div>
                </div>
                <p>确认订单</p>
                <div class="virtual-part"></div>
            </div>
            <div class="address">
                <div class="address-left">
                    <p>收货地址</p>
                    <p>北京理工大学国防科技园2号楼10层</p>
                    <p>瑶妹 （先生） 18911024266</p>
                </div>
                <div class="address-right">
                    <div class="virtual-up"></div>
                    <div class="virtual-down"></div>
                </div>
            </div>
            <div class="shopping-list">
                <p class="shop-name">{{currentShop}}</p>
                <ul :style="{height: height}">
                    <li v-for="item in finalList" :key="item._id">
                        <img :src="item.imgUrl">
                        <div class="item-information">
                            <p class="item-name">{{ item.name }}</p>
                            <div class="price-area">
                                <p class="single-price"><span>￥</span>{{ item.price }} x {{ item.count }}</p>
                                <p class="item-price"><span>￥</span>{{ itemPrice(item.price, item.count) }}</p>
                            </div>
                        </div>
                    </li>
                </ul>
                <div class="subtotal">
                    <p>共计<span>{{ store.totalAmount[shoppingRecord.currentShopId] }}</span>件/<span>{{ weight }}</span>kg</p>
                    <div @click="compressClicker" :class="{rotate: compressed}">
                        <div class="virtual-left"></div>
                        <div class="virtual-right"></div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="statistics">
            <div class="total-price">
                实付金额 <span>￥</span><span>{{ store.totalPrice[shoppingRecord.currentShopId] }}</span>
            </div>
            <button @touchstart="isShow= true">提交订单</button>
        </div>
        <div class="cover" v-if="isShow"></div>
        <div class="toast" v-if="isShow">
            <p>确认要离开收银台？</p>
            <p>请尽快完成支付，否则将被取消</p>
            <div class="decision">
                <button @touchstart="isShow= false">取消订单</button>
                <button @touchstart="toPay">确认支付</button>
            </div>
        </div>
    </div>
    
</template>
<style lang="scss" scoped>
    .confirm-order {
        width: 100vw;
        height: 100vh;
        background-color: #f5f5f5;
        .gradient {
            height: 9.938rem;
            background-image: linear-gradient(0deg, rgba(0,145,255,0.00) 4%, #0091ff 50%);
        }
        .main-part {
            position: relative;
            top: -9.938rem;
            padding: 1.25rem 1.125rem 0 1.125rem;
            .title {
                display: flex;
                align-items: center;
                justify-content: space-between;
                height: 4.063rem;
                color: #fff;
                .return-btn {
                    width: .75rem;
                    height: 1.375rem;
                    overflow: hidden;
                    .virtual-up {
                        border-bottom: 2px solid #fff;
                        box-sizing: border-box;
                        width: .875rem;
                        height: 50%;
                        transform: rotate(42.5deg);
                        transform-origin: left bottom;
                    }
                    .virtual-down {
                        border-top: 2px solid #fff;
                        box-sizing: border-box;
                        width: .875rem;
                        height: 50%;
                        transform: rotate(-42.5deg);
                        transform-origin: left top;
                    }
                }

                p {
                    font-size: 1rem;
                }
                .virtual-part {
                    width: .75rem;
                    height: 1.375rem;
                }
            }
            .address {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 1rem;
                margin-bottom: 1rem;
                background-color: #fff;
                .address-left {
                    p{
                        &:first-child {
                            color: #333;
                            font-size: 1rem;
                            font-weight: bolder;
                            line-height: 1.375rem;
                            margin-bottom: .875rem;
                        }
                        &:nth-child(2) {
                            color: #333;
                            font-size: .875rem;
                            line-height: 1.25rem;
                            margin-bottom: .375rem;
                        }
                        &:last-child {
                            color: #666;
                            font-size: .75rem;
                            line-height: 1.063rem;
                        }
                    }
                }
                .address-right {
                    width: .5rem;
                    height: 1rem;
                    overflow: hidden;
                    position: relative;
                    .virtual-up {
                        position: absolute;
                        right: 0;
                        border-bottom: 1.5px solid #666;
                        box-sizing: border-box;
                        width: .625rem;
                        height: 50%;
                        transform: rotate(-45deg);
                        transform-origin: right bottom;
                    }
                    .virtual-down {
                        position: absolute;
                        right: 0;
                        top: .5rem;
                        border-top: 1.5px solid #666;
                        box-sizing: border-box;
                        width: .625rem;
                        height: 50%;
                        transform: rotate(45deg);
                        transform-origin: right top;
                    }
                }
            }
            .shopping-list {
                padding: 1rem;
                background-color: #fff;
                .shop-name {
                    color: #333;
                    font-size: 1rem;
                    font-weight: bolder;
                    line-height: 1.375rem;
                    margin-bottom: 1rem;
                }
                ul {
                    overflow: hidden;
                    transition: height 500ms ease;
                    li {
                        display: flex;
                        margin-bottom: 1rem;
                        img {
                            width: 2.875rem;
                            height: 2.875rem;
                            margin-right: 1rem;
                        }
                        .item-information {
                            display: flex;
                            flex-direction: column;
                            justify-content: space-between;
                            flex-grow: 1;
                            .item-name {
                                font-size: .875rem;
                                font-weight: bolder;
                                line-height: 1.25rem;
                                color: #333;
                            }
                            .price-area {
                                display: flex;
                                flex-direction: row;
                                justify-content: space-between;
                                
                                .single-price {
                                    font-size: 1.05rem;
                                    color: #e93b3b;
                                    transform: scale(0.83);
                                    transform-origin: left bottom;
                                    span {
                                        font-size: .75rem;
                                    }
                                }
                                .item-price {
                                    color: #000;
                                    transform: scale(0.83);
                                    transform-origin: right bottom;
                                    span {
                                        font-size: .75rem;
                                    }
                                }
                            }
                        }
                    }
                }
                .subtotal {
                    display: flex;
                    align-items: center;
                    height: 1.75rem;
                    background-color: #f5f5f5;
                    font-size: 14px;
                    color: #999;
                    p {
                        margin: 0 .5rem 0 5.75rem;
                    }
                    div {
                        width: .875rem;
                        height: .438rem;
                        overflow: hidden;
                        position: relative;
                        transform: rotate(0deg);
                        transition: transform 500ms ease;
                        .virtual-left {
                            position: absolute;
                            box-sizing: border-box;
                            border-right: 1px solid #999;
                            width: 50%;
                            height: .563rem;
                            transform: rotate(-45deg);
                            transform-origin: right top;
                        }
                        .virtual-right {
                            position: right;
                            left: .438rem;
                            box-sizing: border-box;
                            border-left: 1px solid #999;
                            width: 50%;
                            height: .563rem;
                            transform: rotate(45deg);
                            transform-origin: left top;
                        }
                    }
                    .rotate {
                        transform: rotate(-180deg);
                    }
                }
            }
        }
        
        .statistics {
            position: fixed;
            bottom: 0;
            display: flex;
            align-items: center;
            justify-content: space-between;
            box-sizing: border-box;
            width: 100%;
            height: 3.063rem;
            padding-left: 1.5rem;
            font-size: .875rem;
            background-color: #fff;
            .total-price {
                color: #333;
                span {
                    font-size: 1rem;
                    font-weight: bolder;
                }
            }
            button {
                width: 6.125rem;
                height: 100%;
                border: none;
                padding: 0;
                background-color: #4fb0f9;
                color: #fff; 
            }
        }
        .cover {
            position: absolute;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.5);
        }
        .toast {
            position: absolute;
            top: 15.188rem;
            left: 50%;
            transform: translateX(-50%);
            /*right: 0;
            left: 0;*/
            width: 18.813rem;
            height: 9.813rem;
            /*margin: 0 auto;*/
            padding: 1.5rem 0;
            box-sizing: border-box;
            background-color: #fff;
            border-radius: .25rem;
            p {
                text-align: center;
                &:first-child {
                    font-size: 1.125rem;
                    font-weight: bolder;
                    color: #333;
                    line-height: 1.563rem;
                    margin-bottom: .5rem;
                }
                &:nth-child(2) {
                    font-size: .875rem;
                    color: #666;
                    line-height: 1.25rem;
                    margin-bottom: 1.5rem;
                }
            }
            .decision {
                display: flex;
                justify-content: center;
                button {
                    width: 5rem;
                    height: 2rem;
                    box-sizing: border-box;
                    border: 1px solid #4fb0f9;
                    border-radius: 1rem;
                    margin: 0 .75rem;
                    padding: 0;
                    font-size: .875rem;
                    &:first-child {
                        background-color: #fff;
                        color: #0091ff;
                    }
                    &:last-child {
                        background-color: #4fb0f9;
                        color: #fff;
                    }
                }
            }
        }
    }

</style>