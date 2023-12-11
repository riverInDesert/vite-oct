<script setup>
    import SearchBox from '../components/SearchBox.vue';
    import {ref, computed, onMounted, onBeforeUnmount} from 'vue';
    import splicer from '../assets/utilities/urlSplicer';
    import travelTo from '../assets/utilities/travelTo';
    import {useShoppingStore} from '../stores/shopping';
    import { useRouter,useRoute } from 'vue-router';

    //pinia实例
    let store= useShoppingStore();
    //pinia实例的数据向localStorage转移
    function shiftData() {
        localStorage.shoppingRecord= JSON.stringify(store.$state.shoppingList);
        console.log("shifted");
    }
    onMounted(()=>{
        if(localStorage.shoppingRecord){
            //从localStorage中找回状态
            store.$state.shoppingList= JSON.parse(localStorage.shoppingRecord);
        }
        //在页面刷新，关闭，后退时转移状态
        //window.addEventListener('beforeunload', shiftData);
    })
    onBeforeUnmount(()=> {
        console.log(45);
        shiftData();
        //及时销毁监听
        //window.removeEventListener('beforeunload',shiftData);
    })
    const router=useRouter();
    const route=useRoute();
    
    //返回主页
    function goBack() {
        router.back();
    }

    //超市整体数据
    let currentShop= ref({});
    fetch(splicer(`/api/shop/${route.params.id}`))
    .then(response=>response.json())
    .then(data=>{
        if (data?.errno=== 0) {
            Object.assign(currentShop.value,data?.data);
        }
    })
    .catch(e=>console.log(e))

    //分类    
    let sortList= [
        {   
            id: 1,
            text: '全部商品',
            mark: 'all'
        },
        {   
            id: 2,
            text: '秒杀',
            mark: "seckill"
        },
        {   
            id: 3,
            text: '新鲜水果',
            mark: 'fruit'
        },
        {   
            id: 4,
            text: '休闲食品'
        },
        {   
            id: 5,
            text: '时令蔬菜'
        },
        {   
            id: 6,
            text: '肉蛋家禽'
        }
    ]
    let amazingTrigger= ref('全部商品');

    //商品列表
    let stockList= ref({});
    //初始拿取列表
    fetch(splicer(`/api/shop/${route.params.id}/products?tab=all`))
    .then(response=> response.json())
    .then(data=> {
        if(data?.errno=== 0){
            Object.assign(stockList.value, data?.data);
            //console.log(stockList.value)
        }
    })
    .catch(e=>console.log(e))
    //事件触发拿取
    function changeSort(target) {
        amazingTrigger.value= target.text;
        fetch(splicer(`/api/shop/${route.params.id}/products?tab=${target.mark}`))
        .then(response=> response.json())
        .then(data=> {
            if(data?.errno=== 0){
                Object.assign(stockList.value, data?.data);
            }
        })
        .catch(e=>console.log(e))
    }
    //向pinia实例中增减商品
    
    //增加一种商品
    function addOneitem(item) {
        store.$patch((state)=> {
            if(!state.shoppingList[route.params.id]) {
                state.shoppingList[route.params.id]= new Object();
                let _currentShop= state.shoppingList[route.params.id];
                _currentShop.shopName= currentShop.value.name;
                _currentShop.list= new Object();
                //console.log(_currentShop)
            } 
           if(!state.shoppingList[route.params.id].list[`p${item._id}`]){
                let _currentShop= state.shoppingList[route.params.id];
                _currentShop.list[`p${item._id}`]= new Object();
                //console.log(_currentShop.list.get(item._id));
                Object.assign(_currentShop.list[`p${item._id}`], item);
                _currentShop.list[`p${item._id}`].count= 0;
                _currentShop.list[`p${item._id}`].amazingTrigger= true;
                _currentShop.list[`p${item._id}`].actuallyChosen= true;
                //console.log(state.shoppingList[route.params.id])
            }
            let _currentShop= state.shoppingList[route.params.id]; 
            if(_currentShop.list[`p${item._id}`].count<99) {
                _currentShop.list[`p${item._id}`].count += 1;
            }
        
            //console.log(state.shoppingList)
            
            //console.log(state.shoppingList[route.params.id])
        })
    }
    //（方法）减少一种商品
    function removeOneItem(item) {
        store.$patch((state)=> {
            let currentProductList= state.shoppingList[route.params.id].list;
            currentProductList[`p${item._id}`].count -= 1;
            if(currentProductList[`p${item._id}`].count< 1) {
                //console.log(state.shoppingList[route.params.id].list)
                delete currentProductList[`p${item._id}`];
            } 
           
        })
    }

    //遮罩

    //打开与关闭遮罩
    let coverState= ref(false);
    function coverOnOff() {
        if(store.totalAmount[route.params.id]> 0|| Object.keys(preChoice.value).length>0) {
            coverState.value= !coverState.value;
        }
    }
    //遮罩中的列表数据
    let preChoice= computed(()=> {
        let r
        if(store.$state.shoppingList?.[route.params.id]) {
            r= store.$state.shoppingList?.[route.params.id].list
        } else {
            r= {};
        }
        return r
    })
    //描述全选与否的状态
    let allSelected= computed(()=>{
        let r= true;
        if(store.$state.shoppingList?.[route.params.id]) {
            for(let item in preChoice.value) {
                if(preChoice.value[item].actuallyChosen=== false){
                    r= false;
                }
            }
        }
        return r
    })
    //手动全部勾选
    function selectAll() {
        for(let item in preChoice.value) {
            preChoice.value[item].actuallyChosen= true;
        }
    }
    //列表中单项勾选与取消勾选
    function switchChosen(item) {
        item.actuallyChosen= !item.actuallyChosen
    }
    //增加（在遮罩中）
    function addAgain(i) {
        if(i.count< 99) {
            i.count += 1
        }
    }
    //减少（在遮罩中）
    function removeAgain(i) {
        i.count -= 1
        if(i.count< 1) {
            let currentProductList= store.$state.shoppingList[route.params.id].list; 
            delete currentProductList[`p${i._id}`];
        }
        if(!store.totalAmount[route.params.id]&& Object.keys(preChoice.value).length== 0) {
            coverState.value= false;
        }
    }
    //清空遮罩列表
    function clearAll() {
        delete store.$state.shoppingList[route.params.id];
        coverState.value= false;
    }

    //结算按钮
    //决定按钮是否起作用的布尔值
    let permission= computed(()=> {
        if(store.totalAmount[route.params.id]) {
            return false;
        } else {
            return true;
        }
    })
    //去结算按钮
    function buttonPushed() {
        store.$patch((state)=> {
            state.shoppingList.currentShopId= route.params.id
        })
        travelTo('/order');
    }
</script>

<template>
    <div class="searchbox-area">
        <div class="return-button" @click="goBack"><i class="fi fi-rs-angle-left"></i></div>
        <SearchBox default-content="请输入商品名称搜索"/> 
    </div>
    <div class="shop-selected" v-if="currentShop.imgUrl">
        <img :src="currentShop.imgUrl" :alt="currentShop.name">
        <div class="shop-intro">
            <div class="shop-name">{{ currentShop.name }}</div>
            <!-- <div class="blank" v-else></div> -->
            <div class="price">
                <span>月售{{ currentShop.sales }}</span>
                <span>起送￥{{ currentShop.expressLimit }}</span>
                <span>基础运费￥{{ currentShop.expressPrice }}</span>
            </div>
            <div class="discount">{{ currentShop.slogan }}</div>
        </div>
    </div>
    <div class="supermarket">
        <ul class="sort">
            <li v-for="item in sortList" :key="item.id" @touchstart="changeSort(item)" :class="{chosen: amazingTrigger===item.text}">{{ item.text }}</li>
        </ul>
        <ul class="stock">
            <li v-for="item in stockList" :key="item._id">
                <img :src="item.imgUrl" :alt="item.name">
                <div class="info">
                    <p>{{ item.name }}</p>
                    <p>月售{{ item.sales }}件</p>
                    <div class="contrast-price">
                        <div>
                            <span>￥</span>{{ item.price }}
                        </div>
                        <div>￥{{ item.oldPrice }}</div>
                    </div>
                </div>
                <div class="btn-area">
                    <div class="minus" v-if="preChoice?.[`p${item._id}`]?.amazingTrigger" @touchstart="removeOneItem(item)">-</div>
                    <p class="amount" v-show="preChoice?.[`p${item._id}`]?.amazingTrigger">{{ preChoice?.[`p${item._id}`]?.count||0 }}</p>
                    <div class="plus" @touchstart="addOneitem(item)">+</div>
                </div>
            </li>
        </ul>
    </div>
    <div class="cover" v-if="coverState"></div>
    <div class="final-decision" v-show="coverState">
        <div class="control-all">
            <div class="all-selected">
                <div :class="{selected:allSelected}" @touchstart="selectAll"></div>
                <p>全选</p>
            </div>
            <div @touchstart="clearAll">清空购物车</div>
        </div>
        <div class="final-list">
            <ul>
                <li v-for="item in preChoice" :key="item.id">
                    <div @touchstart="switchChosen(item)" :class="{selected: item.actuallyChosen}"></div>
                    <img :src="item.imgUrl">
                    <div class="simple-info">
                        <p>{{ item.name }}</p>
                        <div class="contrast-price">
                            <div>
                                <span>￥</span>{{ item.price }}
                            </div>
                            <div>￥{{ item.oldPrice }}</div>
                        </div>
                    </div>
                    <div class="btn-area">
                        <div class="minus" v-if="item.amazingTrigger" @touchstart="removeAgain(item)">-</div>
                        <p class="amount" v-show="item.amazingTrigger">{{ item.count||0 }}</p>
                        <div class="plus" @touchstart="addAgain(item)">+</div>
                    </div>
                </li>
            </ul>
        </div>
    </div>
    <div class="settlement">
        <div class="basket" @touchstart="coverOnOff">
            <div>
                <img src='http://www.dell-lee.com/imgs/vue3/basket.png' alt="basket">
                <div class="quantity" v-show="store.totalAmount[route.params.id]">{{ store.totalAmount[route.params.id]|| 0 }}</div>
            </div>
        </div>
        <p>总计：</p>
        <p class="total-price">￥<span>{{store.totalPrice[route.params.id]|| 0}}</span></p>
        <button @click="buttonPushed" :disabled="permission">去结算</button>
    </div>
</template>

<style lang="scss">
    
    .searchbox-area {
        display: flex;
        padding: 2.25rem 1.125rem 0 1.156rem;
        .return-button {
            line-height: 2rem;
            color: #b6b6b6;
            margin-right: 1rem;
        }
    }
    .shop-selected {
        display: flex;
        padding: 1rem 1.125rem 0 1.125rem;
        img {
            margin-right: 1rem;
            width: 3.5rem;
            height: 3.5rem;
        }
        .shop-intro{
            flex-grow: 1;
            padding-bottom: 1rem;
            
            .shop-name {
                font-size: 1rem;
                margin-bottom: 0.5rem;
            }
            // .blank {
                // background-color: #333333;
                // width: 3rem;
                // height: 1.375rem;
            // }
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
    .supermarket {
        position: absolute;
        display: flex;
        top: 10.875rem;
        bottom: 3.125rem;
        width: 100vw;
        .sort {
            background-color: #f5f5f5;
            overflow: scroll;
            li {
                width: 4.75rem;
                height: 2.5rem;
                font-size: .875rem;
                text-align: center;
                line-height: 2.5rem;
                color: #333333;
                border-radius: .125rem;
            }
            .chosen {
                background-color: #fff;
            }
        }
        .stock {
            flex: 1;
            margin: 0 1.125rem 0 1rem;
            overflow: scroll;
            li {
                display: flex;
                padding: .75rem 0;
                border-bottom: 1px solid #f1f1f1;
                img {
                    width: 4.25rem;
                    height: 4.25rem;
                    margin-right: 1rem;
                }
                .info {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    
                    height: 4.25rem;
                    p {
                        margin: 0;
                        &:first-child {
                            font-size: .875rem;
                            font-weight: bold;
                        }
                        &:nth-child(2) {
                            font-size: .75rem;
                            margin-top: .375rem;
                            flex-grow: 1;
                        }
                    }
                    .contrast-price {
                        display: flex;
                        transform: scale(0.83);
                        transform-origin: left bottom;
                        font-size: 1.05rem;
                        color: #e93b3b;
                        div{
                            &:first-child {
                                line-height: 1.5rem;
                                span {
                                    font-size: .75rem;
                                }
                            }
                            &:last-child {
                                align-self: center;
                                margin-left: .45rem;
                                font-size: .75rem;
                                text-decoration: line-through;
                                color: #999;
                            }
                        }
                    }

                    
                }
                .btn-area {
                    align-self: flex-end;
                    display: flex;
                    align-items: center;
                    .minus {
                        box-sizing: border-box;
                        width: 1.25rem;
                        height: 1.25rem;
                        border-radius: 50%;
                        border: 1px solid #666;
                        font-size: .875rem;
                        color: #666;
                        text-align: center;
                        line-height: 1.25rem;
                        margin-right: .5rem;
                    }
                    .amount {
                        color: #333;
                        font-size: .875rem;
                        line-height: 1rem;
                        margin: 0;
                        width: 1.5em;
                        text-align: center;
                    }
                    .plus{
                        background-color: #0091ff;
                        width: 1.25rem;
                        height: 1.25rem;
                        border-radius: 50%;
                        font-size: .875rem;
                        color: #fff;
                        text-align: center;
                        line-height: 1.25rem;
                        margin-left: .5rem;
                    }
                }
            }   
        }
    }
    .cover {
        position: fixed;
        width: 100%;
        height: 100%;
        top: 0;
        background-color: rgba(0,0,0,0.5);
    }
    .final-decision {
        position: fixed;
        bottom: 3.063rem;
        box-sizing: border-box;
        width: 100%;
        background-color: #fff;
        .control-all {
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 3.25rem;
            border-bottom: 1px solid #f1f1f1;
            padding: 0 1.125rem;
            color: #333;
            font-size: .875rem;
            .all-selected {
                display: flex;
                align-items: center;
                div {
                    border-radius: 50%;
                    width: 1.25rem;
                    height: 1.25rem;
                    box-sizing: border-box;
                    border: 1px solid #333;
                }
                .selected {
                    background-color: #0091ff;
                }
                p {
                    margin-left: .5rem;
                }
            }
        }
        .final-list {
            position: relative;
            height: 8.75rem;
            overflow: scroll;
            box-sizing: border-box;
            padding: .5rem 1.125rem;
            ul{
                li {
                    display: flex;
                    align-items: center;
                    height: 3.875rem;
                    box-sizing: border-box;
                    padding: .5rem 0;
                    >div{
                        &:first-child {
                            width: 1.25rem;
                            height: 1.25rem;
                            box-sizing: border-box;
                            border: 1px solid #333;
                            border-radius: 50%;
                            margin-right: 1rem;
                        }
                    }
                    .selected {
                        background-color: #0091ff;
                    }
                    img {
                        margin-right: 1rem;
                        width: 2.875rem;
                    }
                    .simple-info {
                        flex: 1;
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;
                        height: 2.875rem;
                        p {
                            margin: 0;
                            font-size: .875rem;
                            font-weight: bold;
                        }
                        .contrast-price {
                            display: flex;
                            transform: scale(0.83);
                            transform-origin: left bottom;
                            font-size: 1.05rem;
                            color: #e93b3b;
                            div{
                                &:first-child {
                                    line-height: 1.5rem;
                                    span {
                                        font-size: .75rem;
                                    }
                                }
                                &:last-child {
                                    align-self: center;
                                    margin-left: .45rem;
                                    font-size: .75rem;
                                    text-decoration: line-through;
                                    color: #999;
                                }
                            }
                        }
                    }
                    .btn-area {
                        display: flex;
                        align-items: center;
                        .minus {
                            box-sizing: border-box;
                            width: 1.25rem;
                            height: 1.25rem;
                            border-radius: 50%;
                            border: 1px solid #666;
                            font-size: .875rem;
                            color: #666;
                            text-align: center;
                            line-height: 1.25rem;
                            margin-right: .5rem;
                        }
                        .amount {
                            color: #333;
                            font-size: .875rem;
                            line-height: 1rem;
                            margin: 0;
                            width: 1.5em;
                            text-align: center;
                        }
                        .plus{
                            background-color: #0091ff;
                            width: 1.25rem;
                            height: 1.25rem;
                            border-radius: 50%;
                            font-size: .875rem;
                            color: #fff;
                            text-align: center;
                            line-height: 1.25rem;
                            margin-left: .5rem;
                        }
                    }
                }
            }
        }
    }
    .settlement {
        position: fixed;
        bottom: 0;
        display: flex;
        width: 100%;
        height:3.063rem;
        box-shadow: 0 -1px 1px 0 #f1f1f1;
        align-items: center;
        background-color: #fff;
        .basket {
            display: flex;
            justify-content: center;
            width: 4.75rem;
            margin-right: .5rem;
            >div {
                position: relative;
                width: 1.75rem;
                height: 1.625rem;
                img {
                    width: 1.75rem;
                }
                .quantity {
                    position: absolute;
                    top: 0;
                    right: 0;
                    transform: translate(50%,-50%) scale(0.667);
                    width: .938rem;
                    border-radius: 50%;
                    background-color: #e93b3b;
                    color: #fff;
                    font-size: .75rem;
                    text-align: center;
                    line-height: .938rem;
                }
            }
        }
        p{
            &:nth-child(2) {
                font-size: .75rem;
                color: #333;
                width: 2.25rem;
            }
        }
        .total-price {
            font-size: 1.125rem;
            color:#e93b3b;
            flex-grow: 1;
        }
        button {
            width: 6.125rem;
            height: 100%;
            border: none;
            background-color: #4fb0f9;
            color: #fff;
            font-size: .875rem;
        }
    }
</style>

