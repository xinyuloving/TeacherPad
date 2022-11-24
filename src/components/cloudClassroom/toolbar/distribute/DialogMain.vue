<template>
    <div class="distribute_main">
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
import { createNamespacedHelpers, mapGetters } from "vuex";
import TButton from "@/components/FunctionalComp/TButton.vue";
import sendMessage from "@/utils/sendMessage";
import Message from "@/components/FunctionalComp/Message.vue";
import TList from "@/components/FunctionalComp/list/TList.vue";
import { getCwListByParentId } from "@/api/prepareLessons";
import { formatCwResult } from "@/utils/util";
const { mapState, mapMutations } = createNamespacedHelpers("cloudClassroom");
export default {
    components: {
        TButton,
        Message,
        TList,
    },
    data() {
        return {
            listData: [],
            folderNames: ["我的课件"], // 文件夹名字所组成的数组
            levelList: [-1], // 以 文件夹唯一标识符 组成的层级数组，这里以id为唯一标识符
            selectedValue: [], // 选中的文件，以数组的形式 --> 必传项，且用 sync 修饰
            isStart: false,
            listProps: {
                lazy: true,
                lazyLoad: this.getCwList,
            },
        };
    },
    computed: {
        ...mapState({
            selectFile: (state) => state.toolbar.distribute.selectFile,
        }),
        subjectName() {
            return this.$store.state.inCloudClassroom.classroomInfo.subjectName;
        },
        ...mapGetters({
            schoolCode: "schoolCode",
            teacherId: "teacherId",
        }),
        // isFloder() {
        //     return this.folderName.includes("/");
        // },
        // showDialogTitle() {
        //     let title = "我的课件";
        //     if (this.folderName) {
        //         const nameArr = this.folderName.split("/");
        //         title = nameArr[nameArr.length - 2];
        //     }
        //     return title;
        // },
    },
    created() {
        // this.listData = await this.getCoursewareList();
        // this.levelList.push(-1);
    },
    methods: {
        ...mapMutations({
            handleDisabled: "toolbar/handleDisabled",
            setState: "toolbar/distribute/setState",
            toolbarSet: "toolbar/setState",
        }),
        close() {
            // 关闭 弹窗
            this.$emit("close");
            this.folderNames = ["我的课件"];
            this.levelList = this.levelList.slice(0, 1);
        },
        async confirm() {
            // 发送
            if (this.selectFile.name) {
                try {
                    // const content = {
                    //     name: this.selectFile.name,
                    //     suffix: this.selectFile.suffix,
                    // };
                    // console.log(content);
                    // const extension = {
                    //     flag: 1, // 开启传1， 关闭 -->  非true!
                    //     content,
                    // };

                    // await sendMessage({
                    //     content: "ccl_12",
                    //     extension: JSON.stringify(extension),
                    // });

                    this.handleDisabled();
                    this.toolbarSet({ key: "isActive", value: false });
                    this.close();
                    this.setState({
                        key: "previewVisible",
                        value: true,
                    });
                    // 看板
                    this.$store.dispatch("inCloudClassroom/dataRecords", {
                        type: "distribute",
                    });
                    // 埋点
                    this.data_triggerEvent(
                        {
                            eventId: "initiatingFun",
                            logValue: "3",
                            extraInfo: {
                                suffix: "." + this.selectFile.suffix,
                                subjectName: this.subjectName,
                            },
                        },
                        true
                    );
                } catch (error) {
                    this.$message({
                        type: "error",
                        message: "内容分发失败，请重新尝试",
                    });
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
            // const nameList = this.folderName.split("/");
            // nameList.pop();
            // if (nameList.length === 1) {
            //     this.folderName = "";
            // } else {
            //     nameList.pop();
            //     this.folderName = nameList.join("/") + "/";
            // }
        },
        handleFileItemTouch(item) {
            // 点击每一项所触发的函数
            if (item.type) {
                this.setState({
                    key: "selectFile",
                    value: {
                        name: item.tencentCosName,
                        suffix: item.suffix,
                    },
                });
            } else {
                this.folderNames.push(item.name);
            }
        },
        async getCwList() {
            const { data } = await getCwListByParentId({
                schoolCode: this.schoolCode,
                creatorId: this.teacherId,
                parentId: this.levelList[this.levelList.length - 1],
            });
            return formatCwResult(data);
        },
    },
};
</script>

<style lang="less" scoped>
.distribute_main {
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
    //         width: 6rem;
    //         text-align: center;
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