<template>
    <div class="judge_main">
        <div class="head_add_courseware">
            <span class="d-head">{{ flag ? "判断题" : "设置答案" }}</span>
        </div>
        <div class="main-con">
            <ul class="options-group">
                <li
                    v-for="(item, index) in options"
                    :key="item.id"
                    :class="['option', item.state === 1 ? 'active' : '']"
                    v-touch="
                        () => {
                            optionTouch(index);
                        }
                    "
                >
                    <i :class="['iconfont', item.icon]"></i>
                </li>
            </ul>
        </div>
        <div class="footer-con">
            <TButton class="foot-btn" @touch="submit" :disabled="disabled">
                <span>{{ flag ? "开始答题" : "确认" }}</span>
            </TButton>
        </div>
    </div>
</template>

<script>
import TButton from "@/components/FunctionalComp/TButton.vue";
import sendMessage from "@/utils/sendMessage";
import { createNamespacedHelpers } from "vuex";
const { mapMutations, mapState, mapActions } =
    createNamespacedHelpers("cloudClassroom");
export default {
    components: {
        TButton,
    },
    computed: {
        ...mapState({
            flag: (state) => state.toolbar.judge.flag, // true 表示 设置选项的时候打开的，false 表示 设置答案的时候打开的
            options: (state) => state.toolbar.judge.options,
        }),
        disabled() {
            if (this.flag) {
                return false;
            } else {
                const stateArr = this.options.filter(
                    (item) => item.state === 1
                );
                return stateArr.length ? false : true;
            }
        },
    },
    methods: {
        ...mapMutations({
            judgeSet: "toolbar/judge/setState",
            answerSet: "toolbar/answer/setState",
            floatWindowSet: "toolbar/floatWindow/setState",
            setJudgeOptionState: "toolbar/judge/setJudgeOptionState",
            toolSet: "toolbar/setState",
            classSet: "setState",
            handleDisabled: "toolbar/handleDisabled",
        }),
        ...mapActions({
            changeFloatWindowHide: "toolbar/floatWindow/changeFloatWindowHide",
        }),
        optionTouch(index) {
            // 选择题每个选项的点击处理函数 -->  只有在 设置答案的时候才可以点击
            if (!this.flag) this.setJudgeOptionState(index);
        },
        close() {
            // 关闭 弹窗
            this.$emit("close");
        },
        async submit() {
            // 提交
            if (this.flag) {
                // 开始答题
                // 发送消息
                try {
                    const extension = {
                        flag: 1, // 表示开启还是关闭
                    };
                    await sendMessage({
                        content: "ccl_4",
                        extension: JSON.stringify(extension),
                    });
                    this.handleDisabled();
                    this.close();
                    this.toolSet({ key: "isActive", value: false });
                    this.classSet({ key: "toolbarVisible", value: false });
                    this.floatWindowSet({ key: "visible", value: true });
                    // 看板
                    this.$store.dispatch("inCloudClassroom/dataRecords", {
                        type: "judge",
                    });
                    // 埋点
                    this.data_triggerEvent(
                        {
                            eventId: "startAnswer",
                            logValue: "1",
                        },
                        true
                    );
                } catch (error) {
                    this.$message({
                        type: "error",
                        message: "发起判断题失败，请重新尝试",
                    });
                }
            } else {
                // 设置答案
                const e = this.options.find((item) => item.state === 1);
                if (!e) {
                    // 老师没选择 但是点击 提交的情况下
                    return;
                }
                try {
                    const data = {
                        content: "ccl_4",
                        extension: JSON.stringify({
                            flag: 2, // 0 表示关闭，1表示开启，2表示设置判断题答案
                            correctId: e.id,
                        }),
                    };

                    this.judgeSet({ key: "correctAnswer", value: e.id });
                    await sendMessage(data);
                    this.changeFloatWindowHide();
                    this.floatWindowSet({ key: "submitState", value: true });
                    this.close();
                    this.answerSet({ key: "visible", value: true });
                } catch (error) {
                    this.$message({
                        type: "error",
                        message: "设置判断题失败，请重新尝试",
                    });
                }
            }
        },
    },
};
</script>

<style lang="less" scoped>
.judge_main {
    width: 100%;
    .head_add_courseware {
        width: 100%;
        height: 0.76rem;
        // display: flex;
        // justify-content: center;
        // align-items: center;
        // border-bottom: 0.01rem solid #dedede;
        // position: relative;
        // .d-head {
        //     font-size: 0.26rem;
        //     font-weight: 600;
        //     color: #333333;
        // }
        // .my-icon {
        //     position: absolute;
        //     right: 0;
        //     top: 50%;
        //     transform: translateY(-50%);
        //     margin-right: 0.3rem;
        //     font-size: 0.35rem;
        // }
    }
    .main-con {
        width: 100%;
        height: 3.31rem;
        .options-group {
            width: 100%;
            height: 100%;
            padding: 0 1.63rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .option {
                width: 2rem;
                height: 2rem;
                background: #ffffff;
                border-radius: 0.23rem;
                display: flex;
                justify-content: center;
                align-items: center;
                transition: background 0.3s;
                .iconfont {
                    font-size: 1.1rem;
                    font-weight: 400;
                    color: #3e83f8;
                    transition: color 0.3s;
                }
            }
            .active {
                background: #3e83f8;
                .iconfont {
                    color: #fff;
                }
            }
        }
    }
    .footer-con {
        display: flex;
        justify-content: center;
        height: 1.16rem;
        .foot-btn {
            width: 6.38rem;
            height: 0.83rem;
            background: #3e83f8;
            border-radius: 0.08rem;
            span {
                font-size: 0.21rem;
                font-weight: 600;
                color: #ffffff;
            }
        }
    }
}
</style>