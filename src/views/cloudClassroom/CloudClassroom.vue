<template>
    <div class="cloud-classroom" ref="cloudIndex">
        <!-- 云课堂 -->

        <!-- 课件 -->
        <Courseware />

        <PickBar />
        <ToolBar />

        <template v-if="barrageList.length">
            <Barrage
                v-for="item in barrageList"
                :key="item.id"
                :option="item"
            />
        </template>

        <!-- 奖励小红花 -->
        <RewardPopUp />
        <!-- 答题详情 -->
        <AnswerStatistics v-if="visibleGroup.answerVisible" />
        <!-- 定时器 -->
        <Timer v-if="visibleGroup.timerVisible" />
        <!-- 选择题弹窗 关闭后打开 浮窗 -->
        <FloatWindow v-if="visibleGroup.floatWindowVisible" />
        <!-- 内容分发 -->

        <!-- 内容分发后的预览 -->
        <PreviewContainer v-if="visibleGroup.previewVisible" />
        <!-- 随堂测试下发后的展示按钮组 -->
        <ClassTestBack v-if="visibleGroup.ctBackVisible" />

        
    </div>
</template>

<script>
import PickBar from "@/components/cloudClassroom/PickBar";
import ToolBar from "@/components/cloudClassroom/ToolBar";
import Courseware from "@/components/cloudClassroom/Courseware.vue";
import Timer from "@/components/cloudClassroom/toolbar/timer/Timer.vue";
import AnswerStatistics from "@/components/cloudClassroom/toolbar/answerFeedback/AnswerStatistics.vue";
import FloatWindow from "@/components/cloudClassroom/toolbar/answerFeedback/FloatWindow.vue";
import PreviewContainer from "@/components/cloudClassroom/toolbar/distribute/PreviewContainer.vue";
import RewardPopUp from "@/components/cloudClassroom/RewardPopUp.vue";
import Barrage from "@/components/cloudClassroom/Barrage.vue";

import ClassTestBack from "@/components/cloudClassroom/toolbar/classTest/ClassTestBack.vue";
import { createNamespacedHelpers } from "vuex";
const { mapState } = createNamespacedHelpers("cloudClassroom");
export default {
    name: "CloudClassroom",
    components: {
        ToolBar,
        PickBar,
        FloatWindow,
        AnswerStatistics,
        Timer,
        Barrage,
        PreviewContainer,
        ClassTestBack,
        RewardPopUp,
        Courseware,
    },
    data() {
        return {
            uploadVisible: false,
        };
    },
    computed: {
        ...mapState({
            visibleGroup: (state) => ({
                toolbarVisible: state.toolbarVisible,
                pickbarVisible: state.pickbarVisible,
                answerVisible: state.toolbar.answer.visible,
                floatWindowVisible: state.toolbar.floatWindow.visible,
                timerVisible: state.toolbar.timer.timerVisible,
                ctBackVisible: state.toolbar.classTest.ctBackVisible,
                previewVisible: state.toolbar.distribute.previewVisible,
            }),
            barrageList: (state) => state.barrageList,
        }),
    },
};
</script>

<style lang="less" scoped>
.cloud-classroom {
    width: 100%;
    height: 100%;
    background: #f0f5fd;
    overflow: hidden;
    position: relative;
}
</style>
