<script setup>
    import {ref} from 'vue'
    import { useRouter } from 'vue-router';
    import splicer from '../assets/utilities/urlSplicer.js';
    import preCheck from '../assets/utilities/preCheck';
    let ap=ref({
        username:'',
        password:''
    });
    const router= useRouter();
    let toastPresent=ref(false);
    let promptMessage=ref('');
    function login() {
        //if(localStorage.isLogin==true){
            //router.push('/');
        //
        let {signal,message}= preCheck(ap.value.username,[ap.value.password]);
        if (!signal) {
            toastPresent.value=true;
            promptMessage.value=message;
            setTimeout(()=>{
                toastPresent.value=false;
            },1500)
            return
        }
        fetch(splicer('/api/user/login'),{
            method:'POST',
            headers: new Headers({'Content-Type':'application/json'}),
            body:JSON.stringify({
                username:ap.value.username,
                password:ap.value.password
            })
        })
        .then(response=>response.json())
        .then(data=>{
            if(data?.errno===0){
                localStorage.isLogin=true;
                router.push('/')
            }
        })
        .catch(e=>console.log(e))
    }
    function register() {
        router.push('/register')
    }
</script>
<template>
    <div class="solid-part">
        <img src="http://www.dell-lee.com/imgs/vue3/user.png" alt="用户">
        <input type="text" placeholder="请输入手机号" v-model="ap.username">
        <input type="password" placeholder="请输入密码" v-model="ap.password">
        <button type="submit" @click="login">登录</button>
        <div class="bottom">
            <input type="button" value="立即注册" @click="register">
            <div class="divi">|</div>
            <input type="button" value="忘记密码">
        </div>
    </div>
    <div v-if="toastPresent">{{ promptMessage }}</div>
</template>
<style lang="scss" scoped>
    .solid-part {
        margin: 8.75rem 2.5rem 0 2.5rem;
        img {
            width: 4.125rem;
            height: 4.125rem;
            margin: 0 auto 2.5rem;
        }
        input[type="text"],input[type="password"] {
            box-sizing: border-box;
            height: 3rem;
            width: 100%;
            padding: 1px 1rem;
            margin-bottom: 1rem;
            border: 1px solid rgba(0,0,0,0.1);
            border-radius: .375rem;
            background-color: #f9f9f9;
            font-size: 1rem;
            &::placeholder {
                color: rgba(0,0,0,0.5);
            }
        }
        button {
            width: 100%;
            height: 3rem;
            padding: 0;
            margin: 1rem 0;
            border: none;
            border-radius: .25rem;
            box-shadow: 0 .25rem 0.5rem 0 rgba(0,145,255,0.32);
            font-size: 1rem;
            line-height: 3rem;
            color:#fff;
            background-color: #0091ff;
        }
        .bottom {
            display: flex;
            justify-content: center;
            align-items: center;
            .divi {
                color: rgba(0,0,0,0.5);
                font-size: .75rem;
                margin: 0 .75rem;
            }
        }
        input[type="button"] {
            border: 0;
            padding: 0;
            background-color: transparent;
            font-size: .875rem;
            color: rgba(0,0,0,0.5);
        }
    }
    
</style>