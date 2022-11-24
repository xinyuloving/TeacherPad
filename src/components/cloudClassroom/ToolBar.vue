<template>
    <div :class="['tool-bar', mapIsActive ? 'toolbar_active' : '']">
        <!-- 工具栏 -->
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
        };
    },
    computed: {
        ...mapState({
            toolList: (state) => state.toolbar.toolList,
            isActive: (state) => state.toolbar.isActive,
            toolActive: (state) => state.toolbar.toolActive,
            childrenActive: (state) => state.toolbar.childrenActive,
            strongId: (state) => state.toolbar.strongId,
            weakIdObj: (state) => state.toolbar.weakIdObj,
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
        // setDisabled() {
        //     // 设置按钮禁用
        //     const { toolList, toolActive, childrenActive } = this;
        //     const strongIds = [11, 12, 21, 22, 3];
        //     const weakIds = [23, 4];
        //     if (toolActive !== -1) {
        //         const childrenIndexs = [0, 1];
        //         if (childrenIndexs.includes(toolActive)) {
        //             // 有children的两个
        //             if (childrenActive !== -1) {
        //             } else {
        //                 return true;
        //             }
        //         } else {
        //             return false;
        //         }
        //     } else {
        //         return true;
        //     }
        // },
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
        }),
        ...mapActions({
            toolItemTouch: "toolbar/toolItemTouch",
            childItemTouch: "toolbar/childItemTouch",
        }),
        changeActive() {
            // 改变 toolbar 的激活状态，控制工具栏展开和收回
            this.setState({ key: "isActive", value: !this.isActive });
        },
        // toolItemTouch(id, index, item) {
        //     if (this.toolActive !== index) {
        //         this.childrenActive = -1;
        //         this.toolActive = index;
        //     }
        //     // this.setDisabled(item);
        //     switch (id) {
        //         case 3: {
        //             // 随堂测试
        //             this.teachingToolsSet({
        //                 key: "classTestDialogVisible",
        //                 value: true,
        //             });
        //             break;
        //         }
        //         case 4: {
        //             // 内容分发
        //             break;
        //         }
        //         case 5: {
        //             // 导入课件
        //             break;
        //         }
        //         case 6: {
        //             // 结束上课
        //             break;
        //         }
        //         default:
        //             break;
        //     }
        // },
        // childItemTouch(id, index, item) {
        //     this.childrenActive = index;
        //     // this.setDisabled(item);
        // },
        // setDisabled(item) {
        //     const strongIds = [11, 12, 21, 22, 3]; // 强id互斥
        //     const weakIds = [23, 4]; // 弱id仅把自身设置为禁用
        //     const notDisabledIds = [5, 6]; // 永远不设置禁用的id
        //     const hasChildrenIds = [1, 2]; // 有子集的id
        //     const { toolList } = this;
        //     if (notDisabledIds.includes(item.id)) {
        //         // 永远不设置禁用
        //         return true;
        //     } else if (strongIds.includes(item.id)) {
        //         // 强禁用
        //         for (let i = 0; i < strongIds.length; i++) {
        //             const e = strongIds[i];

        //             // if (item.parentId) {
        //             //     // 子
        //             //     const
        //             // } else {
        //             //     // 父
        //             // }
        //             // const t = toolList.find()
        //         }
        //     } else if (weakIds.includes(item.id)) {
        //         // 弱禁用
        //         item.disabled = true;
        //     }
        //     console.log(item);
        // },
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