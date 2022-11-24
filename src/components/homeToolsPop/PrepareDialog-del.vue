<template>
    <div class="prepare-del">
        <Dialog
            :delVisible="delVisible"
            width="5.21rem"
            height="2.98rem"
            background="#F1F1F3"
            border-radius="0.21rem"
            @open="open"
            @close="close"
            position="fixed"
        >
            <template v-slot:header>
                <div class="head-con">
                    <span class="d-head">删除文件</span>
                    <i class="iconfont icon-close my-icon" v-touch="close"></i>
                </div>
            </template>
            <template v-slot:default>
                <div class="main-con">
                    <span
                        >亲爱的老师,&nbsp;确定要删除课件吗？<br />再考虑一下吧</span
                    >
                </div>
            </template>
            <template v-slot:footer>
                <div class="footer-con">
                    <TButton class="cancel" @touch="close"> 取消 </TButton>
                    <TButton class="confirm" @touch="open"> 确认删除 </TButton>
                    <!-- <TButton
                        content="取消"
                        :configItems="{
                            width: '2.21rem',
                            height: '0.52rem',
                            borderRadius: '0.1rem',
                            fontSize: '0.25rem',
                            background: '#FFF',
                            color: '#333333',
                            margin: '0.49rem 0.21rem 0.2rem 0.29rem',
                        }"
                        @touch="close"
                    />
                    <TButton
                        content="确认删除"
                        :configItems="{
                            width: '2.21rem',
                            height: '0.52rem',
                            borderRadius: '0.1rem',
                            fontSize: '0.25rem',
                            border: '0.01rem solid #3e83f8',
                            background: '#3E83F8 100%',
                            color: '#fff',
                            margin: '0.49rem 0.29rem 0.2rem 0rem',
                        }"
                        @touch="open"
                    /> -->
                </div>
            </template>
        </Dialog>
    </div>
</template>

<script>
import TButton from "../FunctionalComp/TButton.vue";
import Dialog from "../FunctionalComp/Dialog.vue";
export default {
    components: {
        Dialog,
        TButton,
    },
    props: {
        delVisible: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            selectOption: [],
            showTips: false, // 已有老师上课的错误提示
            action: false, // 点击上传课件后启动动画
            loading: false,
        };
    },

    methods: {
        open() {
            this.$emit("delVisible", true);
        },
        close() {
            this.$emit("delVisible", false);
        },
    },
};
</script>

<style lang="less" scoped>
.prepare-del {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    .head-con {
        width: 100%;
        height: 0.68rem;
        display: flex;
        justify-content: center;
        align-items: center;
        border-bottom: 0.01rem solid #dedede;
        position: relative;
        .d-head {
            font-size: 0.27rem;
            color: #333333;
            font-weight: 600;
        }
        .my-icon {
            position: absolute;
            right: 0;
            top: 50%;
            transform: translateY(-50%);
            margin-right: 0.3rem;
            font-size: 0.35rem;
        }
    }
    .main-con {
        margin-top: 0.36rem;
        font-size: 0.23rem;
        color: #333333;
        text-align: center;
    }
    .footer-con {
        height: 100%;
        width: 100%;
        display: flex;
        // margin-top: 0.49rem;
        align-items: center;
        .cancel {
            width: 2.21rem;
            height: 0.52rem;
            border-radius: 0.1rem;
            font-size: 0.25rem;
            background: #fff;
            color: #333333;
            margin: 0.49rem 0.21rem 0.2rem 0.29rem;
        }
        .confirm {
            width: 2.21rem;
            height: 0.52rem;
            border-radius: 0.1rem;
            font-size: 0.25rem;
            border: 0.01rem solid #3e83f8;
            background: #3e83f8 100%;
            color: #fff;
            margin: 0.49rem 0.29rem 0.2rem 0rem;
        }
    }
}
</style>
