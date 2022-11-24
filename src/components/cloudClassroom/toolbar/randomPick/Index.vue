<template>
    <TDialog
        :visible="visible"
        :dialogConStyle="{
            width: '100%',
            height: '100%',
            background: 'transparent',
        }"
        :wrapperStyle="{
            background: 'rgba(0, 0, 0, 0.7)',
        }"
        :appendToBody="true"
        :showClose="false"
    >
        <!-- 随机选人 -->
        <PickMain />
    </TDialog>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
const { mapState } = createNamespacedHelpers("cloudClassroom");
import TDialog from "@/components/FunctionalComp/TDialog.vue";
import PickMain from "./PickMain.vue";
export default {
    components: {
        TDialog,
        PickMain,
    },
    computed: {
        ...mapState({
            visible: (state) => state.toolbar.random.visible,
        }),
    },
};
</script>