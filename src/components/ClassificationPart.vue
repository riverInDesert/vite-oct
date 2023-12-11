<template>
    <div class="classification">
        <a>
            <img src="http://www.dell-lee.com/imgs/vue3/超市.png" alt="超市">
            <p>超市便利</p>
        </a>
        <a>
            <img src="http://www.dell-lee.com/imgs/vue3/菜市场.png" alt="菜场">
            <p>菜市场</p>
        </a>
        <a>
            <img src="http://www.dell-lee.com/imgs/vue3/水果店.png" alt="水果">
            <p>水果店</p>
        </a>
        <a>
            <img src="http://www.dell-lee.com/imgs/vue3/鲜花.png" alt="鲜花">
            <p>鲜花绿植</p>
        </a>
        <a>
            <img src="http://www.dell-lee.com/imgs/vue3/医药健康.png" alt="医药">
            <p>医药健康</p>
        </a>
        <a>
            <img src="http://www.dell-lee.com/imgs/vue3/家居.png" alt="家居">
            <p>家居时尚</p>
        </a>
        <a>
            <img src="http://www.dell-lee.com/imgs/vue3/蛋糕.png" alt="蛋糕">
            <p>烘焙蛋糕</p>
        </a>
        <a>
            <img src="http://www.dell-lee.com/imgs/vue3/签到.png" alt="签到">
            <p>签到</p>
        </a>
        <a>
            <img src="http://www.dell-lee.com/imgs/vue3/大牌免运.png" alt="大牌">
            <p>大牌免运</p>
        </a>
        <a>
            <img src="http://www.dell-lee.com/imgs/vue3/红包.png" alt="红包">
            <p>红包套餐</p>
        </a>
    </div>
</template>
<style lang="scss">
    .classification {
        display: grid;
        grid-template-areas: 
            "a a a a a"
            "a a a a a";
        justify-content: space-between;
        a {
            display: block;
            
            img {
                width: 2.5rem;
                height: 2.5rem;
                margin: 0 auto;
            }
            p {
                font-size: 0.75rem;
                margin: 0.375rem 0 1rem 0;
                width: 3.5rem;
                text-align: center;
            }
        }
    }
</style>