<template>
    <div
        :class="['barrage', {active: action}]"
        :style="{
            top: option.top,
        }"
        @transitionend="transitionend"
    >
        <div class="left">
            <span class="avatar">
                {{ option.name.slice(0, 1) }}
            </span>
        </div>
        <div class="right">
            <img src="@/assets/img/cloudClassroom/hand.png" alt="" />
            <span class="span-text"> {{ option.name }} 举手 </span>
        </div>
    </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
const { mapMutations } = createNamespacedHelpers("cloudClassroom");
export default {
    props: {
        option: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            action: false,
        };
    },
    mounted() {
        this.timer = setTimeout(() => {
            this.action = true;
            clearTimeout(this.timer);
        }, 30);
    },
    methods: {
        ...mapMutations({
            removeBarrageList: "removeBarrageList",
        }),
        transitionend() {
            this.removeBarrageList();
        },
    },
};
</script>

<style lang="less" scoped>
@blue1: #3e83f8;
.barrage {
    // min-width: 3rem;
    height: 0.73rem;
    // width: 2.85rem;
    background: rgba(0, 0, 0, 0.6);
    border-radius: 0.42rem;
    // position: absolute;
    position: fixed;
    right: 0;
    z-index: 13;
    // transform: translateX(100%);
    transform: translate3d(100%, 0, 0);
    transition: transform 8s linear;
    backface-visibility: hidden;
    perspective: 1000;
    padding: 0 0.17rem;
    display: flex;
    align-items: center;
    .left {
        margin-right: 0.17rem;
        .avatar {
            // width: 100%;
            // height: 100%;
            width: 0.5rem;
            height: 0.5rem;
            border-radius: 50%;
            background: @blue1;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 0.26rem;
            color: #fff;
        }
    }
    .right {
        height: 100%;
        display: flex;
        align-items: center;
        img {
            width: 0.22rem;
            height: 0.3rem;
            margin-right: 0.08rem;
            margin-top: 0.01rem;
        }
        .span-text {
            font-size: 0.29rem;
            font-weight: 500;
            color: #ffffff;
        }
    }
}
.active {
    // transform: translateX(-100vw);
    transform: translate3d(-100vw, 0, 0);
}
</style>