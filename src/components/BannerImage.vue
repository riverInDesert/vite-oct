<script setup>
    //import {ref} from 'vue';
    //let device_width=ref();
</script>
<template>
    <div class="banner">
        <img src="http://www.dell-lee.com/imgs/vue3/banner.jpg" alt="双十一狂欢节">
    </div>
</template>
<style lang="scss">
    .banner {
        margin: 0.75rem 0 1rem 0;
        img {
            --image-width: calc(100vw - 2rem);
            width: 100%;
            height: calc(calc(var(--image-width)*97)/382);
        }
    }
</style>