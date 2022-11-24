<template>
    <transition name="reward_drop">
        <div class="reward_pop_up" v-touch.self="closeDialog" v-if="visible">
            <!-- 奖励学生弹窗 -->
            <div class="main">
                <span class="text1">恭喜</span>
                <div
                    class="avatar-group"
                    v-if="rewardAvatar.length"
                    :style="{
                        width:
                            rewardAvatar.length === 1
                                ? '0.85rem'
                                : `${rewardAvatar.length * 0.76}rem`,
                    }"
                >
                    <!-- <img
                        v-for="(item, index) in rewardAvatar"
                        :key="index"
                        :src="item"
                        alt=""
                        :style="{ left: `${index * 0.75}rem`, zIndex: index }"
                    /> -->
                    <span
                        class="show_avatar"
                        v-for="(item, index) in rewardAvatar"
                        :key="index"
                        alt=""
                        :style="{ left: `${index * 0.7}rem`, zIndex: index }"
                        >{{ item.slice(0, 1) }}</span
                    >
                </div>
                <span>{{ rewardText }}获得一朵小红花</span>
                <img
                    class="flower"
                    src="@/assets/img/cloudClassroom/flower.png"
                    alt=""
                />
            </div>
        </div>
    </transition>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
const { mapState, mapMutations } = createNamespacedHelpers("cloudClassroom");
let rewardCloseTimer;
export default {
    computed: {
        ...mapState({
            rewardStudentList: (state) => state.reward.rewardStudentList,
            visible: (state) => state.reward.visible,
        }),
        rewardText() {
            return this.rewardStudentList.length === 1
                ? `${this.rewardStudentList[0].name}`
                : `${this.rewardStudentList[0].name}等`;
        },
        rewardAvatar() {
            return this.rewardStudentList.slice(0, 5).map((item) => item.name);
        },
    },
    watch: {
        visible(newValue) {
            if (newValue) {
                rewardCloseTimer = setTimeout(() => {
                    this.closeDialog();
                }, 2000);
            }
        },
    },
    methods: {
        ...mapMutations({
            setState: "reward/setState",
            resetState: "reward/resetState",
        }),
        closeDialog() {
            this.resetState();
            clearTimeout(rewardCloseTimer);
        },
    },
};
</script>

<style lang="less" scoped>
@trans1: all 0.3s;
.reward_pop_up {
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 999;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.6);
    .main {
        position: absolute;
        top: 1.63rem;
        left: 50%;
        // transform: translateX(-50%);
        transform: translate3d(-50%, 0, 0);
        min-width: 11.24rem;
        height: 1.98rem;
        background: #ffffff;
        border-radius: 0.21rem;
        display: flex;
        align-items: center;
        justify-content: center;
        // transition: top 0.3s;
        // .text1{
        //     width: 0.8rem;
        // }
        span {
            font-size: 0.31rem;
            font-weight: 600;
            color: #333333;
            // width: 0.6rem;
        }
        .avatar-group {
            margin: 0 0.38rem;
            height: 100%;
            position: relative;
            .show_avatar {
                width: 0.85rem;
                height: 0.85rem;
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                border-radius: 50%;
                display: flex;
                justify-content: center;
                align-items: center;
                background-color: #3e83f8;
                color: #fff;
                font-size: 0.46rem;
            }
            // img {
            //     width: 0.85rem;
            //     height: 0.85rem;
            //     position: absolute;
            //     top: 50%;
            //     transform: translateY(-50%);
            //     border-radius: 50%;
            // }
            // .img0 {
            //     left: 0;
            //     z-index: 1;
            // }
            // .img0 {
            //     left: 0;
            //     z-index: 1;
            // }
        }
        .flower {
            margin-left: 0.65rem;
            width: 0.71rem;
            height: 0.71rem;
        }
    }
    // .active {
    //     top: 1.63rem;
    // }
}

.reward_drop-enter,
.reward_drop-leave-to {
    background-color: rgba(0, 0, 0, 0);
    .main {
        top: -1.98rem;
    }
}

.reward_drop-enter-active,
.reward_drop-leave-active {
    transition: @trans1;
    .main {
        transition: @trans1;
    }
}
</style>