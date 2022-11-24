<template>
    <!-- 缺省页 -->
    <div class="defalut-page">
        <div class="occupy-img">
            <img :style="imgConfig" :src="require(`@/assets/img/occupy/${imgName}.png`)" />
        </div>
        <div class="text-content">{{ textContent }}</div>
        <div class="floor">
            <slot>
                <TButton v-if="imgName === 'not_network'" class="btn" @touch="() => { $emit('refresh') }">
                    立即刷新
                </TButton>
            </slot>
        </div>
    </div>
</template>

<script>

import TButton from "@/components/FunctionalComp/TButton.vue"

export default {
    name: 'DefalutPage',

    components: {
        TButton
    },

    props: {
        imgName: {
            type: String,
            default: 'not_content'
        },                                      // 图片的名字  not_content: 无内容     not_network: 无网络   默认not_content
        textContent: String,                    // 文本内容
        imgConfig: {
            type: Object,
            default: () => ({width: '2.7rem'})
        },                      // 图片的配置
    },

    // data() {
    //     return {
    //         myConfig: {
    //             width: '2.7rem',
    //             height: '2.2rem'
    //         }
    //     }
    // },

    // created() {
    //     if (this.imgConfig) this.myConfig = {...this.myConfig, ...this.imgConfig}
    // }
}
</script>

<style lang="less" scoped>
.defalut-page {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .text-content {
        color: #666;
        margin-bottom: 20px;
    }
    .btn {
        width: 1.83rem;
        height: 0.55rem;
        // background-color: #3E83F8;
        // color: #fff;
    }
}
</style>