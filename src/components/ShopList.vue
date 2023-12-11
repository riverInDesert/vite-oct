<script setup>
    import {ref} from 'vue';
    import splicer from '../assets/utilities/urlSplicer';
    import travelTo from '../assets/utilities/travelTo';
    //const items=ref([
        // {id:0,shop_icon_src:"http://www.dell-lee.com/imgs/vue3/near.png",shop_name:"沃尔玛",sales:"1万+",min_price:0,freight:5,discount:"VIP尊享满89元减4元运费券 （每月3张）"},
        // {id:1,shop_icon_src:"http://www.dell-lee.com/imgs/vue3/near.png",shop_name:"山姆会员商店",sales:"2千+",min_price:0,freight:5,discount:"联合利华洗护满10减5"}
    // ])
    let items=ref([]);
    fetch(splicer('/api/shop/hot-list'))
    .then(response=>response.json())
    .then(data=>{
        if(data?.errno===0){
            data?.data.forEach(element => {
                items.value.push(element)
            });
            
        }
    })
    .catch(e=>console.log(e))
    
</script>
<template>
    <ul>
        <li v-for="item in items" :key="item._id" @click="travelTo(`/shopDetails/${item._id}`)">
            <img :src="item.imgUrl" :alt="item.name">
            <div class="shop-intro">
                <div class="shop-name">{{ item.name }}</div>
                <div class="price">
                    <span>月售{{ item.sales }}</span>
                    <span>起送￥{{ item.expressLimit }}</span>
                    <span>基础运费￥{{ item.expressPrice }}</span>
                </div>
                <div class="discount">{{ item.slogan }}</div>
            </div>
            
        </li>
    </ul>
</template>
<style lang="scss">
    .home-dynamic-part{
        li {
            display: flex;
            img {
                margin-right: 1rem;
                width: 3.5rem;
                height: 3.5rem;
            }
            .shop-intro{
                flex-grow: 1;
                padding-bottom: 0.75rem;
                border-bottom: 1px solid #F1F1F1;
                margin-bottom: 0.75rem;
                .shop-name {
                    font-size: 1rem;
                    margin-bottom: 0.5rem;
                }
                .price {
                    margin-bottom: 0.5rem;
                    span {
                        font-size: 0.813rem;
                        &:nth-child(2) {
                            margin: 0 1rem;
                        }   
                    }
                }
                .discount {
                    font-size: 0.813rem;
                    color: #e93b3b;
                }
            }
        }
    }
</style>