<template>
    <div class="courseware-preview" v-loading="loading">
        <div class="iframe-box" ref="preview">
            <img :src="previewUrl" v-if="type === 1"/>
            <video :src="previewUrl" controls v-else-if="type === 2" autoplay controlsList="nodownload"></video>
            <audio :src="previewUrl" controls v-else-if="type === 3" autoplay></audio>
            <!-- <iframe v-else :src="previewUrl" frameborder="0" @load="$emit('load')"></iframe> -->
        </div>
    </div>
</template>

<script>

import previewDoc from '@/components/mixins/previewDoc'

export default {
    name: 'CoursewarePreview',

    mixins: [previewDoc],

    props: {
        previewUrl: String,
        type: Number,           // 预览类型 0：课件  1：图片  2：视频  3.音频
    },

    data() {
        return {
            loading: true
        }
    },

    async mounted() {
        try {
            if (!this.type) {
                // 如果预览的是文档类型
                await this._mountDoc({
                    name: this.previewUrl,
                    dom: this.$refs.preview
                })
            }
            this.loading = false
        } catch(err) {
            this.loading = false
            this.$message({
                message: '预览失败，请重试!',
                type: 'error'
            })
        }
    }
}
</script>

<style lang="less" scoped>
.courseware-preview {
    height: 100%;
    .iframe-box {
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        iframe {
            width: 100%;
            height: 100%;
        }
        img,
        video,
        audio {
            max-width: 100%;
            max-height: 100%;
        }
        video::-webkit-media-controls-enclosure {
            overflow: hidden;
        }
        video::-webkit-media-controls-fullscreen-button {
            display: none;
        }
    }
}
</style>