<template>
    <div class="choice_main">
        <div class="head_add_courseware">
            <span class="d-head">{{ flag ? "设置选项" : "设置答案" }}</span>
        </div>
        <div class="main-con">
            <div class="main-top">
                <ul
                    class="options-group"
                    :style="{
                        paddingTop:
                            showOptions.length <= 4 ? '0.5rem' : '0.25rem',
                    }"
                >
                    <li
                        :class="['option', item.state === 1 ? 'active' : '']"
                        v-for="(item, index) in showOptions"
                        :key="index"
                        v-touch="
                            () => {
                                optionTouch(index);
                            }
                        "
                    >
                        <template v-if="flag">
                            <span
                                class="remove_btn"
                                v-show="
                                    index + 1 === showOptions.length &&
                                    showOptions.length > 2
                                "
                                v-touch="removeOption"
                            >
                                <i></i>
                            </span>
                        </template>

                        <span class="option_text">{{ item.content }}</span>
                    </li>
                    <li class="option add_btn" v-touch="addOption" v-if="flag">
                        <span class="option_text">+选项</span>
                    </li>
                </ul>
            </div>
            <div class="other" v-if="flag">
                <label for="choiceAll">
                    <input
                        type="checkbox"
                        id="choiceAll"
                        @change="changeChoice"
                    />
                    <span class="my-checkbox">
                        <span></span>
                    </span>
                    <span class="label-text">是否支持多选</span>
                </label>
            </div>
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
    data() {
        return {
            options: [
                {
                    content: "A",
                    selectNum: 0, // 选择的人数
                    studentIdList: [],
                    state: 0, // 0 表示正常，1表示正确选项
                },
                {
                    content: "B",
                    selectNum: 0, // 选择的人数
                    studentIdList: [],
                    state: 0,
                },
                {
                    content: "C",
                    selectNum: 0, // 选择的人数
                    studentIdList: [],
                    state: 0,
                },
                {
                    content: "D",
                    selectNum: 0, // 选择的人数
                    studentIdList: [],
                    state: 0,
                },
                {
                    content: "E",
                    selectNum: 0, // 选择的人数
                    studentIdList: [],
                    state: 0,
                },
                {
                    content: "F",
                    selectNum: 0, // 选择的人数
                    studentIdList: [],
                    state: 0,
                },
                {
                    content: "G",
                    selectNum: 0, // 选择的人数
                    studentIdList: [],
                    state: 0,
                },
                {
                    content: "H",
                    selectNum: 0, // 选择的人数
                    studentIdList: [],
                    state: 0,
                },
            ], // 老师在发布题目前 选择的选项
            singleOrMult: false, // 单选或多选， false 表示单选，true 表示多选
            optionNum: 4, // 选项个数
        };
    },
    computed: {
        ...mapState({
            flag: (state) => state.toolbar.choice.flag, // true 表示 设置选项的时候打开的，false 表示 设置答案的时候打开的
            teacherSetOptions: (state) => state.toolbar.choice.options, // 老师设置的选项
            storeSingleOrMult: (state) => state.toolbar.choice.singleOrMult, // store 中老师设置之后的单选或多选 false 表示单选，true 表示多选false 表示单选，true 表示多选
        }),
        showOptions() {
            if (this.flag) {
                return this.options.slice(0, this.optionNum);
            } else {
                return this.teacherSetOptions;
            }
        },
        disabled() {
            if (this.flag) {
                return false;
            } else {
                const stateArr = this.teacherSetOptions.filter(
                    (item) => item.state === 1
                );
                return stateArr.length ? false : true;
            }
        },
    },
    methods: {
        ...mapMutations({
            floatWindowSet: "toolbar/floatWindow/setState",
            choiceSet: "toolbar/choice/setState",
            toolSet: "toolbar/setState",
            answerSet: "toolbar/answer/setState",
            setChoiceOptionState: "toolbar/choice/setChoiceOptionState",
            classSet: "setState",
            handleDisabled: "toolbar/handleDisabled",
        }),
        ...mapActions({
            changeFloatWindowHide: "toolbar/floatWindow/changeFloatWindowHide",
        }),
        addOption() {
            // 添加选项
            if (this.optionNum < 8) this.optionNum++;
        },
        removeOption() {
            // 删除选项
            if (this.optionNum > 2) this.optionNum--;
        },
        close() {
            // 关闭 弹窗
            this.$emit("close");
        },
        changeChoice() {
            // 单选按钮状态改变的事件
            this.singleOrMult = !this.singleOrMult;
        },
        optionTouch(index) {
            // 选择题每个选项的点击处理函数 -->  只有在 设置答案的时候才可以点击
            if (!this.flag) {
                this.setChoiceOptionState(index);
                // if (this.disabled) this.disabled = false;
            }
        },
        async submit() {
            // 提交
            if (this.flag) {
                try {
                    // 设置选项
                    this.choiceSet({
                        key: "singleOrMult",
                        value: this.singleOrMult,
                    });
                    this.choiceSet({
                        key: "options",
                        value: this.showOptions,
                    });
                    // 发送消息
                    const extension = {
                        flag: 1, // 表示开启还是关闭 0 关闭，1 开启，2 设置正确答案
                        optionsNum: this.optionNum, // 选项的个数：5  --> a b c d e
                        singleOrMult: this.singleOrMult, // 多选还是单选，true 为单选，false为多选
                    };
                    await sendMessage({
                        content: "ccl_3",
                        extension: JSON.stringify(extension),
                    });
                    this.handleDisabled();
                    this.close();
                    this.toolSet({ key: "isActive", value: false });
                    this.classSet({ key: "toolbarVisible", value: false });
                    this.choiceSet({ key: "options", value: this.showOptions });
                    this.floatWindowSet({ key: "visible", value: true });
                    // 看板
                    this.$store.dispatch("inCloudClassroom/dataRecords", {
                        type: "choice",
                    });
                    // 埋点
                    this.data_triggerEvent(
                        {
                            eventId: "startAnswer",
                            logValue: "2",
                        },
                        true
                    );
                } catch (error) {
                    console.log(error);
                    this.$message({
                        type: "error",
                        message: "发起选择题失败，请重新尝试",
                    });
                }
            } else {
                // 设置答案
                let correctAnswer; // 多选为数组，单选为字符串
                if (this.storeSingleOrMult) {
                    // 多选
                    const temArr = [];
                    for (let i = 0; i < this.teacherSetOptions.length; i++) {
                        const e = this.teacherSetOptions[i];
                        if (e.state === 1) {
                            temArr.push(e.content);
                        }
                    }
                    if (!temArr.length) {
                        // 没有选择
                        return;
                    }
                    correctAnswer = temArr;
                } else {
                    // 单选
                    const e = this.teacherSetOptions.find(
                        (item) => item.state === 1
                    );
                    if (e) {
                        correctAnswer = e.content;
                    } else {
                        return;
                    }
                }
                try {
                    const data = {
                        content: "ccl_3",
                        extension: JSON.stringify({ flag: 2, correctAnswer }),
                    };
                    this.choiceSet({
                        key: "correctAnswer",
                        value: correctAnswer,
                    });
                    await sendMessage(data);

                    this.changeFloatWindowHide();
                    this.floatWindowSet({ key: "submitState", value: true });
                    this.close();
                    this.answerSet({ key: "visible", value: true });
                } catch (error) {
                    this.$message({
                        type: "error",
                        message: "设置答案失败，请重新尝试",
                    });
                }
            }
        },
    },
};
</script>

<style lang="less" scoped>
@padding1: 0 0.34rem;
.choice_main {
    width: 100%;
    // .head-con {
    //     width: 100%;
    //     height: 0.68rem;
    //     display: flex;
    //     justify-content: center;
    //     align-items: center;
    //     border-bottom: 0.01rem solid #dedede;
    //     position: relative;
    //     .d-head {
    //         font-size: 0.26rem;
    //         font-weight: 600;
    //         color: #333333;
    //     }
    //     .my-icon {
    //         position: absolute;
    //         right: 0;
    //         top: 50%;
    //         transform: translateY(-50%);
    //         margin-right: 0.3rem;
    //         font-size: 0.35rem;
    //     }
    // }
    .main-con {
        width: 100%;
        // height: 100%;
        height: 3.88rem;
        padding: @padding1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .main-top {
            height: 3.09rem;
            .options-group {
                width: 100%;
                height: 100%;
                display: flex;
                justify-content: flex-start;
                align-content: space-between;
                flex-wrap: wrap;
                transition: padding-top 0.3s;
                .option {
                    width: 1.25rem;
                    height: 1.25rem;
                    background: #ffffff;
                    margin: 0 0.16rem;
                    border-radius: 0.15rem;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    transition: background 0.3s;
                    position: relative;
                    .option_text {
                        font-size: 0.69rem;
                        font-weight: 400;
                        color: #333333;
                        transition: color 0.3s;
                    }
                    .remove_btn {
                        width: 0.32rem;
                        height: 0.32rem;
                        background: #f55f5f;
                        position: absolute;
                        top: -6%;
                        right: -6%;
                        border-radius: 50%;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        i {
                            height: 0.046rem;
                            width: 60%;
                            background: #fff;
                        }
                    }
                }
                .add_btn {
                    .option_text {
                        font-size: 0.32rem;
                        font-weight: 600;
                    }
                }
                .active {
                    background: #3e83f8;
                    .option_text {
                        color: #fff;
                    }
                }
            }
        }
        .other {
            margin-bottom: 0.2rem;
            display: flex;
            justify-content: flex-end;
            padding: @padding1;
            label {
                display: flex;
                align-items: center;
                .label-text {
                    font-size: 0.21rem;
                    font-weight: 400;
                    color: #333333;
                }
                input[type="checkbox"] {
                    display: none;
                }
                .my-checkbox {
                    width: 0.3rem;
                    height: 0.3rem;
                    border: 0.02rem solid #999999;
                    border-radius: 50%;
                    cursor: pointer;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    margin-right: 0.1rem;
                    span {
                        width: 0.2rem;
                        height: 0.2rem;
                        border-radius: 50%;
                        transition: background 0.3s;
                    }
                }
                input[type="checkbox"]:checked + .my-checkbox {
                    span {
                        background: #0bc75b;
                    }
                }
            }
        }
    }
    .footer-con {
        display: flex;
        justify-content: center;
        height: 1.16rem;
        .foot-btn {
            width: 7.58rem;
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