<script setup>
    defineProps(['defaultContent']);
</script>
<template>
    <div class="search-box">
        <a><i class="fi fi-rs-search"></i></a>
        <input type="text" :placeholder="defaultContent">
    </div>
    
</template>
<style lang="scss">
    .search-box {
        display: flex;
        box-sizing: border-box;
        overflow: hidden;
        width: 100%;
        height: 2rem;
        background-color: #f5f5f5;
        border-radius: 1rem;
        border: none;
        a {
            display: block;
            width: 2.75rem;
            color: #b7b7b7;
            i {
                position: relative;
                left: 1rem;
                top:0.5rem;
            }
        }
        input {
            flex-grow: 1;
            border: none;
            outline: none;
            padding-block: 0;
            background-color: transparent;
            &::placeholder {
                color:#b7b7b7;
                font-size: 0.875rem;
                line-height: 3rem;
            }
        }
    }
</style>