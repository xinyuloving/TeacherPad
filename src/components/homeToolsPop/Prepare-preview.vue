<template>
    <div class="prepare-preview">
        <div class="top-wrap">
            <div class="top-title">
                <TButton class="share" @touch="preview"> 返回 </TButton>
                <!-- <TButton
                    class="share"
                    content="返回"
                    :configItems="{
                        width: '0.96rem',
                        height: '0.42rem',
                        fontSize: '0.21rem',
                        background: '#FFFFFF',
                        color: '#333333',
                        fontWeight: 400,
                        borderRadius: '0.08rem',
                        border: '0.01rem solid #979797',
                    }"
                    @touch="preview"
                /> -->
            </div>
            <div class="pre-name">{{ titleName }}</div>
            <div class="preview-share">
                <TButton class="share" @touch="share"> 分享 </TButton>

                <!-- <TButton
                    class="share"
                    content="分享"
                    :configItems="{
                        width: '0.96rem',
                        height: '0.42rem',
                        fontSize: '0.21rem',
                        background: '#FFFFFF',
                        color: '#333333',
                        fontWeight: 400,
                        borderRadius: '0.08rem',
                        border: '0.01rem solid #979797',
                    }"
                    @touch="share"
                /> -->
            </div>
        </div>
        <div class="preview-img" v-if="imgAddressObj.flagNum === 1">
            <img :src="imgAddressObj.Url" alt="" />
        </div>
        <div class="video-box" v-if="imgAddressObj.flagNum === 3">
            <video
                :src="imgAddressObj.Url"
                autoplay="autoplay"
                controls
                v-touch.stop
            ></video>
        </div>
        <div class="preview-iframe" v-if="imgAddressObj.flagNum === 2">
            <iframe
                class="my-iframe"
                :src="imgAddressObj.Url"
                ref="iframe"
            ></iframe>
        </div>
    </div>
</template>
<script>
import TButton from "../FunctionalComp/TButton.vue";
export default {
    components: {
        TButton,
    },
    props: {
        imgAddressObj: {
            type: Object,
            request: true,
        },
        preName: String,
        previewVisible: Boolean,
    },
    created() {
        console.log(this.imgAddressObj);
        console.log(this.preName);
        let name = this.preName.lastIndexOf("/");
        let eLength = this.preName.length;
        let fix = this.preName.substring(name + 1, eLength);
        console.log(fix);
        this.titleName = fix;
    },
    data() {
        return {
            titleName: "",
        };
    },
    methods: {
        preview() {
            this.$emit("previewVisible", false);
        },
        // 共享
        share() {},
    },
};
</script>
<style lang="less" scoped>
.prepare-preview {
    position: relative;
    width: 16.67rem;
    height: 9rem;
    margin-top: 0.3rem;
    background: #ffffff;
    border-radius: 0.21rem;
    .top-wrap {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .top-title {
            margin-left: 0.58rem;
            margin-top: 0.4rem;
            font-size: 0.25rem;
            color: #333333;
        }
        .pre-name {
            font-size: 0.25rem;
            font-weight: 600;
            margin-top: 0.4rem;
        }
        .preview-share {
            .share {
                margin-right: 0.58rem;
                margin-top: 0.4rem;
            }
        }
        .share {
            width: 0.96rem;
            height: 0.42rem;
            font-size: 0.21rem;
            background: #ffffff;
            color: #333333;
            font-weight: 400;
            border-radius: 0.08rem;
            border: 0.01rem solid #979797;
        }
    }
    .preview-img {
        width: 15.5rem;
        height: 7.8rem;
        img {
            width: 100%;
            height: 100%;
            margin: 0.3rem 0.58rem 0 0.58rem;
            // border-radius: 0.21rem;
        }
    }
    .preview-iframe {
        width: 15.5rem;
        height: 7.8rem;
        .my-iframe {
            width: 100%;
            height: 100%;
            margin: 0.4rem 0.58rem 0 0.58rem;
        }
    }
    .video-box {
        width: 15.5rem;
        height: 7.6rem;
        video {
            width: 100%;
            height: 100%;
            margin: 0.4rem 0.58rem 0 0.58rem;
        }
    }
}
</style>
