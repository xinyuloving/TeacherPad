<template>
    <div class="http404-container">
        <img class="http404-img" src="@/assets/img/404.png" alt="" />
        <span class="http404-text">抱歉，页面不存在</span>
        <TButton class="http404-btn" @touch="$router.back()">返回上页</TButton>
        <!-- <a class="http404-btn" href="/teacher">回到首页</a> -->
    </div>
</template>

<script>
import TButton from "@/components/FunctionalComp/TButton.vue";
export default {
    components: { TButton },
};
</script>

<style lang="less" scoped>
.http404-container {
    width: 100%;
    height: 100%;
    background: #f4f9ff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .http404-img {
        width: 2.73rem;
        height: 2.19rem;
        margin-bottom: 0.2rem;
    }
    .http404-text {
        font-size: 0.26rem;
        font-weight: 400;
        color: #666666;
        margin-bottom: 0.35rem;
    }
    .http404-btn {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 1.83rem;
        height: 0.55rem;
        background: #2499ff;
        border-radius: 0.09rem;
        font-size: 0.26rem;
        font-weight: 400;
        color: #ffffff;
    }
}
</style>