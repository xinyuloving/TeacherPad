<template>
    <div :class="['tool-bar', mapIsActive ? 'toolbar_active' : '']">
        <!-- 工具栏：该组件将store中的一些方法和数据整合到这个文件中了，通过依赖注入的方式传递给子组件需要的数据，但是存在一些需要解决的问题，暂时不使用 -->
        <div class="toolbar-con">
            <ul ref="toolUl">
                <li
                    v-for="(item, index) in toolList"
                    :key="item.id"
                    :class="{
                        'ul-item': true,
                        disabled:
                            item.type === 0
                                ? false
                                : item.type === 1
                                ? Boolean(strongId)
                                : weakIdObj[item.id],
                    }"
                    v-touch="
                        () => {
                            toolItemTouch({ id: item.id, index, item });
                        }
                    "
                    ref="toolItem"
                >
                    <span
                        :class="{
                            img_con: true,
                            img_con_active: toolActive === index,
                        }"
                    >
                        <img
                            :src="
                                require(`@/assets/img/cloudClassroom/toolbar/${
                                    item.id
                                }-${toolActive === index ? '1' : '0'}.png`)
                            "
                            alt=""
                        />
                        <i v-if="item.children" class="iconfont icon-arrow"></i>
                    </span>
                    <span class="text">{{ item.content }}</span>
                </li>
            </ul>
        </div>
        <transition name="scale">
            <div
                class="children-bar"
                v-show="showChildrenBar"
                :style="{
                    top: `${topDistance}px`,
                }"
            >
                <ul class="children-con" v-if="toolList[toolActive]">
                    <li
                        v-for="(item, index) in toolList[toolActive].children"
                        :key="item.id"
                        :class="{
                            'ul-item': true,
                            disabled:
                                item.type === 0
                                    ? false
                                    : item.type === 1
                                    ? Boolean(strongId)
                                    : weakIdObj[item.id],
                        }"
                        v-touch="
                            () => {
                                childItemTouch({ id: item.id, index, item });
                            }
                        "
                    >
                        <span
                            :class="{
                                img_con: true,
                                img_con_active: childrenActive === index,
                            }"
                        >
                            <img
                                :src="
                                    require(`@/assets/img/cloudClassroom/toolbar/${
                                        item.id
                                    }-${
                                        childrenActive === index ? '1' : '0'
                                    }.png`)
                                "
                                alt=""
                            />
                        </span>
                        <span class="text">{{ item.content }}</span>
                    </li>
                </ul>
                <div class="arrow"></div>
            </div>
        </transition>
        <div class="arrow-bar" v-touch="changeActive">
            <i class="iconfont icon-arrow1"></i>
        </div>

        <!-- 随堂测试 -->
        <ClassTestDialog />
        <ClassTestPreview />
        <!-- 内容分发 -->
        <DistributeDialog />
        <!-- 结束上课弹窗 -->
        <EndClass />
        <!-- 判断题 -->
        <Judge />
        <!-- 选择题 -->
        <Choice />
        <!-- 抢答器 -->
        <Responder />
        <!-- 随机选人 -->
        <RandomPick />
        <!-- 定时器弹窗 -->
        <TimerDialog />
        <!-- 导入课件 -->
        <AddCourseware />
    </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
const { mapState, mapMutations, mapActions } =
    createNamespacedHelpers("cloudClassroom");
import ClassTestDialog from "@/components/cloudClassroom/toolbar/classTest/Index.vue";
import ClassTestPreview from "@/components/cloudClassroom/toolbar/classTest/Preview.vue";
import DistributeDialog from "@/components/cloudClassroom/toolbar/distribute/IndexDialog.vue";
import EndClass from "@/components/cloudClassroom/toolbar/EndClass.vue";
import Judge from "@/components/cloudClassroom/toolbar/judge/Index.vue";
import Choice from "@/components/cloudClassroom/toolbar/choice/Index.vue";
import Responder from "@/components/cloudClassroom/toolbar/responder/Index.vue";
import RandomPick from "@/components/cloudClassroom/toolbar/randomPick/Index.vue";
import TimerDialog from "@/components/cloudClassroom/toolbar/timer/Index.vue";
import AddCourseware from "@/components/cloudClassroom/toolbar/addCourseware/Index.vue";
let touchItem;
export default {
    components: {
        ClassTestDialog,
        ClassTestPreview,
        DistributeDialog,
        EndClass,
        Judge,
        Choice,
        Responder,
        RandomPick,
        TimerDialog,
        AddCourseware,
    },
    data() {
        return {
            mapIsActive: false, // 映射自store中的isActive，实际应控制isActive的true或false来控制展示或消失
            strongId: 0, // 强id的工具互斥，即当他不为零的时候禁用所有互斥工具
            weakIdObj: {
                23: false, // 定时器
                4: false, // 内容分发
            }, // 弱id的工具使用后禁用自身，该对象是以弱工具的id为键，值为Boolean
        };
    },
    computed: {
        ...mapState({
            toolList: (state) => state.toolbar.toolList,
            isActive: (state) => state.toolbar.isActive,
            toolActive: (state) => state.toolbar.toolActive,
            childrenActive: (state) => state.toolbar.childrenActive,
            // strongId: (state) => state.toolbar.strongId,
            // weakIdObj: (state) => state.toolbar.weakIdObj,
            ctBackVisible: (state) => state.toolbar.classTest.ctBackVisible,
            timerVisible: (state) => state.toolbar.timer.timerVisible,
        }),
        showChildrenBar() {
            const { toolList, toolActive } = this;
            return (
                toolList[toolActive] && Boolean(toolList[toolActive].children)
            );
        },
        topDistance() {
            // children 盒子 距离顶部的距离
            const { toolList, toolActive } = this;
            const target = toolList[toolActive];
            let top;
            if (target) {
                if (target.children) {
                    const li = this.$refs.toolItem[toolActive];
                    top = li.offsetTop - this.$refs.toolUl.offsetTop;
                }
            }
            return top;
        },
    },
    watch: {
        isActive: {
            handler(newValue) {
                if (newValue) {
                    this.mapIsActive = newValue;
                } else {
                    if (this.showChildrenBar) {
                        this.setState({ key: "childrenActive", value: -1 });
                        this.setState({ key: "toolActive", value: -1 });
                        setTimeout(() => {
                            this.mapIsActive = newValue;
                        }, 200);
                    } else {
                        this.setState({ key: "toolActive", value: -1 });
                        this.mapIsActive = newValue;
                    }
                }
            },
        },
    },
    methods: {
        ...mapMutations({
            setState: "toolbar/setState",
            setClassTestState: "toolbar/classTest/setState",
            setDistributeState: "toolbar/distribute/setState",
            setDistributeState: "toolbar/distribute/setState",
            setChoiceState: "toolbar/choice/setState",
            setJudgeState: "toolbar/judge/setState",
            setCloudClassroomState: "setState",
            setResponderState: "toolbar/responder/setState",
            setRandomState: "toolbar/random/setState",
            setTimerState: "toolbar/timer/setState",
            handleDisabled: "toolbar/handleDisabled",
        }),
        // ...mapActions({
        //     toolItemTouch: "toolbar/toolItemTouch",
        //     childItemTouch: "toolbar/childItemTouch",
        // }),
        changeActive() {
            // 改变 toolbar 的激活状态，控制工具栏展开和收回
            this.setState({ key: "isActive", value: !this.isActive });
        },
        toolItemTouch({ id, index, item }) {
            if (item.type === 1) {
                if (this.strongId) return;
            } else if (item.type === 2) {
                if (this.weakIdObj[item.id]) return;
            }

            touchItem = item;

            // 设置样式
            if (this.toolActive !== index) {
                this.setState({ key: "childrenActive", value: -1 });
                this.setState({ key: "toolActive", value: index });
            }

            switch (id) {
                case 3: {
                    // 随堂测试
                    this.setClassTestState({
                        key: "visible",
                        value: true,
                    });
                    break;
                }
                case 4: {
                    // 内容分发
                    this.setDistributeState({
                        key: "visible",
                        value: true,
                    });
                    break;
                }
                case 5: {
                    // 导入课件
                    this.setState({
                        key: "addCoursewareVisible",
                        value: true,
                    });
                    break;
                }
                case 6: {
                    // 结束上课
                    if (this.ctBackVisible) {
                        this.$tMessage(
                            { title: "请先结束随堂测试！", type: "error" },
                            () => {
                                this.setState({
                                    key: "toolActive",
                                    value: -1,
                                });
                            }
                        );
                        return;
                    }
                    this.setState({ key: "endClassVisible", value: true });
                    break;
                }
                default:
                    break;
            }
        },
        async childItemTouch({ id, index, item }) {
            if (item.type === 1) {
                if (this.strongId) return;
            } else if (item.type === 2) {
                if (this.weakIdObj[item.id]) return;
            }

            touchItem = item;

            // 设置样式
            this.setState({ key: "childrenActive", value: index });

            switch (id) {
                case 11: {
                    // 选择题
                    this.setChoiceState({ key: "visible", value: true });
                    this.setChoiceState({ key: "flag", value: true });
                    break;
                }
                case 12: {
                    // 判断题
                    this.setJudgeState({ key: "visible", value: true });
                    break;
                }
                case 21: {
                    // 抢答题
                    this.setCloudClassroomState({
                        key: "toolbarVisible",
                        value: false,
                    });
                    try {
                        await sendMessage({
                            content: "ccl_7",
                            extension: JSON.stringify({ flag: 1 }),
                        });
                        this.setResponderState({
                            key: "visible",
                            value: true,
                        });
                        this.handleDisabled();
                    } catch (error) {
                        this.$tMessage(
                            {
                                title: "发起抢答器失败！请重新尝试",
                                type: "error",
                            },
                            () => {
                                this.setState({
                                    key: "childrenActive",
                                    value: -1,
                                });
                            }
                        );
                    }

                    break;
                }
                case 22: {
                    // 随机点名
                    this.setRandomState({ key: "visible", value: true });
                    break;
                }
                case 23: {
                    // 计时器
                    if (!this.timerVisible)
                        this.setTimerState({
                            key: "timerDialogVisible",
                            value: true,
                        });
                    break;
                }
                default:
                    break;
            }
        },
        handleDisabled() {
            const { id, type } = touchItem;
            switch (type) {
                case 1: {
                    // 强禁用
                    if (this.strongId === 0) {
                        this.strongId = id;
                    }
                    break;
                }
                case 2: {
                    // 弱工具
                    if (!this.weakIdObj[id]) {
                        // 当前该弱工具已使用
                        this.weakIdObj[id] = true;
                    }
                    break;
                }

                default:
                    break;
            }
        },
    },
    provide() {
        return {
            handleDisabled: this.handleDisabled,
        };
    },
    beforeDestroy() {
        touchItem = undefined;
    },
};
</script>

<style lang="less" scoped>
.tool-bar {
    width: 1.92rem;
    height: 10.71rem;
    position: absolute;
    top: 50%;
    left: -1.92rem;
    z-index: 10;
    transform: translate(0%, -50%);
    transition: left 0.3s;
    padding: 0.4rem 0;
    background-color: #fff;
    box-shadow: 0rem 0rem 0.1rem 0rem #dfe7f2;
    border-radius: 0.1rem;
    .ul-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        cursor: pointer;
        // height: 1.4rem;
        .img_con {
            width: 1rem;
            height: 1rem;
            background: rgba(61, 127, 238, 0.1);
            margin-bottom: 0.08rem;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 50%;
            position: relative;
            transition: all 0.3s;
            img {
                width: 0.48rem;
                height: 0.48rem;
            }
        }
        .text {
            font-size: 0.25rem;
            font-weight: 600;
            color: #333333;
        }
        .img_con_active {
            background: rgba(61, 127, 238, 1);
        }
        &.disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
    }
    .toolbar-con {
        width: 100%;
        height: 100%;
        ul {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;
            .ul-item {
                .img_con {
                    .iconfont {
                        position: absolute;
                        right: -0.4rem;
                        font-size: 0.44rem;
                        color: #58595c;
                    }
                }
                &:last-child {
                    .img_con {
                        background: rgba(245, 108, 108, 0.1);
                    }
                    .img_con_active {
                        background: rgba(245, 108, 108, 1);
                    }
                }
            }
        }
    }
    .children-bar {
        width: 1.92rem;
        min-height: 3.54rem;
        background: #ffffff;
        box-shadow: 0rem 0rem 0.09rem 0rem #dfe7f2;
        border-radius: 0.1rem;
        position: absolute;
        right: -2.02rem;
        top: 0;
        transition: top 0.3s;
        padding: 0.4rem 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        .ul-item:not(:last-child) {
            margin-bottom: 0.31rem;
        }
        .arrow {
            position: absolute;
            left: 0;
            top: 0.9rem;
            &::before {
                content: "";
                display: block;
                width: 0;
                height: 0;
                border: 0.18rem solid;
                position: absolute;
                left: 50%;
                top: -2%;
                transform: translate(-50%, -50%);
                border-color: transparent;
                border-right-color: #fff;
                border-left-width: 0;
            }
        }
    }
    .arrow-bar {
        width: 1.1rem;
        height: 0.88rem;
        background: #ffffff;
        box-shadow: 0rem 0rem 0.09rem 0rem #dfe7f2;
        border-radius: 0rem 1.04rem 1.04rem 0rem;
        position: absolute;
        right: -1.1rem;
        bottom: 0;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        padding: 0 0.23rem;
        opacity: 0.5;
        transition: opacity 0.3s;
        .iconfont {
            font-size: 0.38rem;
            transform-origin: center;
            transition: transform 0.3s;
        }
    }
    .scale-enter,
    .scale-leave-to {
        opacity: 0.5;
        transform-origin: left center;
        transform: scaleX(0);
    }

    .scale-enter-active,
    .scale-leave-active {
        transition: all 0.3s;
    }
}
.toolbar_active {
    left: 0.1rem;
    .arrow-bar {
        opacity: 1;
        .iconfont {
            transform: rotate(180deg);
        }
    }
}
</style>