<template>
    <div class="unflod-frame" v-show="show" :style="{ opacity }">
        <div class="open unflod-item" v-touch="() => { $emit('unflodEvent', 0) }">
            <div class="icon-box">
                <i class="iconfont icon-24gl-folderOpen"></i>
            </div>
            <div>打开</div>
        </div>
        <!-- <div class="share" v-touch="() => { $emit('unflodEvent', 1) }">
            <i class="iconfont icon-gongxiang"></i>
            共享
        </div> -->
        <div class="download unflod-item" v-if="isDownload" v-touch="() => { $emit('unflodEvent', 2) }" :style="{color: type === 0 ? '#ccc' : ''}">
            <div class="icon-box">
                <i class="iconfont icon-xiazai"></i>
            </div>
            <div>下载</div>
        </div>
        <div class="rechristen unflod-item" v-touch="() => { $emit('unflodEvent', 3) }">
            <div class="icon-box">
                <i class="iconfont icon-modify"></i>
            </div>
            <div>重命名</div>
        </div>
        <div class="del unflod-item" v-touch="() => { $emit('unflodEvent', 4) }">
            <div class="icon-box">
                <i class="iconfont icon-shanchu"></i>
            </div>
            <div>删除</div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'UnflodFrame',

    props: {
        isShow: Boolean,            // 是否显示
        type: [String, Number]
    },

    data() {
        return {
            show: false,
            opacity: 0,
            routerName: '',
            facilityENV: this.$store.getters.facilityENV
        }
    },

    computed: {
        isDownload() {
            return this.routerName !== 'FileList' && this.facilityENV === 'windows'
        }
    },

    watch: {
        isShow() {
            if (this.isShow) {
                this.show = true;
                setTimeout(() => {
                    this.opacity = 1;
                }, 0);
            } else {
                this.opacity = 0;
                setTimeout(() => {
                    this.show = false
                }, 200);
            }
        }
    },
    created() {
        this.routerName = this.$router.currentRoute.name
    }
}
</script>

<style lang="less" scoped>
.unflod-frame {
    width: 2.4rem;
    height: 2.3rem;
    box-shadow: 0rem 0rem 0.07rem 0rem rgba(217, 217, 217, 0.68);
    border-radius: 0.21rem;
    background-color: #fff;
    transition: opacity .2s;
    display: flex;
    flex-direction: column;
    .unflod-item {
        flex: 1;
        display: flex;
        align-items: center;
        // justify-content: center;
        div {
            width: 60%;
        }
        .icon-box {
            width: 40%;
            text-align: right;
        }
        i {
            margin-right: 5px;
            font-size: 0.25rem;
        }
    }
    .del {
        color: red;
    }
}
</style>