<template>
    <div class="timer" v-drag>
        <div
            :class="[
                'count-item',
                {
                    active: s <= 5,
                },
            ]"
        >
            <span>{{ firstItem }}</span>
        </div>
        <div
            :class="[
                'count-item',
                {
                    active: s <= 5,
                },
            ]"
        >
            <span>{{ secondItem }}</span>
        </div>
        <div class="colon">
            <span>:</span>
        </div>
        <div
            :class="[
                'count-item',
                {
                    active: s <= 5,
                },
            ]"
        >
            <span>{{ thirdItem }}</span>
        </div>
        <div
            :class="[
                'count-item',
                {
                    active: s <= 5,
                },
            ]"
        >
            <span>{{ fourthItem }}</span>
        </div>
        <span class="close" v-touch="close">
            <i class="iconfont icon-close"></i>
        </span>
    </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
const { mapState, mapMutations } = createNamespacedHelpers("cloudClassroom");
import sendMessage from "@/utils/sendMessage";
import drag from "@/directive/drag";
import { insertDom } from "@/utils/util";
let countDownTimer;
export default {
    directives: {
        drag,
    },
    data() {
        return {
            firstItem: 0,
            secondItem: 0,
            thirdItem: 0,
            fourthItem: 0,
            s: 0,
        };
    },
    computed: {
        ...mapState({
            time: (state) => state.toolbar.timer.time,
        }),
    },
    created() {
        this.firstItem = this.time[0];
        this.secondItem = this.time[1];
        this.thirdItem = this.time[2];
        this.fourthItem = this.time[3];
        this.s =
            this.firstItem * 600 +
            this.secondItem * 60 +
            this.thirdItem * 10 +
            this.fourthItem;
        console.log(this.s);
        countDownTimer = setInterval(() => {
            this.s--;
            if (this.s === 0) {
                clearInterval(countDownTimer);
                this.setState({ key: "timerVisible", value: false });
                this.toolbarSet({ objKey: "weakIdObj", key: 23, value: false });
            }
            this.formatTime();
        }, 1000);
    },
    mounted() {
        insertDom(this.$el, this.$parent.$el);
    },
    methods: {
        ...mapMutations({
            setState: "toolbar/timer/setState",
            resetState: "toolbar/timer/resetState",
            toolbarSet: "toolbar/setState",
        }),
        formatTime() {
            // 将时间转换成秒
            const f = parseInt(this.s / 60); // 前两位
            const t = this.s - f * 60; // 后两位

            const str1 = f >= 10 ? `${f}` : `0${f}`;
            const str2 = t >= 10 ? `${t}` : `0${t}`;

            this.firstItem = str1[0];
            this.secondItem = str1[1];
            this.thirdItem = str2[0];
            this.fourthItem = str2[1];
        },
        async close() {
            try {
                const data = {
                    content: "ccl_2",
                    extension: JSON.stringify({ flag: 0 }),
                };
                await sendMessage(data);
                this.resetState();
                this.toolbarSet({ objKey: "weakIdObj", key: 23, value: false });
            } catch (error) {
                this.$message({
                    type: "error",
                    message: "定时器关闭失败，请重新尝试",
                });
            }
        },
    },
    beforeDestroy() {
        clearInterval(countDownTimer);
    },
};
</script>

<style lang="less" scoped>
.timer {
    position: fixed;
    // top: 0.58rem;
    top: 1.5rem;
    right: 0.73rem;
    z-index: 12;
    width: 3.59rem;
    height: 2.04rem;
    background: #24242c;
    box-shadow: 0rem 0.04rem 0.18rem 0rem rgba(24, 22, 34, 0.6);
    border-radius: 0.16rem;
    border: 0.02rem solid #4d4d5d;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 0.32rem;
    .count-item {
        width: 0.58rem;
        height: 0.85rem;
        background: #595972;
        border-radius: 0.08rem;
        display: flex;
        justify-content: center;
        align-items: center;
        transition: background 0.3s;
        span {
            font-size: 0.5rem;
            font-weight: 600;
            color: #ffffff;
        }
    }
    .active {
        background: #d14a4e;
    }
    .colon {
        span {
            font-size: 0.5rem;
            font-weight: 600;
            color: #ffffff;
        }
    }
    .close {
        width: 0.42rem;
        height: 0.42rem;
        border-radius: 50%;
        position: absolute;
        top: -0.21rem;
        right: -0.21rem;
        background: #fc886c;
        display: flex;
        justify-content: center;
        align-items: center;
        .iconfont {
            font-size: 0.34rem;
            color: #fff;
        }
    }
}
</style>