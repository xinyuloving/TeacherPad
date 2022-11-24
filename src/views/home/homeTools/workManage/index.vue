<template>
    <div class="index">
        <div class="head">
            <TButton class="btn1" @touch="goHome"> 首页 </TButton>
            <TButton class="btn2"> 作业助手 </TButton>
        </div>
        <div class="con">
            <div class="con-head">
                <span class="title">作业列表</span>
            </div>
            <div class="con-main">
                <transition name="fade" mode="out-in">
                    <router-view />
                </transition>
            </div>
        </div>
    </div>
</template>

<script>
import TButton from "@/components/FunctionalComp/TButton.vue";
export default {
    components: {
        TButton,
    },
    methods: {
        goHome() {
            this.$router.push({ name: "Home" });
        },
    },
};
</script>

<style lang="less" scoped>
.index {
    width: 100%;
    height: 100%;
    padding: 0.25rem 0.52rem;
    display: flex;
    flex-direction: column;
    .head {
        height: 0.75rem;
        display: flex;
        margin-bottom: 0.1rem;
        .btn1 {
            width: 0.8rem;
            height: 0.6rem;
            font-size: 0.26rem;
            background: #ffffff;
            box-shadow: 0rem 0rem 0.1rem 0rem rgba(223, 223, 223, 0.5);
            border-radius: 0.08rem 0rem 0rem 0.08rem;
            font-weight: 400;
            color: #a8a8a8;
            margin: 0 0.1rem 0 0;
        }
        .btn2 {
            width: 1.3rem;
            height: 0.6rem;
            font-size: 0.26rem;
            background: #f4f8ff;
            border-radius: 0rem 0.08rem 0.08rem 0rem;
            border: 0.01rem solid #3e83f8;
            font-weight: 400;
            color: #3e83f8;
        }
    }
    .con {
        flex: 1;
        height: 9.27rem;
        background: #ffffff;
        border-radius: 0.21rem;
        padding: 0.38rem 0.68rem;
        display: flex;
        flex-direction: column;
        .con-head {
            display: flex;
            flex-direction: column;
            .title {
                font-size: 0.25rem;
                font-family: PingFangSC-Semibold, PingFang SC;
                font-weight: 600;
                color: #333333;
                margin-bottom: 0.13rem;
            }
        }
        .con-main {
            flex: 1;
            .fade-enter-active,
            .fade-leave-avtive {
                transition: opacity 1s;
            }
            .fade-enter,
            .fade-leave-to {
                opacity: 0;
            }
        }
    }
}
</style>