<template>
    <div class="look-test">
        <!-- 左侧列表 -->
        <div class="left">
            <LeftList
                v-if="studentList.length"
                @currentTest="currentTest"
                :studentList="studentList"
            />
        </div>
        <!-- 右侧详情 -->
        <div class="right" v-if="!defaultIsShow">
            <!-- 试卷内容 -->
            <div class="content" v-show="topicList.length">
                <!-- 试卷名 -->
                <div class="title">{{ testTitle }}</div>
                <!-- 试卷题目 -->
                <div class="topic-box">
                    <!-- 单选 -->
                    <div class="radio" v-if="radioList.length">
                        <div class="type-name">单选题</div>
                        <TopicItem
                            :subject="item"
                            v-for="(item, index) in radioList"
                            :key="index"
                        />
                    </div>
                    <!-- 多选 -->
                    <div class="multiple-choice" v-if="multipleList.length">
                        <div class="type-name">多选题</div>
                        <TopicItem
                            :subject="item"
                            v-for="(item, index) in multipleList"
                            :key="index"
                        />
                    </div>
                    <!-- 判断 -->
                    <div class="estimate" v-if="estimateList.length">
                        <div class="type-name">判断题</div>
                        <TopicItem
                            :subject="item"
                            v-for="(item, index) in estimateList"
                            :key="index"
                        />
                    </div>
                </div>
            </div>
            <!-- 总分 -->
            <div class="total-points">
                <div class="score">
                    <img
                        :src="require(`@/assets/img/seatwork/${item}.png`)"
                        v-for="(item, index) in total"
                        :key="index"
                    />
                </div>
            </div>
        </div>
        <!-- 加载状态 -->
        <Loading v-show="isLoading" />
        <!-- 缺省页 -->
        <div class="right" v-if="defaultIsShow">
            <DefalutPage :textContent="defalutText" :imgName="defaultImgName"></DefalutPage>
        </div>
    </div>
</template>

<script>
import { getTestInfo, getStudentList } from "@/api/classTest";
import LeftList from "@/components/homeToolsSeatwork/leftList.vue";
import TopicItem from "@/components/homeToolsSeatwork/topicItem.vue";
import TButton from "@/components/FunctionalComp/TButton.vue";
import cos from "@/utils/cos";
import Loading from "@/components/FunctionalComp/Loading.vue";
import defalutPage from '@/components/mixins/defalutPage'

export default {
    name: "LookTest",

    components: {
        LeftList,
        TopicItem,
        TButton,
        Loading,
    },

    mixins: [defalutPage],

    props: {
        testId: [Number, String],
        testTitle: String,
    },

    data() {
        return {
            teacherId: this.$store.getters.teacherId, // 教师id
            studentList: [], // 学生列表
            topicList: [], // 题目列表
            total: [], // 总分
            radioList: [], // 单选题
            multipleList: [], // 多选题
            estimateList: [], // 判断题
            counter: 0, // 计数器
            isLoading: false, // 加载状态
            currentIndex: 0, // 当前的index
        };
    },

    methods: {
        // 获取当前学生的试卷信息
        async getTestInfo(studentId, answerStatus) {
            try {
                const { data } = await getTestInfo({
                    studentId,
                    answerStatus,
                    publishId: this.testId,
                });
                // 如果返回值为空
                if (!data && !data.list) return console.log("请求数据为空");
                this.topicList = data.list;
                if (data.examPaperScore) {
                    this.total = data.examPaperScore.toString().split("");
                } else {
                    this.total = ["0"];
                }
                data.list.forEach((item) => {
                    this.getFileInfo(item);
                    // if (item.type === 0) {
                    //     // 单选
                    //     this.radioList.push(item);
                    // } else if (item.type === 1) {
                    //     // 判断
                    //     this.estimateList.push(item);
                    // } else if (item.type === 2) {
                    //     // 多选
                    //     this.multipleList.push(item);
                    // }
                });
            } catch (err) {
                this.defaultShow("not_network", "网络飞走了，刷新试试吧");
                this.defaultIsShow = true;
                this.isLoading = false;
                console.log(err);
            }
        },
        // 获取学生列表
        async getStudentList() {
            try {
                const { data } = await getStudentList({
                    publishId: this.testId,
                });
                // console.log(data);
                // 如果data有值
                if (data.length) {
                    // 去除不满足条件的数据
                    const satisfyData = data.filter((item) => item.studentName);
                    // 获取已提交试卷的学生数组
                    let submittedArr = satisfyData.filter(
                        (item) => item.answerStatus > 0
                    );
                    // 获取未提交试卷的学生数组
                    let notSubmittedArr = satisfyData.filter(
                        (item) => item.answerStatus === 0
                    );
                    // 将数组按照首字母大小进行排序 并赋值给学生列表数组
                    if (submittedArr.length)
                        submittedArr.sort((item, contrast) =>
                            item.studentName.localeCompare(
                                contrast.studentName,
                                "zh"
                            )
                        );
                    if (notSubmittedArr.length)
                        notSubmittedArr.sort((item, contrast) =>
                            item.studentName.localeCompare(
                                contrast.studentName,
                                "zh"
                            )
                        );
                    this.studentList = [...submittedArr, ...notSubmittedArr];
                    console.log(this.studentList);
                    // 获取第一位已提交学生的试卷
                    if (submittedArr.length) {
                        this.getTestInfo(
                            this.studentList[0].studentId,
                            this.studentList[0].answerStatus
                        );
                    } else {
                        this.defaultShow();
                        this.defaultIsShow = true;
                        this.isLoading = false;
                    }
                }
            } catch (err) {
                this.defaultShow("not_network", "网络飞走了，刷新试试吧");
                this.defaultIsShow = true;
                this.isLoading = false;
                console.log(err);
            }
        },
        // 当前显示的试卷
        currentTest(index) {
            this.currentIndex = index;
            this.isLoading = true;
            this.total = [];
            this.topicList = [];
            this.radioList = [];
            this.estimateList = [];
            this.multipleList = [];
            this.getTestInfo(
                this.studentList[index].studentId,
                this.studentList[index].answerStatus
            );
        },
        // 获取题目
        async getFileInfo(file) {
            try {
                file.topic = await cos.getFile({ type: 1, key: file.topic });
                // this.counter++;
                // if (this.topicList.length === this.counter) {
                //     this.counter = 0;
                //     this.isLoading = false;
                // }
                this.count()
            } catch (err) {
                // this.counter++;
                // if (this.topicList.length === this.counter) {
                //     this.counter = 0;
                //     this.isLoading = false;
                // }
                this.count()
                console.log(err);
            }
        },
        // 刷新
        refresh() {
            if (this.studentList.length) {
                const obj = this.studentList[this.currentIndex];
                this.getTestInfo(obj.studentId, obj.answerStatus);
            } else {
                this.getStudentList();
            }
        },
        count() {
            this.counter++;
            if (this.topicList.length === this.counter) {
                this.counter = 0;
                this.isLoading = false;
                this.topicList.forEach((item) => {
                    if (item.type === 0) {
                        // 单选
                        this.radioList.push(item);
                    } else if (item.type === 1) {
                        // 判断
                        this.estimateList.push(item);
                    } else if (item.type === 2) {
                        // 多选
                        this.multipleList.push(item);
                    }
                });
            }
        }
    },

    created() {
        this.isLoading = true;
        this.getStudentList();
    },
};
</script>

<style lang="less" scoped>
.look-test {
    padding: 0 0.52rem;
    display: flex;
    color: #333;
    .right {
        width: 15.67rem;
        height: 9.27rem;
        background-color: #fff;
        border-radius: 0.1rem;
        margin-left: 0.21rem;
        box-sizing: border-box;
        padding: 0.44rem 0.27rem 0.44rem 1.14rem;
        display: flex;
        .content {
            width: 100%;
            .title {
                font-size: 0.35rem;
                font-weight: 600;
                text-align: center;
            }
            .topic-box {
                overflow-y: auto;
                height: 8rem;
            }
            .radio,
            .multiple-choice,
            .estimate {
                margin-top: 0.5rem;
                .type-name {
                    font-size: 0.25rem;
                    font-weight: 600;
                }
            }
        }

        .btn {
            width: 1.83rem;
            height: 0.55rem;
        }

        .total-points {
            width: 1.9rem;
            .score {
                text-align: center;
                padding-bottom: 0.4rem;
            }
        }
    }
}
</style>