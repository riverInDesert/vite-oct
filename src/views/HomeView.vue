<script setup>
//import TheWelcome from '../components/TheWelcome.vue'
  import BannerImage from '../components/BannerImage.vue';
  import ClassificationPart from '../components/ClassificationPart.vue';
  import DeliveryAddress from '../components/DeliveryAddress.vue';
  import SearchBox from '../components/SearchBox.vue';
  import ShopList from '../components/ShopList.vue';
  import TabBar from '../components/TabBar.vue';
</script>

<template>
  <!--<main>
    <TheWelcome />
  </main>-->
  <div class="home_static-part">
    <DeliveryAddress/>
    <SearchBox default-content="山姆会员商店优惠商品"/>
    <BannerImage/>
    <ClassificationPart/>
  </div>
  <div class="gap"></div>
  <div class="home-dynamic-part">
    <div class="title">附近店铺</div>
    <ShopList/>
  </div>
  <TabBar currentView="0"/>
</template>

<style lang="scss">
  .home_static-part {
    padding: 2.25rem 1.125rem 0;
    margin-bottom: 0.625rem;
  }
  .gap {
    background-color: #F1F1F1;
    height: 0.625rem;
  }
  .home-dynamic-part {
    padding: 1rem 1.125rem 0 1.125rem;
    .title {
      font-size: 1.125rem;
      margin-bottom: 0.875rem;
    }
  }
</style>
