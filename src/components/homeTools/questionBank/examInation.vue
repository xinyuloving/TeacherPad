<template>
    <div class="prepare-preview">
        <div class="header-but">
            <TButton class="addTopic" @touch="addTopic"> + 添加题目 </TButton>
            <TButton class="release" @touch="save" :disabled="forbidSave"
                >保存</TButton
            >
        </div>
        <div class="test" ref="test">
            <div class="testName">
                <input type="text" v-model="testPaperName" />
            </div>
            <div v-for="(item, index) in topicList" :key="index">
                <YetAddOfItem
                    v-if="!item.editable"
                    :index="index"
                    @updateTopic="updateTopic"
                    @removeTopic="isRemoveTopic"
                    :subject="item"
                ></YetAddOfItem>
                <TestPaperItem
                    ref="testPaperItem"
                    v-else
                    v-bind.sync="topicList[index]"
                    :index="index"
                    @affirmAdd="newTopic"
                    @affirmUpdate="updateExam"
                ></TestPaperItem>
            </div>
        </div>

        <!-- 弹框 -->
        <ReconfirmDialog
            :config="dialogConfig"
            @affirm="reconfirm"
            :isDialog.sync="isDialog"
        />
        <!-- 加载状态 -->
        <Loading v-show="isLoading" />
    </div>
</template>
<script>
import TButton from "@/components/FunctionalComp/TButton.vue";
import YetAddOfItem from "./yetAddOfItem.vue";
import TestPaperItem from "./testPaperItem.vue";
import Loading from "@/components/FunctionalComp/Loading.vue";
import {
    updateTestPaper,
    queryTestPaper,
    updateDocumentName,
    removeDocument,
    publish,
} from "@/api/document";
import cos from "@/utils/cos";
import ReconfirmDialog from "@/components/mixins/reconfirmDialog.js";
import { mapState, mapMutations } from "vuex";
export default {
    name: "ExamInation",
    components: {
        TButton,
        YetAddOfItem,
        TestPaperItem,
        Loading,
    },
    mixins: [ReconfirmDialog],
    watch: {
        testPaperName(val) {
            // 正则匹配去除特殊字符
            const reg = new RegExp(
                "[`~!@#$^&*=|{}':;',\\[\\].<>/?~！@#￥……&*——|{}【】‘；：”“'。，、？%]",
                "g"
            );
            this.testPaperName = val.replace(reg, "");
            // 限制长度
            const n = val.length;
            if (n > 100) {
                this.$message({
                    message: "文件名最多100个字符",
                    type: "warning",
                });
                this.fileName = val.slice(0, 100);
            }
            this.dataUpdate();
        },
        "newTopicList.length": {
            handler() {
                this.dataUpdate();
            },
        },
        "removeTopicList.length": {
            handler() {
                this.dataUpdate();
            },
        },
        "updateTopicList.length": {
            handler() {
                this.dataUpdate();
            },
        },
        isClick(val) {
            if (!val) return;
            if (this.forbidSave && this.sourceList.length) {
                this.$router.push({ path: "/" });
            } else if (this.forbidSave && !this.sourceList.length) {
                this.deleteDocument(0);
            } else {
                this.delReconfirm("提示", "当前试卷尚未保存，是否确认退出！");
            }
        },
        navClick(val) {
            if (!val) return;
            if (this.forbidSave && this.sourceList.length) {
                this.$emit("updateNav");
            } else if (this.forbidSave && !this.sourceList.length) {
                this.deleteDocument(1);
            } else {
                this.delReconfirm("提示", "当前试卷尚未保存，是否确认退出！");
            }
        },
        isDialog(val) {
            if (val) return;
            this.setState({ key: "isClick", val: false });
            this.setState({ key: "navClick", val: false });
        },
    },
    data() {
        return {
            topicList: [],
            newTopicList: [], // 新增题目的数组
            removeTopicList: [], // 删除题目的数组
            testPaperName: "", // 试卷名
            removeIndex: null,
            teacherId: this.$store.getters.teacherId, // 教师id
            schoolCode: this.$store.getters.schoolCode, // 学校id
            topicSum: "",
            isLoading: false,
            counter: 0, // 计数器
            sourceList: [],
            updateTopicList: [],
            idCounter: 0,
            forbidSave: true, // 禁用保存按键
            needData: {},
        };
    },
    props: {
        // 试卷id
        id: {
            type: [Number, String],
            required: true,
        },
        examName: String,
    },
    computed: {
        ...mapState("questionBank", ["isClick", "navClick"]),
    },
    methods: {
        ...mapMutations("questionBank", ["setState"]),
        // 弹框二次确认事件
        reconfirm() {
            if (this.isClick) {
                this.isDialog = false;
                if (this.sourceList.length) {
                    this.$router.push({ path: "/" });
                } else {
                    this.deleteDocument(0);
                }
            } else if (this.navClick) {
                this.isDialog = false;
                if (this.sourceList.length) {
                    this.$emit("updateNav");
                } else {
                    setTimeout(() => {
                        this.deleteDocument(1);
                    }, 200);
                }
            } else {
                this.removeTopic();
            }
        },
        // 数据发送改变时
        dataUpdate() {
            if (
                this.testPaperName !== this.examName ||
                this.newTopicList.length ||
                this.updateTopicList.length ||
                this.removeTopicList.length
            ) {
                this.forbidSave = false;
            } else {
                this.forbidSave = true;
            }
        },
        // 保存
        async save() {
            try {
                const num =
                    this.newTopicList.length + this.updateTopicList.length;
                if (this.testPaperName !== this.examName) {
                    this.isLoading = true;
                    this.needData.updateDocName = {
                        documentId: this.id,
                        documentName: this.testPaperName,
                    };
                    if (!num && !this.removeTopicList.length) {
                        this.updateTest(true);
                    }
                }
                if (this.removeTopicList.length) {
                    this.isLoading = true;
                    let delData = this.removeTopicList.map((item) => item.id);
                    this.needData.removeQuestion = {
                        examPaperId: this.id,
                        list: delData,
                    };
                    if (!num) {
                        this.updateTest();
                    }
                }
                if (this.newTopicList.length) {
                    this.isLoading = true;
                    this.newTopicList.forEach(async (item) => {
                        try {
                            const res = await cos.seniorFile({
                                type: 1,
                                file: item.topic,
                            });
                            if (!this.needData.addQuestionsList) {
                                this.needData.addQuestionsList = {
                                    examPaperId: this.id,
                                    list: [],
                                };
                            }
                            this.needData.addQuestionsList.list.push({
                                analysis: item.analysis,
                                answer: item.answer,
                                options: item.options,
                                score: item.score,
                                topic: res.fileName,
                                type: item.type,
                            });
                            this.count(0, num);
                        } catch (err) {
                            this.count(0, num);
                            console.log(err);
                        }
                    });
                }
                if (this.updateTopicList.length) {
                    this.isLoading = true;
                    this.updateTopicList.forEach(async (item) => {
                        try {
                            await cos.seniorFile({
                                type: 1,
                                file: item.topic,
                                key: item.cosName,
                            });
                            if (!this.needData.updateQuestionList) {
                                this.needData.updateQuestionList = {
                                    examPaperId: this.id,
                                    list: [],
                                };
                            }
                            this.needData.updateQuestionList.list.push({
                                analysis: item.analysis,
                                answer: item.answer,
                                options: item.options,
                                score: item.score,
                                topic: item.cosName,
                                type: item.type,
                                id: item.id,
                            });
                            this.count(0, num);
                        } catch (err) {
                            this.count(0, num);
                            console.log(err);
                        }
                    });
                }
            } catch (err) {
                console.log(err);
            }
        },
        // 添加题目
        addTopic() {
            const arr = this.topicList.filter((item) => item.editable);
            if (!arr.length) {
                this.topicList.push({
                    analysis: "",
                    answer: "",
                    examPaperId: this.id,
                    options: 0,
                    score: "",
                    topic: "",
                    type: 0,
                    editable: true,
                    id: -1 - this.idCounter,
                });
                this.idCounter++;
                this.scrollToBottom();
            } else {
                this.$message({
                    message: "当前已有题目正在编辑中！",
                    type: "error",
                });
            }
        },
        // 新增试卷
        newTestPaper(obj) {
            console.log(obj);
        },
        // 修改试卷
        updateExam(index) {
            console.log(index);
            const obj = this.topicList[index];
            obj.editable = false;
            console.log(obj);
            if (obj.id >= 0) {
                const n = this.updateTopicList.findIndex(
                    (item) => item.id === obj.id
                );
                if (n !== -1) {
                    this.updateTopicList.splice(n, 1, obj);
                } else {
                    this.updateTopicList.push(obj);
                }
            }
        },
        // 新增题目
        async newTopic(index) {
            console.log(index);
            this.topicList[index].editable = false;
            this.newTopicList.push(this.topicList[index]);
        },
        // 获取试卷详情
        async queryTestPaper() {
            try {
                this.isLoading = true;
                const { data } = await queryTestPaper({ examPaperId: this.id });
                // 记录题目总数
                this.topicSum = data.questionsList.length;
                this.sourceList = [];
                for (let i = 0; i < this.topicSum; i++) {
                    this.getFileInfo(data.questionsList[i], i);
                }
                // 如果题目列表为空
                if (this.topicSum === 0) {
                    this.topicList.push({
                        analysis: "",
                        answer: "",
                        examPaperId: this.id,
                        options: 0,
                        score: "",
                        topic: "",
                        type: 0,
                        editable: true,
                    });
                    this.isLoading = false;
                }
            } catch (err) {
                this.isLoading = false;
                this.$message({
                    message: "获取试卷失败！",
                    type: "error",
                });
                console.log(err);
            }
        },
        // 确认添加题目
        async updateTest(flag) {
            try {
                this.isLoading = true;
                console.log(this.needData);
                await updateTestPaper(JSON.stringify(this.needData));
                if (this.testPaperName !== this.examName) {
                    this.$emit("update:examName", this.testPaperName);
                }
                if (flag) {
                    this.isLoading = false;
                } else {
                    this.topicSum = this.topicList.length;
                    this.removeTopicList = [];
                    this.updateTopicList = [];
                    this.newTopicList = [];
                    this.queryTestPaper();
                }
                this.forbidSave = true;
                this.needData = {};
                this.$message({
                    message: "保存成功",
                    type: "success",
                });
            } catch (err) {
                this.needData = {};
                this.isLoading = false;
                this.$message({
                    message: "失败",
                    type: "error",
                });
                console.log(err);
            }
        },

        // 修改题目
        updateTopic(index) {
            this.topicList[index].editable = true;
        },

        // 是否删除题目
        isRemoveTopic(index) {
            this.removeIndex = index;
            this.delReconfirm();
        },

        // 删除题目
        removeTopic() {
            const obj = this.topicList[this.removeIndex];
            const n = this.newTopicList.findIndex((item) => item.id === obj.id);
            if (n !== -1) {
                this.newTopicList.splice(n, 1);
            } else {
                this.removeTopicList.push(obj);
                const i = this.updateTopicList.findIndex(
                    (item) => item.id === obj.id
                );
                if (i !== -1) this.updateTopicList.splice(i, 1);
            }
            this.topicList.splice(this.removeIndex, 1);
            this.isDialog = false;
        },

        // 删除试卷
        async deleteDocument(type) {
            try {
                if (!type) {
                    const timer = setTimeout(() => {
                        this.$router.push({ path: "/" });
                    }, 100);
                } else {
                    this.isLoading = true;
                }
                await removeDocument(
                    JSON.stringify({
                        creatorId: this.teacherId,
                        documentId: this.id,
                        schoolCode: this.schoolCode,
                        namespace: "my_questionbank",
                    })
                );
                throw new Error();
            } catch (err) {
                if (type) {
                    this.$emit("updateNav");
                }
                console.log(err);
            }
        },
        // 滚动条出现在最底部
        scrollToBottom() {
            this.$nextTick(() => {
                // console.log(this.$refs.test.scrollHeight);
                this.$refs.test.scrollTop = this.$refs.test.scrollHeight;
            });
        },
        // 获取题目
        async getFileInfo(item, i) {
            try {
                item.cosName = item.topic;
                item.editable = false;
                item.topic = await cos.getFile({
                    type: 1,
                    key: item.topic,
                });
                this.sourceList[i] = item;
                this.count(1, this.topicSum);
            } catch (err) {
                this.count();
                console.log(err);
            }
        },
        // 计数
        count(type, sum) {
            this.counter++;
            if (type) {
                // 关闭loading效果
                if (sum <= this.counter) {
                    this.isLoading = false;
                    this.counter = 0;
                    this.topicList = [];
                    this.sourceList.forEach((item) => {
                        this.topicList.push({ ...item });
                    });
                }
            } else {
                if (sum <= this.counter) {
                    this.counter = 0;
                    this.updateTest();
                }
            }
        },
        // 文件名处理
        getFileName(file) {
            return file.slice(file.lastIndexOf("/") + 1);
        },
    },
    created() {
        this.testPaperName = this.examName;
        this.queryTestPaper();
    },
    beforeDestroy() {
        this.setState({ key: "toHome", val: true });
        this.setState({ key: "isClick", val: false });
        this.setState({ key: "navClick", val: false });
    },
};
</script>
<style lang="less" scoped>
.prepare-preview {
    position: relative;
    width: 100%;
    height: 8rem;
    background: #ffffff;
    border-radius: 0.21rem;
    .header-but {
        display: flex;
        justify-content: flex-end;
        margin-bottom: 10px;
        .addTopic {
            width: 1.48rem;
            height: 0.4rem;
            font-size: 0.21rem;
            background: #ffffff;
            color: #3e83f8;
            font-weight: 400;
            border-radius: 0.08rem;
            border: 0.01rem solid #3e83f8;
        }
        .release {
            width: 1.48rem;
            height: 0.4rem;
            font-size: 0.21rem;
            background: #3e83f8;
            color: #fff;
            font-weight: 400;
            border-radius: 0.08rem;
            border: 0.01rem solid #3e83f8;
        }
        button {
            margin-left: 10px;
        }
    }
}
.test {
    width: 15.54rem;
    height: 7.5rem;
    // margin: 1rem 0.58rem 0 0.58rem;
    position: absolute;
    overflow-y: auto;
    background-color: #f6f7f9;
    padding: 0.3rem 0.4rem;
    border-radius: 5px;
    transition: all 1s;

    .testName {
        font-size: 0.35rem;
        text-align: center;
        font-weight: 500;
        line-height: 2;
        input {
            border: 2px solid #ccc;
            border-radius: 2px;
            font-size: 0.35rem;
            padding: 0.05rem 0 0.05rem 0.1rem;
            text-align: center;
        }
    }
}
</style>
