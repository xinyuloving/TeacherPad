<template>
    <TDialog
        customClass="class-test"
        :visible="visible"
        @close="close"
        :dialogConStyle="{ width: '8.17rem', height: '6.19rem' }"
        :appendToBody="true"
        :closeByTouchModal="true"
    >
        <!-- 随堂测试 -->
        <IndexMain @close="close" />
    </TDialog>
</template>

<script>
import TDialog from "@/components/FunctionalComp/TDialog.vue";
import { createNamespacedHelpers } from "vuex";
import IndexMain from "./IndexMain.vue";
const { mapState, mapMutations } = createNamespacedHelpers("cloudClassroom");
export default {
    components: {
        TDialog,
        IndexMain,
    },
    computed: {
        ...mapState({
            visible: (state) => state.toolbar.classTest.visible,
        }),
    },
    methods: {
        ...mapMutations({
            setState: "toolbar/classTest/setState",
            toolbarSet: "toolbar/setState",
        }),
        close() {
            // 关闭 弹窗
            this.setState({ key: "visible", value: false });
            this.toolbarSet({ key: "toolActive", value: -1 });
        },
    },
};
</script>
