<template>
    <div class="timer_main">
        <!-- <div class="main-con">
            <input
                type="text"
                maxlength="1"
                v-for="item in options.slice(0, 2)"
                :key="item.id"
                :placeholder="item.placeholder"
                v-model.trim="item.value"
                @focus="
                    () => {
                        handleFocus(item.id);
                    }
                "
                @blur="
                    () => {
                        handleBlur(item.id);
                    }
                "
            />
            <span>:</span>
            <input
                type="text"
                maxlength="1"
                v-for="item in options.slice(2)"
                :key="item.id"
                :placeholder="item.placeholder"
                v-model.trim="item.value"
                @focus="
                    () => {
                        handleFocus(item.id);
                    }
                "
                @blur="
                    () => {
                        handleBlur(item.id);
                    }
                "
            />
        </div> -->
        <div class="main-con">
            <ScrollPicker
                v-for="item in options.slice(0, 2)"
                :key="item.id"
                :options="item.options"
                :value.sync="item.value"
            />
            <span>:</span>
            <ScrollPicker
                v-for="item in options.slice(2)"
                :key="item.id"
                :options="item.options"
                :value.sync="item.value"
            />
        </div>
        <div class="footer-con">
            <TButton class="cancel" @click="cancel"> 取消 </TButton>
            <TButton class="confirm" @click="confirm"> 确定 </TButton>
        </div>
    </div>
</template>


<script>
import { createNamespacedHelpers } from "vuex";
const { mapMutations } = createNamespacedHelpers("cloudClassroom");
import TButton from "@/components/FunctionalComp/TButton.vue";
import sendMessage from "@/utils/sendMessage";
import ScrollPicker from "./ScrollPicker.vue";
export default {
    components: {
        TButton,
        ScrollPicker,
    },
    data() {
        return {
            options: [
                {
                    id: 1,
                    value: 0,
                    options: [0, 1, 2, 3, 4, 5],
                },
                {
                    id: 2,
                    value: 0,
                    options: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
                },
                {
                    id: 3,
                    value: 0,
                    options: [0, 1, 2, 3, 4, 5],
                },
                {
                    id: 4,
                    value: 0,
                    options: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
                },
            ],
        };
    },
    methods: {
        ...mapMutations({
            setState: "toolbar/timer/setState",
            toolbarSet: "toolbar/setState",
            handleDisabled: "toolbar/handleDisabled",
        }),
        // handleFocus(id) {
        //     // 获得焦点处理事件
        //     const t = this.options.find((item) => item.id === id);
        //     t.placeholder = "";
        // },
        // handleBlur(id) {
        //     // 失去焦点的处理事件
        //     const t = this.options.find((item) => item.id === id);
        //     const num = Number(t.value);
        //     t.placeholder = 0;

        //     if (!num) {
        //         t.value = "";
        //         return;
        //     }

        //     switch (id) {
        //         case 1:
        //             if (num > 5) t.value = 5;
        //             break;
        //         case 3:
        //             if (num > 5) t.value = 5;
        //             break;
        //         default:
        //             break;
        //     }
        // },
        async confirm() {
            // 确认
            const temArr = [];
            let flag = false;
            for (let i = 0; i < this.options.length; i++) {
                const e = this.options[i];
                // const num = Number(e.value);
                // if (Object.is(num, NaN)) return; // 避免用户输入一个非数字的值的时候，直接点击确认
                if (e.value !== 0 && !flag) flag = true;
                temArr.push(e.value);
            }
            // if (temArr[0] > 5 || temArr[2] > 5) return;

            console.log(temArr);

            if (flag) {
                try {
                    const extension = {
                        flag: 1, // 开启定时器
                        content: temArr,
                    };
                    await sendMessage({
                        content: "ccl_2",
                        extension: JSON.stringify(extension),
                    });
                    this.setState({ key: "time", value: temArr });

                    this.handleDisabled();
                    this.toolbarSet({
                        objKey: "weakIdObj",
                        key: 23,
                        value: true,
                    });
                    this.cancel();
                    this.setState({ key: "timerVisible", value: true });
                    this.toolbarSet({ key: "isActive", value: false });
                    // 看板
                    this.$store.dispatch("inCloudClassroom/dataRecords", {
                        type: "timer",
                    });
                    // 埋点
                    this.data_triggerEvent(
                        {
                            eventId: "initiatingFun",
                            logValue: "4",
                        },
                        true
                    );
                } catch (error) {
                    this.$message({
                        type: "error",
                        message: "设置定时器失败，请重新尝试",
                    });
                }
            } else {
                this.$message({
                    type: "warning",
                    message: "您还没有设置时间",
                });
                return;
            }
        },
        cancel() {
            // 取消
            this.setState({ key: "timerDialogVisible", value: false });
            this.toolbarSet({ key: "childrenActive", value: -1 });
        },
    },
};
</script>

<style lang="less" scoped>
.timer_main {
    width: 100%;
    height: 100%;
    .main-con {
        width: 100%;
        height: 3.3rem;
        padding: 0.6rem 1.79rem 0;
        display: flex;
        justify-content: space-between;
        input {
            width: 1.33rem;
            height: 1.93rem;
            background: #595972;
            border-radius: 0.18rem;
            font-size: 1.13rem;
            font-weight: 600;
            color: #ffffff;
            text-align: center;
            &::placeholder {
                font-size: 1.13rem;
                font-weight: 600;
                color: #8b8b9c;
            }
        }
        span {
            height: 1.93rem;
            color: #fff;
            font-size: 1.13rem;
            font-weight: 600;
            display: flex;
            align-items: center;
        }
    }
    .footer-con {
        width: 100%;
        padding: 0 1.79rem;
        display: flex;
        justify-content: space-between;
        .cancel {
            opacity: 0.9;
            font-weight: 600;
            background: #fff;
            color: #3e83f8;
        }
        .confirm {
            opacity: 0.9;
            font-weight: 600;
            background: #3e83f8;
            color: #fff;
        }
    }
}
</style>