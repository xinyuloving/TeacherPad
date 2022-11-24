<template>
    <div class="class-test-back" v-drag>
        <!-- 老师随堂测试发不完题目后的页面 -->
        <div class="btns">
            <TButton
                class="btn1"
                @touch="
                    () => {
                        handleTouch(1);
                    }
                "
            >
                一键收卷
            </TButton>
            <TButton
                class="btn2"
                @touch="
                    () => {
                        handleTouch(2);
                    }
                "
            >
                课后作答
            </TButton>
        </div>
    </div>
</template>

<script>
import TButton from "@/components/FunctionalComp/TButton.vue";
import sendMessage from "@/utils/sendMessage";
import { createNamespacedHelpers } from "vuex";
import drag from "@/directive/drag";
const { mapMutations } = createNamespacedHelpers("cloudClassroom");
export default {
    components: {
        TButton,
    },
    directives: {
        drag,
    },
    methods: {
        ...mapMutations({
            toolbarSet: "toolbar/setState",
            setState: "toolbar/classTest/setState",
        }),
        async handleTouch(type) {
            // 一键收卷 或者 留作业 -->  type 为 1 收卷， 2 留作业，和学生端相对应
            const extension = {
                flag: 0, // 开启传1， 关闭 -->  非true!
                content: {
                    type,
                },
            };
            await sendMessage({
                content: "ccl_6",
                extension: JSON.stringify(extension),
            });
            this.setState({ key: "ctBackVisible", value: false });
            this.toolbarSet({ key: "strongId", value: 0 });
        },
    },
};
</script>

<style lang="less" scoped>
.class-test-back {
    position: fixed;
    z-index: 6;
    // top: 3%;
    top: 0.5rem;
    // right: 1%;
    right: 0.73rem;
    border-radius: 0.1rem;
    width: 3.6rem;
    height: 0.9rem;
    padding: 0.2rem 0.3rem;
    background-color: rgba(0, 0, 0, 0.5);
    .btns {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .btn1 {
            width: 1.33rem;
            height: 0.5rem;
            border-radius: 0.08rem;
            font-size: 0.24rem;
            background: #fff;
            color: #3e83f8;
        }
        .btn2 {
            width: 1.33rem;
            height: 0.5rem;
            border-radius: 0.08rem;
            font-size: 0.24rem;
        }
    }
}
</style>