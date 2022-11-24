<template>
    <TDialog
        customClass="preview"
        :visible="visible"
        @close="close"
        :dialogConStyle="{ width: '16.71rem', height: '8.73rem' }"
        :modal="false"
        :showClose="false"
        :closeByTouchModal="true"
        :appendToBody="true"
    >
        <!-- 随堂测试预览 -->
        <PreviewMain @close="close" />
    </TDialog>
</template>

<script>
import TDialog from "@/components/FunctionalComp/TDialog.vue";
import { createNamespacedHelpers } from "vuex";
import PreviewMain from "./PreviewMain.vue";
const { mapState, mapMutations } = createNamespacedHelpers("cloudClassroom");
export default {
    components: {
        TDialog,
        PreviewMain,
    },
    computed: {
        ...mapState({
            visible: (state) => state.toolbar.classTest.previewVisible,
        }),
    },
    methods: {
        ...mapMutations({
            setState: "toolbar/classTest/setState",
            toolbarSet: "toolbar/setState",
        }),
        close() {
            // 关闭 弹窗
            this.setState({ key: "previewVisible", value: false });
        },
    },
};
</script>

<style lang="less" scoped>
</style>