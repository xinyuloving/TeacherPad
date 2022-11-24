<template>
    <TDialog
        :dialogConStyle="{ width: '8.17rem', height: '6.19rem' }"
        :appendToBody="true"
        @close="close"
        :visible="visible"
        :closeByTouchModal="true"
    >
        <!-- 导入课件 -->
        <AddMain @close="close" />
    </TDialog>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
const { mapMutations, mapState } = createNamespacedHelpers("cloudClassroom");
import TDialog from "@/components/FunctionalComp/TDialog.vue";
import AddMain from "./AddMain.vue";
export default {
    components: {
        TDialog,
        AddMain,
    },
    computed: {
        ...mapState({
            visible: (state) => state.toolbar.addCoursewareVisible,
        }),
    },
    methods: {
        ...mapMutations({
            // setState: "toolbar/addCourseware/setState",
            toolSet: "toolbar/setState",
        }),
        close() {
            // 关闭 弹窗
            this.toolSet({ key: "addCoursewareVisible", value: false });
            this.toolSet({ key: "toolActive", value: -1 });
        },
    },
};
</script>
