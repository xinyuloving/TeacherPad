<template>
    <div class="before-classroom" :style="{ opacity: opacity }">
        <div class="header">
            <div class="title">
                <span>{{ className }}</span>
                <span>{{ subjectName }}</span>
            </div>
            <div class="out" v-touch="close">
                <i class="iconfont icon-close"></i>
            </div>
        </div>
        <div class="content">
            <div class="left-box">
                <div class="number-of-people">
                    <span>{{ studentNum }}</span
                    >/{{ studentSum }}
                </div>
                <div class="seat-box">
                    <SeatingPlan :row="row" :column="column" />
                </div>
            </div>
            <div class="right-box">
                <div class="top">
                    <div class="title">已关联课件</div>
                    <div class="kejian">
                        <div class="upload" v-touch="upload">
                            <i class="iconfont icon-zengjia"></i>
                        </div>
                        <div class="text">最多上传3个课件</div>
                        <div class="courseware-box">
                            <div
                                class="courseware-item"
                                v-for="(item, index) in coursewareList"
                                :key="index"
                            >
                                <div class="icon">
                                    <img
                                        :src="
                                            require(`@/assets/img/home/homeTools/PrepareLessons/${item.suffix}.png`)
                                        "
                                    />
                                    <div
                                        class="del"
                                        v-touch="
                                            () => {
                                                delCourseware(index);
                                            }
                                        "
                                    >
                                        <div></div>
                                    </div>
                                </div>
                                <div class="courseware-name">
                                    {{ item.name }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <TButton class="in-classroom" v-touch="inCloudClass">
                    <span>进入教室</span>
                    <!-- <svg-icon iconClass="in_class" /> -->
                    <img src="~@/assets/img/home/in_classroom.png" />
                </TButton>
            </div>
        </div>

        <AddCourseware />
    </div>
</template>

<script>
import TButton from "@/components/FunctionalComp/TButton.vue";
import SeatingPlan from "./SeatingPlan.vue";
import sendMessage from "@/utils/sendMessage";
import { mapMutations, mapState } from "vuex";
import AddCourseware from "@/components/cloudClassroom/toolbar/addCourseware/Index.vue";
import { startHeartbeat } from "@/utils/heartbeat";

export default {
    name: "BeforeClassroom",

    props: {
        className: String,
        subjectName: String,
        row: Number,
        column: Number,
        groupID: String,
        type: Boolean,
    },

    components: {
        TButton,
        SeatingPlan,
        AddCourseware,
    },

    data() {
        return {
            opacity: 0,
            num: 0,
            throttle: false,
        };
    },

    computed: {
        ...mapState("inCloudClassroom", [
            "studentNum",
            "studentSum",
            "classroomInfo",
        ]),
        ...mapState("signCourseware", ["coursewareList"]),
    },

    methods: {
        ...mapMutations("inCloudClassroom", [
            "createSeatingPlan",
            "setState",
            "emptyState",
            "emptyData",
        ]),
        ...mapMutations({
            toolSet: "cloudClassroom/toolbar/setState",
        }),
        ...mapMutations("signCourseware", [
            "removeCoursewareList",
            "setClassroomInfo",
        ]),
        // 关闭
        close() {
            this.$emit("begin", {
                subjectName: "",
                className: "",
                type: true,
            });
            this.emptyState();
            this.emptyData();
            this.setState({ key: "visible", value: false });
        },
        // 上传课件
        upload() {
            this.toolSet({ key: "addCoursewareVisible", value: true });
            this.setClassroomInfo({
                className: this.className,
                subjectName: this.subjectName,
                groupID: this.groupID,
                row: this.row,
                column: this.column,
                type: this.type,
            });
            // this.$router.push({name: 'CoursewareList', params: {type: 1}})
        },
        // 删除课件
        delCourseware(index) {
            this.removeCoursewareList(index);
        },
        // 进入云课堂
        async inCloudClass() {
            try {
                if (this.throttle) return;
                this.throttle = true;
                await sendMessage({
                    content: "ccl_1",
                    extension: JSON.stringify({
                        flag: 1,
                        groupId: this.groupID,
                        subjectName: this.classroomInfo.subjectName,
                    }),
                });
                this.setState({ key: "visible", value: false });
                this.setState({ key: "whetherToEnter", value: true });
                startHeartbeat(); // 开启心跳
                this.$router.push({ name: "CloudClassroom" });
            } catch (err) {
                this.$message({
                    message: "进入云课堂失败，请尝试重新进入！",
                    type: "error",
                });
                this.throttle = false;
                console.log(err);
            }
        },
    },

    mounted() {
        setTimeout(() => {
            this.opacity = 1;
        }, 0);
    },

    created() {
        // this.createSeatingPlan({
        //     column: this.column,
        //     row: this.row
        // })
    },
};
</script>

<style lang="less" scoped>
.before-classroom {
    width: 14.35rem;
    height: 8.66rem;
    padding-top: 0.25rem;
    transition: opacity 1s;
    .header {
        display: flex;
        justify-content: space-between;
        padding: 0 0.32rem 0 0.52rem;
        margin-bottom: 0.16rem;
        .title {
            line-height: 0.8rem;
            font-size: 0.33rem;
            font-weight: 600;
            color: #3b444c;
            span {
                margin-right: 0.2rem;
            }
        }
        .out {
            width: 0.8rem;
            height: 0.8rem;
            border-radius: 50%;
            background-color: #dbdbdb;
            display: flex;
            justify-content: center;
            align-items: center;
            i {
                font-size: 0.5rem;
                font-weight: 600;
                color: #fff;
            }
        }
    }
    .content {
        padding: 0 0.52rem;
        height: 6.82rem;
        display: flex;
        .left-box {
            width: 8.33rem;
            height: 100%;
            margin-right: 0.42rem;
            box-shadow: 0rem 0.01rem 0.04rem 0rem rgba(217, 221, 226, 0.5);
            background-color: #fff;
            border-radius: 0.16rem;
            padding: 0 0.4rem 0.2rem 0.4rem;
            position: relative;
            display: flex;
            flex-direction: column;
            .number-of-people {
                font-size: 0.48rem;
                font-weight: 600;
                font-family: PingFangSC-Semibold, PingFang SC;
                text-align: center;
                span {
                    color: #518ff8;
                }
            }
            .seat-box {
                flex: 1;
            }
        }
        .right-box {
            width: 4.52rem;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            .top {
                height: 4.15rem;
                box-shadow: 0rem 0.01rem 0.04rem 0rem rgba(217, 221, 226, 0.5);
                border-radius: 0.16rem;
                background-color: #fff;
                display: flex;
                flex-direction: column;
                .courseware-box {
                    margin-top: 0.2rem;
                    font-size: 0.21rem;
                    color: #333;
                    display: flex;
                    justify-content: space-evenly;
                    .courseware-item {
                        display: flex;
                        flex-direction: column;
                        width: 1.15rem;
                        align-items: center;
                        .icon {
                            width: 0.5rem;
                            height: 0.52rem;
                            position: relative;
                            img {
                                width: 100%;
                            }
                            .del {
                                position: absolute;
                                width: 0.25rem;
                                height: 0.25rem;
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                border-radius: 50%;
                                background-color: #f55f5f;
                                top: -0.05rem;
                                right: -0.05rem;
                                div {
                                    width: 0.13rem;
                                    height: 0.03rem;
                                    background-color: #fff;
                                }
                            }
                        }
                        .courseware-name {
                            text-overflow: -o-ellipsis-lastline;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            display: -webkit-box;
                            -webkit-line-clamp: 2;
                            line-clamp: 2;
                            -webkit-box-orient: vertical;
                            width: 100%;
                        }
                    }
                }
                .title {
                    border-bottom: 1px solid #ededed;
                    font-size: 0.27rem;
                    font-weight: 500;
                    color: #666;
                    padding-left: 0.2rem;
                    line-height: 0.65rem;
                    position: relative;
                    &::before {
                        content: "";
                        width: 0.04rem;
                        height: 0.29rem;
                        background-color: #518ff8;
                        display: inline-block;
                        position: absolute;
                        top: 0.18rem;
                        left: 0;
                    }
                }
                .kejian {
                    flex: 1;
                    padding: 0.5rem 0 0.14rem;
                    text-align: center;
                    color: #999;
                    .upload {
                        border: 0.02rem dashed #979797;
                        width: 1.06rem;
                        height: 1.06rem;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        margin: auto;
                        font-weight: 500;
                        i {
                            font-size: 0.5rem;
                        }
                    }
                    .text {
                        font-size: 0.17rem;
                        margin-top: 0.1rem;
                    }
                }
            }
            .in-classroom {
                width: 100%;
                height: 2.27rem;
                color: #fff;
                background: linear-gradient(90deg, #4a8cfc 0%, #5ec2ff 100%);
                font-size: 0.42rem;
                font-weight: 500;
                span {
                    margin-right: 0.3rem;
                }
                img {
                    width: 0.79rem;
                }
            }
        }
    }
}
</style>