<template>
    <TDialog
        :dialogConStyle="{
            width: '8.58rem',
            height: '5.8rem',
            background: '#EFEFFA',
        }"
        :appendToBody="true"
        @close="close"
        :visible="visible"
        :closeByTouchModal="true"
    >
        <!-- 选择题弹窗 -->
        <!-- 发布题目  和  设置选项都是该组件 -->
        <ChoiceMain @close="close" />
    </TDialog>
</template>

<script>
import TDialog from "@/components/FunctionalComp/TDialog.vue";
import { createNamespacedHelpers } from "vuex";
import ChoiceMain from "./ChoiceMain.vue";
const { mapState, mapMutations } = createNamespacedHelpers("cloudClassroom");
export default {
    components: {
        TDialog,
        ChoiceMain,
    },
    computed: {
        ...mapState({
            visible: (state) => state.toolbar.choice.visible,
        }),
    },
    methods: {
        ...mapMutations({
            choiceSet: "toolbar/choice/setState",
            toolSet: "toolbar/setState",
        }),
        close() {
            // 关闭 弹窗
            this.choiceSet({ key: "visible", value: false });
            this.toolSet({ key: "childrenActive", value: -1 });
        },
    },
};
</script>
