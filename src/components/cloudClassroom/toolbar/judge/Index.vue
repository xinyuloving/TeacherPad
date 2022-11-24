<template>
    <TDialog
        :dialogConStyle="{
            width: '8.17rem',
            height: '5.37rem',
            background: '#EFEFFA',
        }"
        :appendToBody="true"
        @close="close"
        :visible="visible"
        :closeByTouchModal="true"
    >
        <!-- 判断题 -->
        <JudgeMain @close="close" />
    </TDialog>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
const { mapMutations, mapState } = createNamespacedHelpers("cloudClassroom");
import TDialog from "@/components/FunctionalComp/TDialog.vue";
import JudgeMain from "./JudgeMain.vue";
export default {
    components: {
        TDialog,
        JudgeMain,
    },
    computed: {
        ...mapState({
            visible: (state) => state.toolbar.judge.visible,
        }),
    },
    methods: {
        ...mapMutations({
            judgeSet: "toolbar/judge/setState",
            toolSet: "toolbar/setState",
        }),
        close() {
            // 关闭 弹窗
            this.judgeSet({ key: "visible", value: false });
            this.toolSet({ key: "childrenActive", value: -1 });
        },
    },
};
</script>
