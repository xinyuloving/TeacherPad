<template>
    <div class="pick_main">
        <i class="iconfont icon-close interaction_close" v-touch="close"></i>
        <!-- 随机选人和抢答共用一个关闭按钮的样式：interaction_close -->
        <transition name="hide">
            <div
                :class="['con', animation ? 'animate-swing' : '']"
                v-if="!winnerAnimate"
            >
                <div class="top">
                    <img src="@/assets/img/cloudClassroom/random.png" alt="" />
                    <div class="region" v-show="showRegion">
                        <ul class="move-ul" ref="moveUl">
                            <li
                                class="list"
                                v-for="(item, index) in options"
                                :key="index"
                            >
                                <!-- <img class="avatar" :src="item.photoUrl" alt="" /> -->
                                <span class="avatar">{{
                                    item.name.slice(0, 1)
                                }}</span>
                                <span class="name single_elli">{{
                                    item.name
                                }}</span>
                            </li>
                        </ul>
                    </div>
                    <div
                        class="show-text"
                        v-touch="action"
                        v-show="showText !== 2"
                    >
                        <span>{{
                            showText === 1 ? "正在随机选人..." : "开始"
                        }}</span>
                    </div>
                </div>
                <div class="bottom"></div>
            </div>
        </transition>

        <div :class="['mask', { active: maskActive }]">
            <transition name="enlarge">
                <div class="container" v-if="winnerAnimate && winnerInfo.name">
                    <!-- <img class="avatar" :src="winnerInfo.photoUrl" alt="" /> -->
                    <span class="avatar">{{
                        winnerInfo.name.slice(0, 1)
                    }}</span>
                    <span class="name">{{ winnerInfo.name }}</span>
                </div>
            </transition>
        </div>
    </div>
</template>

<script>
import { createNamespacedHelpers, mapGetters } from "vuex";
const { mapState, mapMutations } = createNamespacedHelpers("cloudClassroom");
import { startMove, repaintArray, rnd } from "@/utils/util";
import sendMessage from "@/utils/sendMessage";
export default {
    data() {
        return {
            animation: true, // 初始的晃动动画
            showRegion: false, // 显示学生区域
            maskActive: false, // 选人结束后的遮罩层
            run: true, // 控制开始按钮能否点击，每次只能点击一次开始
            showText: 0, // 0 开始，1 正在选人 ， 2 空白
            winnerAnimate: false,
            options: [],
            winnerInfo: {},
        };
    },
    computed: {
        ...mapState({
            // options: (state) => state.toolbar.random.options,
            // winnerInfo: (state) => state.toolbar.random.winnerInfo,
        }),
        ...mapGetters({
            studentList: "studentList",
        }),
    },
    methods: {
        ...mapMutations({
            setState: "toolbar/random/setState",
            toolSet: "toolbar/setState",
            classSet: "setState",
            // resetState: "toolbar/random/resetState",
            handleDisabled: "toolbar/handleDisabled",
        }),
        async action() {
            if (this.run) {
                if (this.studentList.length) {
                    const temArr = [...this.studentList];
                    const index = rnd(0, temArr.length - 1);
                    const winnerInfo = temArr.splice(index, 1)[0]; // 目标对象
                    this.winnerInfo = winnerInfo;
                    console.log(winnerInfo);
                    const options = repaintArray(temArr, winnerInfo);
                    // commit("random/setState", { key: "winnerInfo", value: t });
                    // commit("random/setState", { key: "options", value: a });

                    // ----------------埋点：向store中存放选中的人
                    // ----------------

                    this.classSet({ key: "toolbarVisible", value: false });
                    this.run = false;
                    this.showText = 1;
                    this.showRegion = true;
                    this.animation = false;
                    const resultOptions = options.map((item) => ({
                        id: item.id,
                        name: item.name,
                    }));
                    this.options = resultOptions;
                    try {
                        const data = {
                            content: "ccl_5",
                            extension: JSON.stringify({
                                flag: 1,
                                // id: this.winnerInfo.id,
                                resultOptions,
                                winnerInfo: {
                                    id: winnerInfo.id,
                                    name: winnerInfo.name,
                                },
                            }),
                        };
                        console.log(data);
                        await sendMessage(data);
                        console.log("信息发送成功");
                        this.handleDisabled();
                        const h = 1.9 * (options.length - 1);
                        startMove(this.$refs.moveUl, h, this.openMask);
                        // 看板
                        this.$store.dispatch("inCloudClassroom/dataRecords", {
                            type: "randomPick",
                        });
                        // 埋点
                        this.data_triggerEvent(
                            {
                                eventId: "initiatingFun",
                                logValue: "2",
                            },
                            true
                        );
                    } catch (error) {
                        // this.resetState();
                        this.$message({
                            type: "error",
                            message: "发起随机点名失败！请重新尝试",
                        });
                    }
                } else {
                    this.$tMessage(
                        {
                            title: "抱歉，该班没有学生！",
                            type: "warning",
                        }
                        // () => {
                        //     this.toolSet({
                        //         key: "childrenActive",
                        //         value: -1,
                        //     });
                        // }
                    );
                }
            }
        },
        openMask() {
            this.showText = 2;
            this.winnerAnimate = true;
            this.$nextTick(() => {
                this.maskActive = true;
            });
            // const t = setTimeout(() => {
            //     this.maskActive = true;
            //     clearTimeout(t);
            // });
        },
        async close() {
            if (this.run) {
                this.setState({ key: "visible", value: false });
            } else {
                try {
                    const data = {
                        content: "ccl_5",
                        extension: JSON.stringify({ flag: 0 }),
                    };
                    this.setState({ key: "visible", value: false });
                    await sendMessage(data);
                    // this.resetState();
                } catch (error) {
                    console.log(error);
                }
            }
            this.toolSet({ key: "strongId", value: 0 });
            this.toolSet({ key: "childrenActive", value: -1 });
        },
    },
};
</script>

<style lang="less" scoped>
.pick_main {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    .con {
        // width: 3.96rem;
        // height: 100%;
        width: 5.15rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-top: 0.76rem;
        .top {
            width: 100%;
            position: relative;
            img {
                width: 100%;
                height: 4.63rem;
            }
            .region {
                width: 3.2rem;
                height: 1.95rem;
                position: absolute;
                top: 0.82rem;
                left: 0.85rem;
                overflow: hidden;
                .move-ul {
                    width: 100%;
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    .list {
                        width: 100%;
                        height: 1.9rem;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        padding: 0 0.1rem;
                        .avatar {
                            flex-shrink: 0;
                            width: 1.44rem;
                            height: 1.44rem;
                            border-radius: 50%;
                            background: #3e83f8;
                            color: #ffffff;
                            font-size: 0.65rem;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                        }
                        .name {
                            width: calc(100% - 1.1rem);
                            font-size: 0.4rem;
                            font-weight: 500;
                            color: #5050e5;
                            margin-left: 0.15rem;
                        }
                    }
                }
            }
            .show-text {
                width: 2.4rem;
                height: 0.55rem;
                position: absolute;
                bottom: 0.27rem;
                // left: 1.43rem;
                left: 1.2rem;
                display: flex;
                justify-content: center;
                align-items: center;
                span {
                    font-size: 0.28rem;
                    font-weight: 400;
                    color: #d3e7ff;
                }
            }
        }
        .bottom {
            width: 2.46rem;
            height: 0.42rem;
            background: #434249;
            border-radius: 50%;
            margin-top: 0.3rem;
        }
    }
    .hide-leave-to {
        opacity: 0;
    }
    .hide-leave-active {
        transition: opacity 0.3s;
    }
    .mask {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: rgba(27, 26, 33, 0);
        z-index: -1;
        transition: all 0.5s;

        .enlarge-enter {
            transform: scale(0);
        }
        .enlarge-enter-active {
            transition: all 1.5s;
        }
        .container {
            transform-origin: center center;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            .avatar {
                width: 2.6rem;
                height: 2.6rem;
                margin-bottom: 0.16rem;
                border-radius: 50%;
                background: #3e83f8;
                color: #ffffff;
                font-size: 1.3rem;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            .name {
                font-size: 0.6rem;
                font-weight: 500;
                color: #fc886c;
            }
        }
    }
    .active {
        z-index: 2;
        // background-color: rgba(27, 26, 33, 0.7);
        // .container {
        //     transform: scale(1);
        // }
    }
    .animate-swing {
        animation: swing 3s linear infinite;
    }
    @keyframes swing {
        0% {
            transform: translateY(0);
        }
        25% {
            transform: translateY(-0.2rem);
        }
        50% {
            transform: translateY(0);
        }
        75% {
            transform: translateY(0.2rem);
        }
        100% {
            transform: translateY(0);
        }
    }
}
</style>