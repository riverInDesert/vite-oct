<template>
    <div class="delivery-address">
        <div class="icon"><i class="fi fi-rs-marker"></i></div>
        <div class="delivery-address_content">
            北京理工大学国防科技园2号楼10层
        </div>
        <div class="icon"><i class="fi fi-rs-bell"></i></div>
    </div>
</template>
<style lang="scss">
    @import '../assets/single-lineWithOmitting.scss';
    .delivery-address {
        display: flex;
        margin-bottom: 1rem;
        &_content {
            @include single-lineWithOmitting;
            line-height: 1.375rem;
            height: 1.375rem;
            margin: 0 0.606rem;
            flex-grow: 1;
        }
        .icon {
            position: relative;
            top: 0.188rem;
        }
    }

</style>