<script setup>
    import {ref} from 'vue'
    import TabBar from '../components/TabBar.vue';
    import splicer from '../assets/utilities/urlSplicer';
    import {plus, multiply} from '../assets/utilities/myArithmetic'

    let orderRecords= ref([])
    fetch(splicer('/api/order'))
    .then(res=> res.json())
    .then(data=> {
        if(data?.errno=== 0) {
            data.data.forEach(element => {
                element.totalAmount= 0
                element.totalPrice= 0
                element.products.forEach(e=> {
                    element.totalAmount= plus(element.totalAmount, e.product.sales)
                    element.totalPrice= plus(element.totalPrice, multiply(e.product.sales, e.product.price))
                })
                orderRecords.value.push(element)
            });
            console.log(data)
        }
    })
    .catch(e=> console.log(e))

</script>
<template>
    <div class="container">
        <div class="title">
            <p>我的订单</p>
        </div>
        <ul class="main-list">
            <li v-for="(item, index) in orderRecords" :key="index">
                <div>
                    <p>{{item.shopName}}</p>
                    <p>{{item.isCanceled?'已取消':''}}</p>
                </div>
                <div>
                    <ul>
                        <li v-for="(itemIn, indexIn) in item.products" :key="indexIn">
                        <img :src="itemIn.product.img">
                        </li>
                    </ul>
                    <div>
                        <p>￥{{item.totalPrice}}</p>
                        <p>共{{item.totalAmount}}件</p>
                    </div>
                </div>
            </li>
        </ul>
        <TabBar currentView="2"/>
    </div>
    
</template>
<style lang="scss" scoped>
    .container {
        width: 100vw;
        height: 100vh;
        background-color: #f5f5f5;
        .title {
            padding-top: 1.25rem;
            height: 2.75rem;
            background-color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            p {
                font-size: 1rem;
                line-height: 1.375rem;
                color: #333;
            }
        }
    }
    .main-list {
        margin: 1rem 1.125rem 0 1.125rem;
        >li {
            box-sizing: border-box;
            padding: 1rem;
            height: 6.875rem;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            background-color: #fff;
            >div {
                display: flex;
                justify-content: space-between;
                &:first-child {
                    p {
                        &:first-child {
                            font-size: 1rem;
                            font-weight: bolder;
                            color: #333;
                        }
                        &:last-child {
                            font-size: .875rem;
                            color: #999;
                        }
                    }
                }
                ul {
                    display: flex;
                    li {
                        img{
                            width: 40px;
                            height: 40px;
                            margin-right: .75rem;
                        }
                    }
                }
                div {
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    align-items: flex-end;
                    p {
                        &:first-child {
                            color: #e93b3b;
                            font-size: .875rem;
                        }
                        &:last-child {
                            color: #333;
                            font-size: .75rem;
                        }
                    }
                }
            }
        }

    }
</style>