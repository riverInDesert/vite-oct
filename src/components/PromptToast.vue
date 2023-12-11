<template>
    <div class="o">
        <div class="i">
            <slot></slot>
        </div>
    </div>
</template>
<style scoped>
    .o {
        position: fixed;
        display: flex;
        width: 58%;
        height: 20%;
        background-color: #ddd;
        border-radius: 10%;
        color: #fff;
        padding: 0 1rem;
        top: 27%;
        left: 50%;
        transform: translateX(-50%);
        align-items: center;
        justify-content: center;
    }
    
</style>