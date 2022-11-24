<template>
    <div class="class_test_main" v-loading="loading">
        <div class="head_add_courseware">
            <i
                v-if="levelList.length > 1"
                v-touch="goback"
                class="iconfont icon-left back"
            ></i>
            <span class="d-head single_elli">{{
                folderNames[folderNames.length - 1]
            }}</span>
        </div>
        <div class="main-con scroll scroll-r">
            <TList
                :levelList.sync="levelList"
                :selectedValue.sync="selectedValue"
                :listData="listData"
                @itemTouch="handleFileItemTouch"
                :props="listProps"
            />
        </div>
        <Message :start="isStart" text="您还没有选择文件！" />

        <div class="footer-con">
            <TButton class="cancel" @touch="close"> 取消 </TButton>
            <TButton class="confirm" @touch="confirm"> 确认 </TButton>
        </div>
    </div>
</template>

<script>
import TButton from "@/components/FunctionalComp/TButton.vue";
import Message from "@/components/FunctionalComp/Message.vue";
import TList from "@/components/FunctionalComp/list/TList.vue";
import { onParentIdList, queryTestPaper } from "@/api/document";
import { createNamespacedHelpers, mapGetters } from "vuex";
const { mapMutations, mapState } = createNamespacedHelpers("cloudClassroom");
import cos from "@/utils/cos";
export default {
    components: {
        TButton,
        Message,
        TList,
    },
    data() {
        return {
            listData: [],
            folderNames: ["选择文件"], // 文件夹名字所组成的数组
            levelList: [-1], // 以 文件夹唯一标识符 组成的层级数组，这里以id为唯一标识符
            selectedValue: [], // 选中的文件，以数组的形式 --> 必传项，且用 sync 修饰
            isStart: false,
            listProps: {
                lazy: true,
                lazyLoad: this.getClassTestList,
            },
            loading: false,
        };
    },
    computed: {
        ...mapState({
            visible: (state) => state.toolbar.classTest.visible,
        }),
        ...mapGetters({
            schoolCode: "schoolCode",
            teacherId: "teacherId",
        }),
    },
    // created() {
    //     this.levelList.push(-1);
    // },
    methods: {
        ...mapMutations({
            handleDisabled: "toolbar/handleDisabled",
            setState: "toolbar/classTest/setState",
            toolbarSet: "toolbar/setState",
        }),
        close() {
            // 关闭 弹窗
            this.$emit("close");
            this.folderNames = ["选择文件"];
            this.levelList = this.levelList.slice(0, 1);
        },
        async getFileInfo(item) {
            try {
                item.cosName = item.topic;
                item.topic = await cos.getFile({
                    type: 1,
                    key: item.topic,
                });
            } catch (err) {
                console.log(err);
            }
        },
        async confirm() {
            if (this.selectedValue.length) {
                try {
                    this.loading = true;
                    const {
                        data: { name, questionsList: examList },
                    } = await queryTestPaper({
                        examPaperId: this.selectedValue[0],
                    });
                    console.log(examList);
                    for (let i = 0; i < examList.length; i++) {
                        const e = examList[i];
                        await this.getFileInfo(e);
                    }
                    this.setState({
                        key: "selectFile",
                        value: {
                            examList,
                            name,
                            examPaperId: this.selectedValue[0],
                        },
                    });
                    if (!this.visible) return;
                    this.setState({ key: "previewVisible", value: true });
                } catch (error) {
                    this.$message({
                        type: "error",
                        message: "试卷预览失败，请重新尝试",
                    });
                } finally {
                    this.loading = false;
                }
            } else {
                this.isStart = true;
                setTimeout(() => {
                    this.isStart = false;
                }, 2000);
            }
        },
        goback() {
            // 回退功能
            this.levelList.pop();
            this.folderNames.pop();
        },
        handleFileItemTouch(item) {
            // 点击每一项所触发的函数
            console.log(item);
            if (item.type) {
                // this.examName = item.name;
            } else {
                this.folderNames.push(item.name);
            }
        },
        async getClassTestList() {
            const { data } = await onParentIdList({
                schoolCode: this.schoolCode,
                creatorId: this.teacherId,
                parentId: this.levelList[this.levelList.length - 1],
            });
            return this.formatData(data);
        },
        formatData(data) {
            if (data) {
                const folderList = [];
                const fileList = [];
                for (let i = 0; i < data.length; i++) {
                    const e = data[i];
                    const temObj = { ...e };
                    if (temObj.type) {
                        temObj.suffix = "courseware";
                        fileList.push(temObj);
                    } else {
                        temObj.suffix = "folder";
                        folderList.push(temObj);
                    }
                }
                return folderList.concat(fileList);
            } else {
                return [];
            }
        },
    },
};
</script>

<style lang="less" scoped>
.class_test_main {
    width: 100%;
    // .head-con {
    //     width: 100%;
    //     height: 0.68rem;
    //     display: flex;
    //     justify-content: center;
    //     align-items: center;
    //     border-bottom: 0.01rem solid #dedede;
    //     position: relative;
    //     .d-head {
    //         font-size: 0.26rem;
    //         font-weight: 600;
    //         color: #333333;
    //     }
    //     .my-icon {
    //         position: absolute;
    //         right: 0;
    //         top: 50%;
    //         transform: translateY(-50%);
    //         margin-right: 0.3rem;
    //         font-size: 0.35rem;
    //     }
    //     .back {
    //         position: absolute;
    //         left: 0;
    //         top: 50%;
    //         transform: translateY(-50%);
    //         margin-left: 0.3rem;
    //         font-size: 0.25rem;
    //         color: #333333;
    //     }
    // }
    .main-con {
        width: 100%;
        height: 4.57rem;
    }
    .footer-con {
        width: 100%;
        height: 0.96rem;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        padding: 0 0.29rem;
        .cancel {
            width: 1.33rem;
            height: 0.5rem;
            border-radius: 0.08rem;
            font-size: 0.23rem;
            color: #333333;
            background: #fff;
            border: 0.01rem solid #979797;
            margin: 0 0.17rem 0 0;
        }
        .confirm {
            width: 1.33rem;
            height: 0.5rem;
            border-radius: 0.08rem;
            font-size: 0.23rem;
        }
    }
}
</style>