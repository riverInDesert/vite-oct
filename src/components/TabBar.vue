<script setup>
  import router from '../router';
  defineProps(['currentView']);
</script>
<template>
    <div class="TabBar">
    <div class="Tab" :class="{'Tab--active': currentView== 0 }" @touchstart="router.push('/')">
      <div class="icon"><i class="fi fi-rs-home"></i></div>
      <span>首页</span>
    </div>
    <div class="Tab">
      <div class="icon" :class="{'Tab--active': currentView== 1}"><i class="fi fi-rs-shopping-cart"></i></div>
      <span>购物车</span>
    </div>
    <div class="Tab" :class="{'Tab--active': currentView== 2}" @touchstart="router.push('/orderRecord')">
      <div class="icon"><i class="fi fi-rs-ballot"></i></div>
      <span>订单</span>
    </div>
    <div class="Tab">
        <div class="icon" :class="{'Tab--active': currentView== 3}"><i class="fi fi-rs-user"></i></div>
        <span>我的</span>
    </div>
  </div>
</template>
<style lang="scss">
    .TabBar{
        display: flex;
        justify-content: space-between;
        position: fixed;
        bottom: 0;
        box-sizing: border-box;
        width: 100%;
        padding: 0.44rem 2.5rem 0.38rem 2.5rem;
        height: 3.1rem;
        box-shadow:  0 -1px 1px 0 #F1F1F1;
        background-color: #fff;
        .Tab {
          &--active {
            color: #1fa4fc;
          }
          .icon {
            text-align: center;
          }
          span {
            display: inline-block;
            width: 2.25rem;
            font-size: 0.75rem;
            text-align: center;
            transform: scale(0.83);
            transform-origin: center top;
          }
          &:first-child{
            .icon {
              width: 1.88rem;
            }
            span {
              transform-origin: 0 0;
            }
          }
          &:last-child{
            .icon {
              position: relative;
              left: 0.375rem;
              width: 1.88rem;
            }
            span {
              transform-origin: right top;
            }
          }
        }
    }
</style>