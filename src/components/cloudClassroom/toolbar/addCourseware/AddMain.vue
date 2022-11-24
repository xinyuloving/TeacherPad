<template>
    <div class="add_main">
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
                :disabled="coursewareList"
                :multiple="true"
            />
        </div>
        <Message :start="isStart" :text="msg" />
        <div class="footer-con">
            <TButton class="cancel" @touch="close"> 取消 </TButton>
            <TButton class="confirm" @touch="confirm"> 确认 </TButton>
        </div>
    </div>
</template>

<script>
import { mapState, mapMutations, mapGetters } from "vuex";
import TButton from "@/components/FunctionalComp/TButton.vue";
import Message from "@/components/FunctionalComp/Message.vue";
import TList from "@/components/FunctionalComp/list/TList.vue";
import { getCwListByParentId } from "@/api/prepareLessons";
import { formatCwResult } from "@/utils/util";
let msgTimer;
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
            selectedValue: [], // 选中的文件 id ，以数组的形式 --> 必传项，且用 sync 修饰
            isStart: false,
            listProps: {
                lazy: true,
                lazyLoad: this.getCwList,
                isSelectedValue: false,
            },
            msg: "您还没有选择文件！",
        };
    },
    computed: {
        ...mapState({
            coursewareList: (state) => state.signCourseware.coursewareList,
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
            setCoursewareList: "signCourseware/setCoursewareList",
            toolbarSet: "cloudClassroom/toolbar/setState",
            // handleDisabled: "cloudClassroom/toolbar/handleDisabled",
        }),
        close() {
            // 关闭 弹窗
            this.$emit("close");
            this.folderNames = ["我的课件"];
            this.levelList = this.levelList.slice(0, 1);
        },
        confirm() {
            if (this.selectedValue.length) {
                const length =
                    this.selectedValue.length + this.coursewareList.length;
                if (length > 3) {
                    this.showMsg("抱歉，展示的课件已超过3个！");
                } else {
                    const list = this.coursewareList.concat(this.selectedValue);
                    this.setCoursewareList(list);
                    // this.handleDisabled();
                    this.toolbarSet({ key: "isActive", value: false });
                    this.close();
                }
            } else {
                this.showMsg();
            }
        },
        showMsg(msg) {
            clearTimeout(msgTimer);
            this.msg = msg || "您还没有选择文件！";
            this.isStart = true;
            msgTimer = setTimeout(() => {
                this.isStart = false;
                clearTimeout(msgTimer);
            }, 2000);
        },
        goback() {
            // 回退功能
            this.levelList.pop();
            this.folderNames.pop();
        },
        handleFileItemTouch(item) {
            // 点击每一项所触发的函数
            // console.log(item);
            if (item.type) {
                // 文件
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
.add_main {
    width: 100%;
    // .head_add_courseware {
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
<style lang="less">
.head_add_courseware {
    width: 100%;
    height: 0.68rem;
    display: flex;
    justify-content: center;
    align-items: center;
    border-bottom: 0.01rem solid #dedede;
    position: relative;
    .d-head {
        font-size: 0.26rem;
        font-weight: 600;
        color: #333333;
        width: 6rem;
        text-align: center;
    }
    .back {
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        margin-left: 0.3rem;
        font-size: 0.25rem;
        color: #333333;
    }
}
</style>