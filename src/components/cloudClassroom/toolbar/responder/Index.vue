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
        <!-- 抢答器 -->
        <ResponderMain />
    </TDialog>
</template>

<script>
import TDialog from "@/components/FunctionalComp/TDialog.vue";
import { createNamespacedHelpers } from "vuex";
import ResponderMain from "./ResponderMain.vue";
const { mapState } = createNamespacedHelpers("cloudClassroom");
export default {
    components: {
        TDialog,
        ResponderMain,
    },
    computed: {
        ...mapState({
            visible: (state) => state.toolbar.responder.visible,
        }),
    },
};
</script>
