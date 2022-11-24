<template>
    <div class="file-list">
        <DefalutPage
            v-if="defaultIsShow"
            :textContent="defalutText"
            :imgName="defaultImgName"
            @refresh="getFileList"
        />
        <div class="file-list-main" v-else>
            <!-- 顶部导航 -->
            <div class="top-box">
                <Navigation :list="navList" @updateNav="updateNav" />
            </div>
            <!-- 列表展示 -->
            <div class="list-box" v-if="!isExam">
                <!-- 头部按钮区 -->
                <Header
                    :buttonList="headerButtonList"
                    @search="search"
                    @onButton="onButton"
                />
                <!-- table表格 -->
                <Table
                    ref="table"
                    :list="currentList"
                    @open="open"
                    @inputBlur="rechristen"
                    @unflodEvent="unflodEvent"
                    @checkAll="checkAll"
                    @radio="radio"
                    @updateIndex="(res) => (currentIndex = res)"
                    :allCheck="allCheck"
                />
            </div>
            <!-- 详情展示 -->
            <div class="info-box" v-if="isExam">
                <ExamInation
                    :id="examId"
                    :examName.sync="examName"
                    @updateNav="navUpdate(navObj)"
                />
            </div>
        </div>
        <!-- 加载状态 -->
        <Loading v-show="isLoading" />
        <!-- 二次确认框 -->
        <ReconfirmDialog
            :config="dialogConfig"
            :isDialog.sync="isDialog"
            @affirm="reconfirm"
            @affirmRelease="affirmRelease"
        />
    </div>
</template>

<script>
import Header from "@/components/homeToolsPublic/header.vue";
import Table from "@/components/homeToolsPublic/table.vue";
import Loading from "@/components/FunctionalComp/Loading.vue";
import TButton from "@/components/FunctionalComp/TButton.vue";
import Navigation from "@/components/FunctionalComp/Navigation.vue";
// import ExamInfo from '@/views/home/homeTools/QuestionBank/examInfo.vue'
import ExamInation from "@/components/homeTools/questionBank/examInation.vue";
import moment from "moment";
import {
    addDocument,
    removeDocument,
    updateDocumentName,
    onParentIdList,
    publish,
} from "@/api/document";
import { dataFormatting } from "@/utils/tableTreating";
import defalutPage from "@/components/mixins/defalutPage.js";
import reconfirmDialog from "@/components/mixins/reconfirmDialog.js";
import { mapMutations } from "vuex";

export default {
    name: "FileList",

    components: {
        Header,
        Table,
        Loading,
        TButton,
        Navigation,
        ExamInation,
    },

    mixins: [defalutPage, reconfirmDialog],

    data() {
        return {
            headerButtonList: [
                {
                    content: "新建试卷",
                    icon: "icon-new_test",
                },
                {
                    content: "新建文件夹",
                    icon: "icon-new_folder",
                },
                {
                    content: "发布",
                },
            ], // 按钮数据
            isLoading: false, // 是否显示加载状态框
            teacherId: this.$store.getters.teacherId, // 教师id
            schoolCode: this.$store.getters.schoolCode, // 学校id
            treeList: [], // 树状文件列表
            currentList: [], // 当前显示的列表
            parentId: -1, // 当前列表的父id
            allCheck: false, // 全选
            currentIndex: "", // 当前的索引
            navList: [{ name: "我的题库", whereTo: -1 }], // 导航数据
            isExam: false, // 是否显示试卷
            examId: -1, // 试卷id
            examName: "",
            navObj: "",
        };
    },

    watch: {
        isExam(val) {
            if (!val) return;
            this.setState({ key: "toHome", val: false });
        },
    },

    methods: {
        ...mapMutations("questionBank", ["setState"]),
        // 搜索
        search(value) {
            this.getFileList(value);
        },
        // 点击头部功能按钮
        onButton(index) {
            switch (index) {
                case "新建试卷":
                    // 新建试卷
                    this.newExam();
                    break;
                case "新建文件夹":
                    // 新建文件夹功能
                    this.newFolder();
                    break;
                case "发布":
                    // 发布功能
                    const list = this.currentList.filter(
                        (item) => item.type === 0 && item.isCheck
                    );
                    const arr = this.currentList.filter(
                        (item) => item.type && item.isCheck
                    );
                    if (list.length > 0) {
                        this.$message({
                            message: "不可选择文件夹",
                            type: "warning",
                        });
                    } else if (arr.length === 1) {
                        this.release();
                    } else if (arr.length > 1) {
                        this.$message({
                            message: "最多选择一份试卷",
                            type: "warning",
                        });
                    } else {
                        this.$message({
                            message: "请选择试卷",
                            type: "warning",
                        });
                    }
                    break;
                default:
                    break;
            }
        },
        // 确认发布发布
        affirmRelease(arr) {
            // console.log(arr);
            this.isDialog = false;
            this.isLoading = true;
            const obj = this.currentList.filter(
                (item) => item.type && item.isCheck
            )[0];
            arr.forEach(async (item) => {
                try {
                    const res = await publish(
                        JSON.stringify({
                            classCode: item.classCode,
                            examPaperId: obj.id,
                            gradeCode: item.gradeCode,
                            schoolCode: this.schoolCode,
                            teacherId: this.teacherId,
                        })
                    );
                    if (res.code === 0) {
                        console.log(item);
                        this.isLoading = false;
                        // 发布成功后触发数据上传事件
                        this.data_triggerEvent({
                            eventId: "releaseTestPapers",
                            gradeName: item.gradeName,
                            className: item.clazzName,
                        });
                        this.$message({
                            message: "发布成功",
                            type: "success",
                        });
                        obj.isCheck = false;
                        this.allCheck = false;
                    } else {
                        throw new Error(res.msg);
                    }
                } catch (err) {
                    this.isLoading = false;
                    this.$message({
                        message: "发布失败",
                        type: "error",
                    });
                    console.log(err);
                }
            });
        },
        // 更新导航
        updateNav(obj) {
            if (this.isExam) {
                this.setState({ key: "navClick", val: true });
                return (this.navObj = obj);
            }
            this.navUpdate(obj);
        },
        navUpdate(obj) {
            this.parentId = this.navList[obj.index].whereTo;
            this.navList.splice(obj.index + 1);
            this.isExam = false;
            this.getFileList();
            this.allCheck = false;
        },
        // 打开
        open(index) {
            // 增加导航数据
            this.parentId = this.currentList[index].id;
            this.navList.push({
                name: this.currentList[index].name,
                whereTo: this.currentList[index].id,
            });
            // 如果type为1打开的是试卷 为0打开的是文件夹
            if (this.currentList[index].type) {
                this.examId = this.currentList[index].id;
                this.examName = this.currentList[index].name;
                this.isExam = true;
            } else {
                this.getFileList();
            }
        },
        // 拓展框事件展开
        unflodEvent(index) {
            // index为3是重命名
            switch (index) {
                case 0:
                    // 打开
                    this.open(this.currentIndex);
                    break;
                case 1:
                    console.log("###");
                    break;
                case 3:
                    // 重命名
                    this.currentList[this.currentIndex].isInput = true;
                    break;
                case 4:
                    // 删除
                    this.delReconfirm();
                    break;
                default:
                    break;
            }
        },
        // 全选
        checkAll() {
            this.allCheck = !this.allCheck;
            this.currentList.forEach((item) => (item.isCheck = this.allCheck));
        },
        // 单选
        radio(index) {
            this.currentList[index].isCheck = !this.currentList[index].isCheck;
            this.allCheck = this.currentList.every((item) => item.isCheck);
        },
        // 重命名
        async rechristen(obj) {
            try {
                // 将输入框关闭
                this.currentList[obj.index].isInput = false;
                // 如果文件名未发生改变则跳出
                if (this.currentList[obj.index].name === obj.name || !obj.name)
                    return;
                // 开启loading效果
                this.isLoading = true;
                // 调取接口更新文件名
                const res = await updateDocumentName(
                    JSON.stringify({
                        documentName: obj.name,
                        documentId: this.currentList[obj.index].id,
                    })
                );
                if (res.code === 0) {
                    // 修改文件名
                    this.currentList[obj.index].name = obj.name;
                    this.$message({
                        message: "重命名成功",
                        type: "success",
                    });
                } else {
                    throw new Error();
                }
                // 关闭loading效果
                this.isLoading = false;
            } catch (err) {
                this.$message({
                    message: "重命名失败，请重试",
                    type: "error",
                });
                this.isLoading = false;
                console.log(err);
            }
        },
        // 二次确认
        reconfirm() {
            // 关闭确认框
            this.isDialog = false;
            switch (this.dialogConfig.type) {
                case 0:
                    // 删除
                    this.removeFile();
                    break;
            }
        },
        // 删除文件
        async removeFile() {
            try {
                // 开启loading效果
                this.isLoading = true;
                // 调取后端接口 从数据库中删除
                console.log(this.schoolCode);
                const res = await removeDocument(
                    JSON.stringify({
                        documentId: this.currentList[this.currentIndex].id,
                        schoolCode: this.schoolCode,
                        creatorId: this.teacherId,
                        namespace: "my_questionbank",
                    })
                );
                console.log(res);
                if (res.code === 0) {
                    // 删除成功后将前端数据移除
                    this.currentList.splice(this.currentIndex, 1);
                    this.$message({
                        message: "删除成功",
                        type: "success",
                    });
                } else {
                    throw new Error();
                }
                // 关闭loading效果
                this.isLoading = false;
            } catch (err) {
                this.isLoading = false;
                this.$message({
                    message: "删除失败",
                    type: "error",
                });
                console.log(err);
            }
        },
        // 新建文件夹
        async newFolder() {
            try {
                this.isLoading = true;
                // 调取接口 添加文件夹
                const { data } = await addDocument(
                    JSON.stringify({
                        creatorId: this.teacherId,
                        parentId: this.parentId,
                        namespace: "my_questionbank",
                        schoolCode: this.schoolCode,
                        type: 0,
                    })
                );
                // console.log(data);
                if (data && data.id) {
                    // 如果data有数据则新建成功
                    // 成功后 定义一条文件夹数据并插入到当前显示数据的最定部
                    this.addData(
                        { ...data, icon: "folder", isInput: true, type: 0 },
                        0
                    );
                } else {
                    // 否则抛出错误
                    throw new Error("新建失败");
                }
                this.isLoading = false;
            } catch (err) {
                this.$message({
                    message: "新建文件夹失败，请重试",
                    type: "error",
                });
                this.isLoading = false;
            }
        },
        async newExam() {
            try {
                this.isLoading = true;
                const { data } = await addDocument(
                    JSON.stringify({
                        creatorId: this.teacherId,
                        parentId: this.parentId,
                        namespace: "my_questionbank",
                        schoolCode: this.schoolCode,
                        type: 1,
                    })
                );
                if (data && data.id) {
                    this.navList.push({ name: data.name, whereTo: data.id });
                    this.examId = data.id;
                    this.examName = data.name;
                    this.isExam = true;
                } else {
                    throw new Error("新建失败");
                }
                this.isLoading = false;
            } catch (err) {
                this.$message({
                    message: "新建文件夹失败，请重试",
                    type: "error",
                });
                console.log(err);
            }
        },
        // 获取文件列表
        async getFileList(name) {
            try {
                // 开启加载状态
                this.isLoading = true;
                // 发送请求获取后端数据
                const { data } = await onParentIdList({
                    schoolCode: this.schoolCode,
                    creatorId: this.teacherId,
                    parentId: this.parentId,
                    name,
                });
                // console.log(data);
                // 如果data有数据
                if (data && data.length) {
                    this.currentList = dataFormatting(data);
                } else {
                    // 如果data无数据
                    this.currentList = [];
                }
                // 关闭加载状态
                this.isLoading = false;
                // 关闭缺省页
                this.defaultHidden();
            } catch (err) {
                // 获取数据出错 关闭加载状态并显示缺省页
                this.isLoading = false;
                this.defaultShow("网络飞走了，刷新试试吧", "not_network");
                this.$message({
                    message: "获取列表失败，请重试！",
                    type: "error",
                });
                console.log(err);
            }
        },
        // 新增数据
        addData(data, index) {
            const myData = {
                ...data,
                children: [],
                createTime: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
                isCheck: false,
                parentId: this.parentId,
            };
            if (index > 0) {
                this.currentList.splice(index, 0, myData);
            } else {
                this.currentList.unshift(myData);
            }
        },
    },

    created() {
        this.getFileList();
    },
};
</script>

<style lang="less" scoped>
.file-list {
    position: relative;
    height: 8.8rem;
    .file-list-main {
        height: 100%;
        display: flex;
        flex-direction: column;
    }
    .defalut-page-box {
        height: 7.5rem;
        .btn {
            width: 1.83rem;
            height: 0.55rem;
        }
    }
    .top-box {
        height: 0.8rem;
        display: flex;
        align-items: center;
    }
    .reconfirm-box {
        position: fixed;
        top: 0;
        left: 0;
        height: 100vh;
        width: 100vw;
    }
    .list-box {
        flex: 1;
        display: flex;
        flex-direction: column;
        /deep/ .table {
            flex: 1;
        }
    }
}
</style>