<template>
    <TDialog
        customClass="timer_dialog_con"
        :visible="visible"
        :appendToBody="true"
        :showClose="false"
        class="timer_dialog"
    >
        <template v-slot:header>
            <div class="head-con">
                <span class="head_text"
                    >请<span class="high_light">滑动</span>设置倒计时时间</span
                >
            </div>
        </template>
        <template v-slot:default>
            <TimerMain />
        </template>
    </TDialog>
</template>

<script>
import TDialog from "@/components/FunctionalComp/TDialog.vue";
import { createNamespacedHelpers } from "vuex";
import TimerMain from "./TimerMain.vue";
const { mapState } = createNamespacedHelpers("cloudClassroom");
export default {
    components: {
        TDialog,
        TimerMain,
    },

    computed: {
        ...mapState({
            visible: (state) => state.toolbar.timer.timerDialogVisible,
        }),
    },
};
</script>

<style lang="less" scoped>
.timer_dialog_con {
    .head-con {
        width: 100%;
        height: 1.07rem;
        display: flex;
        justify-content: center;
        align-items: center;
        .head_text {
            font-size: 0.28rem;
            font-weight: 600;
            color: #ffffff;
            .high_light {
                // color: #fff;
                font-size: 0.3rem;
            }
        }
    }
}
</style>
<style lang="less">
.timer_dialog {
    .timer_dialog_con {
        width: 10.34rem;
        height: 5.89rem;
        background: #24242c;
        box-shadow: 0rem 0.1rem 0.4rem 0rem rgba(24, 22, 34, 0.6);
        border: 0.04rem solid #4d4d5d;
    }
}
</style>