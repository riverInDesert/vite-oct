<script setup>
    import TabBar from '../components/TabBar.vue';
</script>
<template>
    <div class="container">
        <div class="title">
            <p>我的订单</p>
        </div>
        <ul class="main-list">
            <li>
                <div>
                    <p>沃尔玛</p>
                    <p>已取消</p>
                </div>
                <div>
                    <ul>
                        <li></li>
                        <li></li>
                    </ul>
                    <div>
                        <p>￥66.69</p>
                        <p>共5件</p>
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
                        width: 40px;
                        height: 40px;
                        margin-right: .75rem;
                        background-color: #1fa4fc;
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