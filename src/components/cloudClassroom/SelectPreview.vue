<template>
    <div class="select-preview">
        <div class="my-img" v-if="type === 1">
            <img :src="fileUrl" @load="isLoading = false" alt="" />
        </div>
        <!-- 如果预览的是视频 -->
        <div class="video-box" v-else-if="type === 2">
            <video
                :src="fileUrl"
                :autoplay="videoAutoplay"
                controls
                controlslist="nofullscreen nodownload"
                v-touch.stop
                @loadstart="isLoading = false"
                ref="video"
            ></video>
        </div>
        <div class="my-iframe" v-else>
            <iframe
                class="iframe"
                :src="fileUrl"
                @load="isLoading = false"
                sandbox="allow-scripts allow-same-origin"
            ></iframe>
        </div>
        <Loading v-if="isLoading" contentText="加载中" />
    </div>
</template>
<script>
import cos from "@/utils/cos";
import { judgeFileSuffix } from "@/utils/util";
import Loading from "@/components/FunctionalComp/Loading.vue";
import previewDoc from "@/components/mixins/previewDoc";
export default {
    components: {
        Loading,
    },
    mixins: [previewDoc],
    props: {
        fileName: {
            type: String,
            required: true,
        },
        suffix: {
            type: String,
            required: true,
        },
        videoAutoplay: {
            type: Boolean,
            default: true,
        },
    },
    data() {
        return {
            fileUrl: "",
            isLoading: true,
        };
    },
    computed: {
        type() {
            return judgeFileSuffix(this.suffix);
        },
    },
    watch: {
        fileName: {
            handler() {
                this.reset();
                this.loadFile();
            },
            immediate: true,
        },
    },
    methods: {
        async loadFile() {
            // const type = this.type;
            // if (type === 1 || type === 2) {
            //     // 图片 视频
            //     cos.getObjectUrl({
            //         type: 0,
            //         key: this.fileName,
            //     })
            //         .then(({ Url }) => {
            //             this.fileUrl = Url;
            //         })
            //         .catch((err) => {
            //             this.handleError();
            //         });
            // } else {
            //     // 文件
            //     this._mountDoc({
            //         name: this.fileName,
            //     })
            //         .then((res) => {
            //             this.fileUrl = res;
            //         })
            //         .catch((err) => {
            //             this.handleError();
            //         });
            // }
            try {
                const type = this.type;
                if (type === 1 || type === 2) {
                    // 图片 视频
                    const { Url } = await cos.getObjectUrl({
                        type: 0,
                        key: this.fileName,
                    });
                    this.fileUrl = Url;
                } else {
                    // 文件
                    const res = await this._mountDoc({
                        name: this.fileName,
                    });
                    this.fileUrl = res;
                }
                this.$emit("afterGetUrl", this.fileUrl);
            } catch (error) {
                console.log(error);
                this.$message({
                    type: "error",
                    message: "加载失败，请重试！",
                });
                this.isLoading = false;
            }
        },
        handleError() {
            this.$message({
                type: "error",
                message: "加载失败，请重试！",
            });
            this.isLoading = false;
        },
        reset() {
            this.fileUrl = "";
            this.isLoading = true;
        },
    },
};
</script>
<style lang="less" scoped>
.select-preview {
    width: 100%;
    height: 100%;
    .my-iframe {
        width: 100%;
        height: 100%;
        overflow: hidden;
        .iframe {
            width: 100%;
            height: 100%;
        }
    }
    .my-img,
    .video-box {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background: rgba(0, 0, 0, 1);
        overflow: hidden;
        img,
        video {
            width: auto;
            height: 100%;
            object-fit: contain;
        }
        video {
            width: 100%;
        }
    }
}
</style>
