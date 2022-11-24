<template>
    <div class="upload" v-show="conAction">
        <!-- pad 上 没有本地上传，pc 端两者都存在 -->
        <!-- <div :class="['local', uploadVisible ? 'local-active' : '']">
                <img src="../../assets/img/upload/local.png" alt="" />
                <span class="upload-mode">本地上传</span>
                <span class="explain">上传本地的课件资源</span>
                <button>上传</button>
            </div> -->
        <div :class="['courseware', animateAction ? 'courseware-active' : '']">
            <!-- 课件上传 -->
            <img src="../../assets/img/upload/courseware.png" alt="" />
            <span class="upload-mode">课件上传</span>
            <span class="explain">上传“我的课件”资源</span>
            <!-- <TButton
                content="上传"
                :configItems="{
                    width: '1.46rem',
                    height: '0.44rem',
                    borderRadius: '0.07rem',
                    fontSize: '0.19rem',
                    fontWeight: 600,
                }"
            /> -->
            <TButton class="upload-btn" @touch="cancel"> 上传 </TButton>
        </div>
        <div
            :class="['close', animateAction ? 'close-active' : '']"
            v-touch="close"
        >
            <i class="iconfont icon-close my-icon"></i>
        </div>
    </div>
</template>

<script>
import TButton from "./TButton.vue";
let uploadTimer;
export default {
    components: { TButton },
    props: {
        uploadVisible: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            animateAction: false,
            conAction: false,
        };
    },
    watch: {
        uploadVisible: {
            handler(newValue) {
                if (newValue) {
                    this.conAction = true;
                    uploadTimer = setTimeout(() => {
                        this.animateAction = true;
                        clearTimeout(uploadTimer);
                        uploadTimer = undefined;
                    });
                } else {
                    this.animateAction = false;
                    uploadTimer = setTimeout(() => {
                        this.conAction = false;
                        clearTimeout(uploadTimer);
                        uploadTimer = undefined;
                    }, 300);
                }
            },
        },
    },
    methods: {
        close() {
            this.$emit("changeUploadVisible");
        },
    },
};
</script>

<style lang="less" scoped>
.upload {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 99;
    background-color: rgba(0, 0, 0, 0.6);
    overflow: hidden;
    // pc 端代码 ----------  勿删
    // .local,
    // .courseware {
    //     width: 4.4rem;
    //     height: 3.49rem;
    //     background: #ffffff;
    //     border-radius: 0.21rem;
    //     padding-top: 0.1rem;
    //     position: absolute;
    //     top: 50%;
    //     transform: translateY(-50%);
    //     transition: all 0.3s;
    //     display: flex;
    //     flex-direction: column;
    //     align-items: center;
    //     img {
    //         width: 1.57rem;
    //         height: 1.5rem;
    //         margin-bottom: 0.2rem;
    //     }
    //     .upload-mode {
    //         font-size: 0.23rem;
    //         font-family: PingFangSC-Semibold, PingFang SC;
    //         font-weight: 600;
    //         color: #333333;
    //         margin-bottom: 0.13rem;
    //     }
    //     .explain {
    //         font-size: 0.15rem;
    //         font-family: PingFangSC-Regular, PingFang SC;
    //         font-weight: 400;
    //         color: #3e83f8;
    //         margin-bottom: 0.25rem;
    //     }
    //     button {
    //         width: 1.46rem;
    //         height: 0.44rem;
    //         background: #3e83f8;
    //         border-radius: 0.07rem;
    //         font-size: 0.19rem;
    //         font-family: PingFangSC-Semibold, PingFang SC;
    //         font-weight: 600;
    //         color: #ffffff;
    //     }
    // }
    // .local {
    //     left: -4.4rem;
    // }
    // .local-active {
    //     left: 5.32rem;
    // }
    // .courseware {
    //     right: -4.4rem;
    // }
    // .courseware-active {
    //     right: 5.32rem;
    // }
    .courseware {
        width: 4.4rem;
        height: 3.49rem;
        background: #ffffff;
        border-radius: 0.21rem;
        padding-top: 0.1rem;
        position: absolute;
        top: 50%;
        right: -4.4rem;
        transform: translateY(-50%);
        transition: all 0.3s;
        display: flex;
        flex-direction: column;
        align-items: center;
        img {
            width: 1.57rem;
            height: 1.5rem;
            margin-bottom: 0.2rem;
        }
        .upload-mode {
            font-size: 0.23rem;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: #333333;
            margin-bottom: 0.13rem;
        }
        .explain {
            font-size: 0.15rem;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #3e83f8;
            margin-bottom: 0.25rem;
        }
        .upload-btn {
            width: 1.46rem;
            height: 0.44rem;
            border-radius: 0.07rem;
            font-size: 0.19rem;
            font-weight: 600;
        }
    }
    .courseware-active {
        right: 50%;
        transform: translate(50%, -50%);
    }
    .close {
        width: 0.78rem;
        height: 0.78rem;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        bottom: -0.78rem;
        left: 50%;
        transform: translateX(-50%);
        transition: bottom 0.3s;
        .my-icon {
            font-size: 0.6rem;
            color: #fff;
        }
    }
    .close-active {
        bottom: 2.44rem;
    }
}
</style>