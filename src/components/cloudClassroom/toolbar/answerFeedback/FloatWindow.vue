<template>
    <div :class="['float-window', hide ? 'remove-height' : '']" v-drag>
        <!-- 答题浮窗 -->
        <div class="top">
            <div class="top-left">
                <span class="color-bar"></span>
                <span class="top-text">答题统计</span>
            </div>
            <div class="detail">
                <span v-show="hide" class="detail-text"
                    >答题人数：<span>{{ finishStudentList.length }}</span
                    >/{{ studentList.length }}</span
                >
            </div>
            <button class="top-right" v-touch="changeHide">
                {{ hide ? "展开" : "隐藏" }}
            </button>
        </div>
        <div class="container" v-show="!mappingHide">
            <div class="main">
                <SelectQuesChart />
            </div>
            <div class="bottom">
                <div class="bottom-t">
                    <span class="left">
                        答题人数：<span class="finish">{{
                            finishStudentList.length
                        }}</span
                        >/{{ studentList.length }}
                    </span>
                    <span class="right">
                        正确率：
                        <span class="finish">{{ correctRate }}</span>
                    </span>
                </div>
                <div class="bottom-b">
                    <!-- <button
                        v-touch="submit"
                        :class="[submitState ? 'disabled' : '']"
                    >
                        发布答案
                    </button> -->
                    <TButton class="btn" @touch="submit" :disabled="submitState"
                        >发布答案</TButton
                    >
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { createNamespacedHelpers, mapGetters } from "vuex";
const { mapState, mapMutations, mapActions } =
    createNamespacedHelpers("cloudClassroom");
import SelectQuesChart from "@/components/cloudClassroom/toolbar/answerFeedback/SelectQuesChart.vue";
import TButton from "@/components/FunctionalComp/TButton.vue";

import drag from "@/directive/drag";
export default {
    components: {
        SelectQuesChart,
        TButton,
    },
    directives: {
        drag,
    },
    computed: {
        ...mapState({
            strongId: (state) => state.toolbar.strongId,
            choiceFinishStudentList: (state) =>
                state.toolbar.choice.finishStudentList,
            judgeFinishStudentList: (state) =>
                state.toolbar.judge.finishStudentList,
            submitState: (state) => state.toolbar.floatWindow.submitState, // 是否发布了答案
            hide: (state) => state.toolbar.floatWindow.hide, // 浮窗是否隐藏
            mappingHide: (state) => state.toolbar.floatWindow.mappingHide, // 隐藏动画
        }),
        finishStudentList() {
            return this.strongId === 11
                ? this.choiceFinishStudentList
                : this.strongId === 12
                ? this.judgeFinishStudentList
                : [];
        },
        ...mapGetters({
            choiceCorrectRate: "cloudClassroom/toolbar/choice/correctRate",
            judgeCorrectRate: "cloudClassroom/toolbar/judge/correctRate",
            studentList: "studentList",
        }),
        correctRate() {
            if (this.strongId === 11) {
                return this.choiceCorrectRate;
            } else if (this.strongId === 12) {
                return this.judgeCorrectRate;
            }
        },
    },
    methods: {
        ...mapMutations({
            choiceSet: "toolbar/choice/setState",
            judgeSet: "toolbar/judge/setState",
            answerSet: "toolbar/answer/setState",
        }),
        ...mapActions({
            changeFloatWindowHide: "toolbar/floatWindow/changeFloatWindowHide",
        }),
        submit() {
            if (!this.submitState) {
                // 如果还没有发布，点击才有效
                if (this.strongId === 11) {
                    // this.openDialog({ name: "choice", flag: false });
                    this.choiceSet({ key: "visible", value: true });
                    this.choiceSet({ key: "flag", value: false });
                } else if (this.strongId === 12) {
                    this.judgeSet({ key: "visible", value: true });
                    this.judgeSet({ key: "flag", value: false });
                }
            }
        },
        changeHide() {
            if (!this.submitState) {
                this.changeFloatWindowHide();
            } else {
                // this.answerSet({ key: "visible", value: true });
                this.answerSet({ key: "answerHide", value: false });
            }
        },
    },
};
</script>

<style lang="less" scoped>
.float-window {
    position: absolute;
    right: 0.5rem;
    top: 0.5rem;
    z-index: 5;
    width: 5.72rem;
    height: 6.66rem;
    background: #ffffff;
    border-radius: 0.17rem;
    padding: 0.17rem 0.44rem 0.33rem;
    display: flex;
    flex-direction: column;
    transition: all 0.3s;
    box-shadow: 0rem 0rem 0.1rem 0rem #dfe7f2;
    .top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        // align-items: flex-end;
        height: 0.38rem;

        .top-left {
            display: flex;
            align-items: center;
            .color-bar {
                width: 0.04rem;
                height: 0.24rem;
                background: #3e83f8;
                border-radius: 0.02rem;
                margin-right: 0.07rem;
            }
            .top-text {
                font-size: 0.25rem;
                font-weight: 500;
                color: #333333;
            }
        }
        .detail {
            flex: 1;
            // height: 100%;
            padding: 0 0.6rem 0 0.2rem;
            // display: flex;
            // align-items: center;
            .detail-text {
                font-size: 0.21rem;
                font-weight: 500;
                color: #666666;
                span {
                    color: #3e83f8;
                }
            }
        }
        .top-right {
            width: 0.94rem;
            // height: 0.38rem;
            height: 100%;
            background: rgba(62, 131, 248, 0.1);
            border-radius: 0.04rem;
            border: 0.01rem solid #3e83f8;
            font-size: 0.17rem;
            font-weight: 500;
            color: #3e83f8;
        }
    }
    .container {
        width: 100%;
        // height: 100%;
        // height: calc(100% - 0.38rem);
        flex: 1;
        display: flex;
        flex-direction: column;
        .main {
            flex: 1;
            padding: 0.25rem 0;
        }
        .bottom {
            padding: 0 0.6rem;
            display: flex;
            flex-direction: column;
            .bottom-t {
                display: flex;
                justify-content: space-between;
                margin-bottom: 0.29rem;
                .left,
                .right {
                    font-size: 0.21rem;
                    font-weight: 500;
                    color: #666666;
                    .finish {
                        color: #3e83f8;
                    }
                }
            }
            .bottom-b {
                display: flex;
                justify-content: center;
                .btn {
                    width: 1.33rem;
                    height: 0.42rem;
                    background: #3e83f8;
                    border-radius: 0.04rem;
                    font-size: 0.17rem;
                    font-weight: 600;
                    color: #ffffff;
                    transition: background 0.3s;
                }
                .disabled {
                    background: #86aae8;
                }
            }
        }
    }
}
.remove-height {
    height: 0.75rem;
    padding-bottom: 0.17rem;
}
</style>