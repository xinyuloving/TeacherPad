<template>
    <TDialog
        :dialogConStyle="{ width: '8.17rem', height: '6.19rem' }"
        :visible="visible"
        @close="close"
        customClass="distribute-dialog"
        :appendToBody="true"
        :closeByTouchModal="true"
    >
        <!-- 内容分发 -->
        <DialogMain @close="close" />
    </TDialog>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
import TDialog from "@/components/FunctionalComp/TDialog.vue";
import DialogMain from "./DialogMain.vue";
const { mapState, mapMutations } = createNamespacedHelpers("cloudClassroom");
export default {
    components: {
        TDialog,
        DialogMain,
    },
    computed: {
        ...mapState({
            visible: (state) => state.toolbar.distribute.visible,
        }),
    },
    methods: {
        ...mapMutations({
            setState: "toolbar/distribute/setState",
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
