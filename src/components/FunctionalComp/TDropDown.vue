<template>
    <transition name="el-zoom-in-top">
        <div
            :class="['drop-down', arrow ? 'arrow' : '', customClass]"
            v-show="visible"
            :style="{
                ...styleGroup,
            }"
        >
            <slot />
        </div>
    </transition>
</template>

<script>
// 父组件需要有定位元素
export default {
    props: {
        styleGroup: {
            type: Object,
            default: () => ({}),
        },
        customClass: String,
        visible: Boolean,
        arrow: Boolean,
    },
};
</script>

<style lang="less">
.drop-down {
    background: #ffffff;
    // border: 0.02rem solid #d3d2db;
    border: 0.01rem solid #ebeef5;
    border-radius: 0.04rem;
    box-shadow: 0 0.02rem 0.12rem 0 rgba(0, 0, 0, 0.1);
    position: absolute;
    z-index: 99;
    top: 80%;
}
</style>
<style lang="less" scoped>
.arrow {
    filter: drop-shadow(0 0.02rem 0.12rem rgba(0, 0, 0, 0.02));
    &::before {
        content: "";
        display: block;
        width: 0;
        height: 0;
        border: 0.15rem solid;
        position: absolute;
        left: 50%;
        top: -2%;
        transform: translate(-50%, -50%);
        border-color: transparent;
        border-bottom-color: #fff;
        border-top-width: 0;
    }
}
</style>
