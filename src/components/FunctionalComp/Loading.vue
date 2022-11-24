<template>
    <!-- 加载效果 -->
    <div
        class="loading"
        ref="loading"
        :style="{
            backgroundColor: modal
                ? 'rgba(255, 255, 255, 0.8)'
                : 'rgba(255, 255, 255, 0)',
        }"
    >
        <div
            class="content"
            :style="{
                width: contentWidth,
                height: contentWidth,
            }"
        >
            <img class="loadingImg" src="~@/assets/img/loading.png" />
            <div class="text-content">{{ contentText || '加载中' }}</div>
        </div>
    </div>
</template>

<script>
export default {
    name: "Loading",

    props: {
        contentText: String,
        modal: {
            type: Boolean,
            default: true,
        },
    },

    data() {
        return {
            contentWidth: "",
        };
    },

    mounted() {
        // 获取盒子的宽  并动态赋值
        this.contentWidth =
            parseInt(this.$refs.loading.clientWidth * 0.15) + "px";
    },
};
</script>

<style lang="less" scoped>
.loading {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    // background-color: rgba(255, 255, 255, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 3000;
    .content {
        background-color: rgba(0, 0, 0, 0.6);
        text-align: center;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        font-size: 0.23rem;
        img {
            width: 30%;
            animation: spin 1s linear infinite;
        }
        .text-content {
            color: rgba(255, 255, 255, 0.9);
            margin-top: 10px;
        }
    }
}

@keyframes spin {
    0% {
    }
    100% {
        transform: rotate(360deg);
    }
}
</style>