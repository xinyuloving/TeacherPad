<template>
    <div
        :class="{ 'preview-con': true, active: active }"
        :style="{
            top: transActive ? '0.91rem' : '',
            left: transActive ? '3.4rem' : '',
        }"
        v-drag
    >
        <div class="main">
            <SelectPreview
                :fileName="selectFile.name"
                :suffix="selectFile.suffix"
                @afterGetUrl="afterGetUrl"
            />
        </div>
        <div class="close" v-touch="close">
            <i class="iconfont icon-close"></i>
        </div>
        <div class="enlarge" v-touch="changeActive">
            <i
                :class="['iconfont', active ? 'icon-suoxiao' : 'icon-quanping']"
            ></i>
        </div>
    </div>
</template>

<script>
import SelectPreview from "@/components/cloudClassroom/SelectPreview";
import { createNamespacedHelpers } from "vuex";
import sendMessage from "@/utils/sendMessage";
import drag from "@/directive/drag";
import { insertDom } from "@/utils/util";
const { mapState, mapMutations } = createNamespacedHelpers("cloudClassroom");
export default {
    components: {
        SelectPreview,
    },
    directives: {
        drag,
    },
    data() {
        return {
            active: false,
            transActive: false,
        };
    },
    computed: {
        ...mapState({
            selectFile: (state) => state.toolbar.distribute.selectFile,
        }),
    },
    mounted() {
        insertDom(this.$el, this.$parent.$el);
    },
    methods: {
        ...mapMutations({
            toolbarSet: "toolbar/setState",
            setState: "toolbar/distribute/setState",
        }),
        close() {
            sendMessage({
                content: "ccl_12",
                extension: JSON.stringify({
                    flag: 0, // 开启传1， 关闭 -->  非true!
                }),
            })
                .then(() => {
                    this.setState({
                        key: "selectFile",
                        value: {},
                    });
                    this.toolbarSet({
                        objKey: "weakIdObj",
                        key: 4,
                        value: false,
                    });

                    this.setState({
                        key: "previewVisible",
                        value: false,
                    });
                })
                .catch(() => {
                    this.$message({
                        type: "error",
                        message: "关闭失败，请重试",
                    });
                });
        },
        changeActive() {
            // this.active = !this.active;
            if (this.active) {
                this.transActive = false;
                this.active = false;
            } else {
                // 在放大的时候先将dom移动到安全区域在进行放大，避免超出屏幕的问题
                this.transActive = true;
                setTimeout(() => {
                    this.active = true;
                }, 300);
            }
        },
        async afterGetUrl(fileUrl) {
            // 获取到url之后的处理方法
            try {
                const content = {
                    name: this.selectFile.name,
                    suffix: this.selectFile.suffix,
                    fileUrl,
                };

                const extension = {
                    flag: 1, // 开启传1， 关闭 -->  非true!
                    content,
                };

                await sendMessage({
                    content: "ccl_12",
                    extension: JSON.stringify(extension),
                });
            } catch (error) {
                this.$message({
                    type: "error",
                    message: "内容分发失败，请重新尝试",
                });
            }
        },
    },
};
</script>

<style lang="less" scoped>
@trans1: all 0.3s ease;
.preview-con {
    width: 5.23rem;
    height: 3.17rem;
    background: #f0f5fd;
    position: absolute;
    // top: 0.78rem;
    top: 1.5rem;
    // right: 1.23rem;
    left: 14.1rem;
    z-index: 12;
    display: flex;
    justify-content: center;
    align-items: center;
    transform: translateZ(0px); // GPU 加速
    transition: @trans1;
    transform-origin: right top;
    .main {
        width: 100%;
        height: 100%;
    }
    .close,
    .enlarge {
        position: absolute;
        z-index: 3001;
        right: -0.2rem;
        width: 0.42rem;
        height: 0.42rem;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        transition: @trans1;
        .iconfont {
            color: #fff;
            font-size: 0.32rem;
            transition: @trans1;
        }
    }

    .close {
        top: -0.2rem;
        background-color: #fc6a6a;
    }

    .enlarge {
        bottom: -0.22rem;
        right: -0.22rem;
        width: 0.52rem;
        height: 0.52rem;
        background-color: #5397f1;
        opacity: 0.8;
        .iconfont {
            font-size: 0.4rem;
        }
    }
}
.active {
    width: 14.67rem;
    height: 8.89rem;
    // top: 0.91rem;
    // left: 3.4rem;
    // right: 1.94rem;
    .close {
        width: 0.62rem;
        height: 0.62rem;
        right: -0.28rem;
        top: -0.28rem;
        .iconfont {
            font-size: 0.46rem;
        }
    }
    .enlarge {
        bottom: -0.34rem;
        right: -0.34rem;
        width: 0.72rem;
        height: 0.72rem;
        .iconfont {
            font-size: 0.46rem;
        }
    }
}
</style>