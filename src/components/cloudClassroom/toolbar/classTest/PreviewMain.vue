<template>
    <div class="preview_main">
        <div class="head-con">
            <TButton class="cancel" @touch="close"> 取消 </TButton>
            <TButton class="confirm" @touch="confirm"> 确认 </TButton>
        </div>
        <div class="main-con">
            <div class="exam-con">
                <div class="exam-title">
                    {{ selectFile.name }}
                </div>
                <div class="exam-list">
                    <YetAddOfItem
                        v-for="item in selectFile.examList"
                        :key="item.id"
                        :subject="item"
                        :showDelBtn="false"
                    />
                </div>
            </div>
            <Loading v-if="isLoading" contentText="正在发布..." />
        </div>
    </div>
</template>

<script>
import TButton from "@/components/FunctionalComp/TButton.vue";
import YetAddOfItem from "@/components/homeTools/questionBank/yetAddOfItem.vue";
import Loading from "@/components/FunctionalComp/Loading.vue";
import sendMessage from "@/utils/sendMessage";
import { publish } from "@/api/document";
import { createNamespacedHelpers, mapGetters } from "vuex";
const { mapState, mapMutations } = createNamespacedHelpers("cloudClassroom");
export default {
    components: {
        TButton,
        YetAddOfItem,
        Loading,
    },
    data() {
        return {
            previewVisible: false,
            previewName: "",
            examList: [],
            // 消息
            isLoading: false,
        };
    },
    computed: {
        ...mapState({
            selectFile: (state) => state.toolbar.classTest.selectFile,
        }),
        ...mapGetters({
            schoolCode: "schoolCode",
            teacherId: "teacherId",
            studentList: "studentList",
        }),
    },
    methods: {
        ...mapMutations({
            toolbarSet: "toolbar/setState",
            setState: "toolbar/classTest/setState",
            handleDisabled: "toolbar/handleDisabled",
        }),
        close() {
            this.$emit("close");
        },

        closeDialog() {
            this.setState({ key: "visible", value: false });
            this.toolbarSet({ key: "toolActive", value: -1 });
            this.toolbarSet({ key: "isActive", value: false });
        },

        async confirm() {
            // 先将试卷发布，再发送到学生端
            if (!this.studentList.length) {
                this.$message({
                    type: "error",
                    message: "发送失败，当前课堂没有学生！",
                });
                return;
            }
            this.isLoading = true;

            const gradeAndClassArr = Array.from(
                new Set(
                    this.studentList.map(
                        (item) =>
                            `${item.classInfo.gradeCode}-${item.classInfo.classCode}`
                    )
                )
            )
                .map((ele) => ele.split("-"))
                .map((i) =>
                    publish({
                        gradeCode: i[0],
                        classCode: i[1],
                        examPaperId: this.selectFile.examPaperId,
                        schoolCode: this.schoolCode,
                        teacherId: this.teacherId,
                    })
                );

            try {
                const result = await Promise.all(gradeAndClassArr);
                console.log(result);
                const publishList = result.map((item) => item.data);

                this.setState({ key: "publishList", value: publishList });

                const content = {
                    publishList,
                    examName: this.selectFile.name,
                };
                const extension = {
                    flag: 1, // 开启传1， 关闭 -->  非true!
                    content,
                };
                console.log(extension);
                await sendMessage({
                    content: "ccl_6",
                    extension: JSON.stringify(extension),
                });
                this.handleDisabled();
                this.isLoading = false;
                this.$tMessage("发送成功！");
                this.setState({ key: "ctBackVisible", value: true });
                this.close();
                this.closeDialog();
                // 看板
                this.$store.dispatch("inCloudClassroom/dataRecords", {
                    type: "classTest",
                });
                // 埋点
                this.data_triggerEvent(
                    {
                        eventId: "startAnswer",
                        logValue: "3",
                    },
                    true
                );
            } catch (error) {
                this.$message({
                    type: "error",
                    message: "发起随堂测试失败，请重新尝试",
                });
            }
        },
    },
};
</script>

<style lang="less" scoped>
.preview_main {
    position: relative;
    width: 100%;
    .head-con {
        border-bottom: 0;
        height: 0.8rem;
        padding: 0 0.58rem;
        width: 100%;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        .cancel {
            width: 1rem;
            height: 0.4rem;
            border-radius: 0.08rem;
            font-size: 0.2rem;
            background: transparent;
            color: #3e83f8;
        }
        .confirm {
            width: 1.33rem;
            height: 0.4rem;
            border-radius: 0.08rem;
            font-size: 0.2rem;
        }
    }
    .main-con {
        height: calc(8.73rem - 0.8rem);
        width: 100%;
        padding: 0 0.58rem;
        overflow: hidden;
        .exam-con {
            height: 100%;
            background: #f6f7f9;

            .exam-title {
                height: 0.96rem;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 0.26rem;
                font-weight: 600;
                color: #333333;
            }
            .exam-list {
                padding: 0 0.3rem;
                height: calc(100% - 0.96rem);
                overflow: scroll;
            }
        }
    }
}
</style>