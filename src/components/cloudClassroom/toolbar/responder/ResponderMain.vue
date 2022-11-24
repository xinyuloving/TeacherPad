<template>
    <div class="responder_main">
        <i class="iconfont icon-close interaction_close" v-touch="close"></i>
        <!-- 随机选人和抢答共用一个关闭按钮的样式：interaction_close -->
        <div class="con" v-if="!winnerInfo.id">
            <img
                class="gif"
                v-show="!showNobodyAnswer"
                src="@/assets/img/cloudClassroom/321.gif"
                alt=""
            />
            <div class="no_body" v-show="showNobodyAnswer">
                <img src="@/assets/img/cloudClassroom/nobody.png" alt="" />
                <span class="text">没有学生抢答</span>
            </div>
        </div>
        <div class="mask active" v-else>
            <div class="container">
                <div class="top">
                    <!-- <img class="avatar" :src="winnerInfo.photoUrl" alt="" /> -->
                    <span class="avatar">{{
                        winnerInfo.studentName.slice(0, 1)
                    }}</span>
                    <span class="name">{{ winnerInfo.studentName }}</span>
                </div>
                <div class="bottom">
                    <span>恭喜抢答成功</span>
                </div>
            </div>
            <video
                class="fireworks"
                ref="fireworks"
                v-show="winnerInfo.id && showVideo"
                @ended="ended"
            >
                <source
                    src="@/assets/img/video/fireworks.mp4"
                    type="video/mp4"
                />
            </video>
        </div>
    </div>
</template>

<script>
import sendMessage from "@/utils/sendMessage";
import { createNamespacedHelpers, mapMutations } from "vuex";
const { mapState } = createNamespacedHelpers("cloudClassroom");
export default {
    data() {
        return {
            showVideo: true,
            showNobodyAnswer: false, // 展示无人抢答页面
        };
    },
    created() {
        // 埋点
        this.data_triggerEvent(
            {
                eventId: "initiatingFun",
                logValue: "1",
            },
            true
        );
    },
    computed: {
        ...mapState({
            winnerInfo: (state) => state.toolbar.responder.winnerInfo,
        }),
    },
    watch: {
        "winnerInfo.id": {
            handler(newValue) {
                if (newValue) {
                    const flowerTimer = setTimeout(() => {
                        this.$refs.fireworks.play();
                        clearTimeout(flowerTimer);
                    }, 200);
                }
            },
        },
    },
    mounted() {
        // 无人抢答定时器
        this.noOneTimer = setTimeout(() => {
            this.showNobodyAnswer = true;
            clearTimeout(this.noOneTimer);
        }, 8500);
    },
    methods: {
        ...mapMutations({
            reset: "cloudClassroom/toolbar/responder/resetState",
            imStoreSet: "imStore/setState",
            toolSet: "cloudClassroom/toolbar/setState",
        }),
        async close() {
            try {
                const data = {
                    content: "ccl_7",
                    extension: JSON.stringify({ flag: 0 }),
                };
                await sendMessage(data);
            } finally {
                this.reset();
                this.toolSet({ key: "strongId", value: 0 });
                this.toolSet({ key: "childrenActive", value: -1 });
                this.imStoreSet({ key: "responderFlag", value: true });
            }
        },
        ended() {
            console.log("视频播放完毕");
            this.showVideo = false;
        },
    },
};
</script>

<style lang="less" scoped>
.responder_main {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    .con {
        height: 100%;
        // width: 100%;
        display: flex;
        align-items: center;
        .gif {
            width: 5.2rem;
            height: 5.2rem;
        }
        .no_body {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            img {
                width: 2.4rem;
                height: 2.4rem;
                margin-bottom: 0.3rem;
            }
            .text {
                font-size: 0.6rem;
                font-weight: 600;
                color: #ffffff;
            }
        }
    }
    .mask {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        z-index: -1;
        // background-color: rgba(27, 26, 33, 0);
        transition: all 0.5s;
        display: flex;
        justify-content: center;
        align-items: center;
        .container {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            transform-origin: center;
            position: absolute;
            top: 0;
            left: 0;
            z-index: 2;
            .top {
                display: flex;
                justify-content: center;
                align-items: center;
                .avatar {
                    width: 2.4rem;
                    height: 2.4rem;
                    margin-right: 0.5rem;
                    border-radius: 50%;
                    transform: scale(0);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-size: 1.4rem;
                    color: #fff;
                    background: #3e83f8;
                }
                .name {
                    font-size: 0.78rem;
                    font-weight: 500;
                    color: #fc886c;
                    transform: scale(0);
                }
            }
            .bottom {
                margin-top: 0.5rem;
                transform-origin: center;
                transform: scale(0);
                span {
                    font-size: 0.6rem;
                    font-weight: 500;
                    color: #ffffff;
                }
            }
        }
        .fireworks {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: fill;
            z-index: 1;
        }
    }
    .active {
        z-index: 2;
        .top {
            .avatar {
                animation: scale 0.5s forwards ease-out;
            }
            .name {
                animation: scale 0.5s 0.1s forwards ease-out;
            }
        }
        .bottom {
            animation: scale 0.5s 0.6s forwards ease-out;
        }
    }
    @keyframes scale {
        0% {
            transform: scale(0);
        }
        25% {
            transform: scale(0.5);
        }
        50% {
            transform: scale(1);
        }
        75% {
            transform: scale(1.3);
        }
        100% {
            transform: scale(1);
        }
    }
}
</style>
<style lang="less">
.interaction_close {
    width: 0.8rem;
    height: 0.8rem;
    position: absolute;
    right: 1.8rem;
    top: 1.2rem;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 8;
    font-size: 0.8rem;
    color: #fc6a6a;
}
</style>