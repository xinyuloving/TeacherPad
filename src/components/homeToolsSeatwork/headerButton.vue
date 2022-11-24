<template>
    <div class="header-button">
        <div class="but-box">
            <TButton
                class="h-but"
                v-for="(item, index) in headerButtons"
                :key="index"
                @touch="
                    () => {
                        $emit('toLocation', index);
                    }
                "
            >
                {{ item.content }}
            </TButton>
        </div>
    </div>
</template>

<script>
import TButton from "@/components/FunctionalComp/TButton.vue";

export default {
    name: "HeaderButton",

    components: {
        TButton,
    },

    props: {
        headerButtons: Array,
    },

    methods: {
        toLocation(index, location) {
            // 如果点击的是当前项 则跳出
            if (index === this.headerButtons.length - 1) return;
            if (index) {
                // 如果点击的非首页
                this.$emit("location", index);
            }
            // 跳转路由
            this.$router.push({ path: location });
        },
    },
};
</script>

<style lang="less" scoped>
.header-button {
    .but-box {
        display: flex;
        .h-but {
            font-size: 0.26rem;
            background: #ffffff;
            font-weight: 400;
            height: 0.6rem;
            margin-right: 0.1rem;
            color: #a8a8a8;
            // border: 0.01rem solid #979797;
            width: auto;
            padding: 0 0.1rem;
            border-radius: 0;
        }
        .h-but:nth-last-child(1) {
            border-radius: 0rem 0.08rem 0.08rem 0rem;
            border: 0.01rem solid #3e83f8;
            color: rgb(62, 131, 248);
        }
        .h-but:nth-child(1) {
            border-radius: 0.08rem 0rem 0rem 0.08rem;
        }
    }
}
</style>