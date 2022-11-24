<template>
    
    <div class="school-question-bank">
        <DefalutPage v-if="defaultIsShow" :textContent="defalutText" :imgName="defaultImgName" @refresh="getPermission" />
        <div class="question-bank-main" v-else>
            <!-- 顶部导航 -->
            <div class="top-box">
                <Navigation :list="navList" @updateNav="updateNav" />
            </div>
            <!-- 内容筛选 -->
            <div class="screen-box" v-if="!isExam">
                <ScholasticHead 
                    :subCode.sync="currentSubCode" 
                    :searchContent.sync="searchContent" 
                    :gradeCode.sync="currentGradeCode"
                    @search="getScholasticList"
                />
                <div class="buttons" v-if="isPermission">
                    <TButton class="but left" v-touch="newFolder">
                        <!-- <svg-icon iconClass="new_folder" /> -->
                        <i class="iconfont icon-new_folder"></i>
                        新建文件夹
                    </TButton>
                    <TButton class="but right" v-touch="newTest">
                        <!-- <svg-icon iconClass="new_test"/> -->
                        <i class="iconfont icon-new_test"></i>
                        新建试卷
                    </TButton>
                </div>
            </div>
            <Table 
                v-if="!isExam"
                :list="currentList" 
                :allCheck="allCheck" 
                :type="isPermission ? 4 : 5"
                @open="open"
                @inputBlur="rechristen"
                @unflodEvent="unflodEvent"
                @checkAll="checkAll"
                @radio="radio"
            />
            <!-- 试卷详情展示 -->
            <div class="info-box" v-if="isExam">
                <ExamInation :id="examId" :examName.sync="examName" />
            </div>
        </div>
        <!-- 二次确认框 -->
        <ReconfirmDialog
            @confirmUp="confirmInfo"
            :config="dialogConfig"
            :isDialog.sync="isDialog"
            :treeList="treeList"
            @affirm="reconfirm"
            :folderId.sync="selectFolderId"
            @newFileToMy="newFileToMy"
            :diaLoading="diaLoading"
        />
        <!-- 加载状态 -->
        <Loading v-show="isLoading" :contentText="LoadingText" />
    </div>
</template>

<script>

import Navigation from "@/components/FunctionalComp/Navigation.vue"
import ScholasticHead from '@/components/homeToolsPublic/scholasticHead.vue'
import Table from '@/components/homeToolsPublic/table.vue'
import defalutPage from '@/components/mixins/defalutPage.js'
import reconfirmDialog from '@/components/mixins/reconfirmDialog.js'
import Loading from "@/components/FunctionalComp/Loading.vue"
import TButton from "@/components/FunctionalComp/TButton.vue"
import { getPermissionFromRole } from '@/api/user'
import { getSchoolDocument, schoolNewFile, removeDocument, updateDocumentName, getDocumentList, addDocument, schoolToMy } from '@/api/document.js'
import { dataFormatting } from "@/utils/tableTreating"
import moment from "moment"
import ExamInation from '@/components/homeTools/questionBank/examInation.vue'

export default {
    name: 'SchoolQuestionBank',

    components: {
        Navigation,
        ScholasticHead,
        Table,
        Loading,
        TButton,
        ExamInation
    },

    mixins: [defalutPage, reconfirmDialog],

    data() {
        return {
            teacherId: this.$store.getters.teacherId,              // 教师id
            schoolCode: this.$store.getters.schoolCode,            // 学校code
            navList: [{ name: "校本题库", whereTo: -1 }],           // 导航数据
            allCheck: false,                                       // 是否全选
            currentList: [],                                       // 当前的数据列表
            parentId: -1,                                          // 父文件夹id
            currentSubCode: '',                                    // 当前的学科code
            currentGradeCode: '',                                  // 当前的年级code
            searchContent: '',                                     // 搜索的内容
            uploadData: {},                                        // 上传所需的数据
            currentIndex: '',                                      // 当前的index
            treeList: [],
            selectFolderId: '',
            diaLoading: false,
            isLoading: false,
            LoadingText: "加载中",
            flag: false,
            isExam: false,
            examId: -1,
            examName: '',
            isPermission: false
        }
    },

    watch: {
        currentSubCode() {
            this.parentId = -1;
            if (this.flag) return;
            this.getScholasticList()
        },
        currentGradeCode() {
            this.parentId = -1;
            if (this.flag) return;
            this.getScholasticList()
        },
        parentId() {
            if (this.parentId === -1) {
                this.navList = [{ name: "校本资源", whereTo: -1 }];
            };
        }
    },

    methods: {
        // 拓展框事件展开
        unflodEvent(obj) {
            this.currentIndex = obj.index;
            switch (obj.num) {
                case 0:
                    // 添加
                    this.getTreeList()
                    break;
                case 1:
                    // 重命名
                    this.currentList[this.currentIndex].isInput = true;
                    break;
                case 2:
                    // 删除
                    this.delReconfirm()
                    break;
            }
        },
        // 获取校本列表
        async getScholasticList(gradeCode, courseCode, type) {
            try {
                this.isLoading = true;
                const { data } = await getSchoolDocument({
                    schoolCode: this.schoolCode,
                    parentId: this.parentId,
                    gradeCode: gradeCode || this.currentGradeCode,
                    courseCode: courseCode || this.currentSubCode,
                    name: this.searchContent
                })
                if (data && data.length) {
                    this.currentList = dataFormatting(data);
                } else {
                    this.currentList = [];
                }
                // 关闭加载状态
                this.isLoading = false
                if (this.flag) {
                    this.flag = false;
                    this.confirmNewFile(type)
                }
                // 关闭缺省页
                this.defaultHidden();
            } catch(err) {
                this.isLoading = false
                this.defaultShow('网络飞走了，刷新试试吧', 'not_network');
                this.$message({
                    message: '获取列表失败，请重试！',
                    type: 'error'
                })
                console.log(err);
            }
        },
         // 更新导航
        updateNav(obj) {
            // 将点击后面的导航数据清除
            this.navList.splice(obj.index + 1);
            this.parentId = obj.to;
            this.allCheck = false;
            this.isExam = false;
            this.getScholasticList();
        },
        // 新建文件夹
        newFolder() {
            // 如果当前是在根目录则唤醒弹框  否则直接新建文件夹
            if (this.parentId === -1) {
                this.upReconfirm(0)
            } else {
                this.confirmNewFile(0)
            }
        },
        // 获取用户角色
        async getPermission() {
            try {
                const roleCode = this.$store.getters.roleCode;
                if (roleCode.length === 4) {
                    this.isPermission = true;
                } else {
                    this.isLoading = true;
                    const { data } = await getPermissionFromRole({roleCode})
                    if (data && data.permissionList) {
                        this.isPermission = data.permissionList.some(item => item.moduleCode === '20900')
                    }
                }
                this.getScholasticList();
            } catch(err) {
                this.$message({
                    message: '获取用户角色失败，请重试',
                    type: 'error'
                })
                this.defaultShow('网络飞走了，刷新试试吧', 'not_network');
                this.isLoading = false
                console.log(err);
            }
        },
        // 确认新建文件夹或文件夹
        async confirmNewFile(type) {
            try {
                this.isLoading = true;
                this.uploadData.addDoc = {
                    creatorId: this.teacherId,
                    schoolCode: this.schoolCode,
                    parentId: this.parentId,
                    type
                }
                const { data } = await schoolNewFile(JSON.stringify(this.uploadData));
                if (data && data.id) {
                    // 如果data有数据则新建成功
                    // 成功后 定义一条文件夹数据并插入到当前显示数据的最定部
                    let icon = type ? 'courseware' : 'folder';
                    this.addData(
                        { ...data, icon, isInput: true, type },
                        0
                    );
                } else {
                    // 否则抛出错误
                    throw new Error("新建失败");
                }
                this.isLoading = false
            } catch(err) {
                this.$message({
                    message: "新建文件夹失败，请重试",
                    type: "error",
                });
                this.isLoading = false;
                console.log(err);
            }
        },
        // 新建试卷
        newTest() {
            // 如果当前是在根目录则唤醒弹框  否则直接新建文件夹
            if (this.parentId === -1) {
                this.upReconfirm(1)
            } else {
                this.confirmNewFile(1)
            }
        },
        // 打开
        open(index) {
            const obj = this.currentList[index];
            this.navList.push({name: obj.name, whereTo: obj.id});
            if (obj.type) {
                // console.log(obj);
                // console.log('打开试卷');
                this.examId = obj.id;
                this.examName = this.currentList[index].name;
                this.isExam = true;
            } else {
                if (obj.courseCode) {
                    this.uploadData = {
                        courseCode: obj.courseCode,
                        gradeCode: obj.gradeCode
                    }
                }
                this.parentId = obj.id;
                this.getScholasticList()
            }
        },
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
                        message: '重命名成功',
                        type: 'success'
                    })
                } else {
                    throw new Error()
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
        // 二次确认事件
        reconfirm() {
            // 关闭确认框
            this.isDialog = false;
            switch (this.dialogConfig.type) {
                case 0:
                    // 删除
                    this.removeFile('school_courseware');
                    break;
            }
        },
        // 确认信息
        confirmInfo(obj) {
            this.isDialog = false;
            this.uploadData = {...obj};
            this.flag = true;
            // console.log(this.flag);
            this.getScholasticList(obj.gradeCode, obj.courseCode, this.dialogConfig.num);
            this.currentGradeCode = obj.gradeCode;
            this.currentSubCode = obj.courseCode
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
        // 删除文件
        async removeFile(text) {
            try {
                // 开启loading效果
                this.isLoading = true;
                // 调取后端接口 从数据库中删除
                const res = await removeDocument(
                    JSON.stringify({
                        documentId: this.currentList[this.currentIndex].id,
                        creatorId: this.teacherId,
                        schoolCode: this.schoolCode,
                        namespace: text,
                    })
                );
                if (res.code === 0) {
                    // 删除成功后将前端数据移除
                    this.currentList.splice(this.currentIndex, 1);
                    this.$message({
                        message: '删除成功',
                        type: 'success'
                    })
                } else {
                    throw new Error()
                }
                // 关闭loading效果
                this.isLoading = false;
            } catch (err) {
                this.$message({
                    message: "删除失败，请重试",
                    type: "error",
                });
                this.isLoading = false;
                console.log(err);
            }
        },
        // 获取树状列表
        async getTreeList() {
            try {
                if (this.currentList[this.currentIndex].type === 0) return this.$message({
                    message: '不能添加文件夹！',
                    type: 'warning'
                })
                this.selectFolderId = '';
                if (this.treeList.length) return this.addToMine();
                this.isLoading = true;
                const { data } = await getDocumentList({
                    schoolCode: this.schoolCode,
                    creatorId: this.teacherId
                })
                this.dealtTree(data)
            } catch (err) {
                this.$message({
                    message: '获取文件夹列表失败，请重试！',
                    type: 'error'
                })
                this.isLoading = false
                console.log(err);
            }
        },
        // 处理树状数据
        dealtTree(data) {
            function dealt(list, item, fn) {
                if (!list.length) return;
                for (let i = 0; i < list.length; i++) {
                    if (list[i].type === 0) {
                        item.push({...list[i], isUnfold: false, children: []});
                        dealt(list[i].children, item[item.length - 1].children)
                    }
                }
                fn && fn()
            }
            dealt(data, this.treeList, this.closeLoading);
            this.isLoading = false;
            this.addToMine()
        },
        closeLoading() {
            this.isLoading = false;
        },
        // 新建文件至我的
        newFileToMy(n) {
            this.diaLoading = true;
            switch (n) {
                case 0:
                    // 新建文件夹至我的
                    this.newFolderToMy()
                    break;
                case 1:
                    // 新建课件至我的
                    this.newCWToMy()
                    break;
            }
        },
        // 新建文件夹至我的
        async newFolderToMy() {
            try {
                const { data } = await addDocument(JSON.stringify({
                    creatorId: this.teacherId,
                    parentId: this.selectFolderId || -1,
                    schoolCode: this.schoolCode,
                    type: 0
                }))
                this.insertIntoTree(data);
                this.diaLoading = false
            } catch(err) {
                this.diaLoading = false;
                this.$message({
                    message: '添加失败，请重试!',
                    type: 'error'
                })
                console.log(err);
            }
        },
        // 新建课件至我的
        async newCWToMy() {
            try {
                const obj = this.currentList[this.currentIndex]
                await schoolToMy(JSON.stringify({
                    creatorId: this.teacherId,
                    parentId: this.selectFolderId || -1,
                    documentId: obj.id
                }))
                this.diaLoading = false
                this.isDialog = false
                this.$message({
                    message: '添加成功',
                    type: 'success'
                })
            } catch(err) {
                this.diaLoading = false;
                this.isDialog = false;
                this.$message({
                    message: '添加失败，请重试!',
                    type: 'error'
                })
                console.log(err);
            }
        },
        // 将数据插入到树状结构
        insertIntoTree(data) {
            let flag = false;
            let obj = {...data, isUnfold: false, children: []};
            function insert(list, id) {
                if (!list.length || flag) return;
                list.forEach(item => {
                    if (item.id === id) {
                        flag = true;
                        item.children.push(obj);
                        item.isUnfold = true;
                    } else {
                        insert(item.children, id)
                    }
                });
            }
            if (!this.selectFolderId) {
                this.treeList.push(obj)
            } else {
                insert(this.treeList, this.selectFolderId)
            }
        }
    },

    async created() {
        this.getPermission()
    }

}
</script>

<style lang="less" scoped>
.school-question-bank {
    height: 8.8rem;
    position: relative;
    /deep/ .loading {
        height: 105%;
    }
    .question-bank-main {
        height: 100%;
        display: flex;
        flex-direction: column;
    }
    .top-box {
        height: 0.8rem;
        display: flex;
        align-items: center;
    }
    /deep/ .table {
        min-height: 6.55rem;
        max-height: 7.55rem;
        flex: 1;
        .t-body {
            height: 5.7rem;
        }
    }
    .reconfirm-box {
        position: fixed;
        top: 0;
        left: 0;
        height: 100vh;
        width: 100vw;
    }
    .preview-box {
        flex: 1;
    }
    .buttons {
        display: flex;
        margin-top: 0.2rem;
        .but {
            font-size: 0.23rem;
            margin-right: 0.2rem;
        }
        .left {
            width: 1.79rem;
            height: 0.42rem;
            background-color: #fff;
            border: 1px solid #979797; 
            color: #333;
            .iconfont {
                font-size: 0.21rem;
                margin: 0.05rem;
            }
        }
        .right {
            width: 1.56rem;
            height: 0.42rem;
            background-color: #fff;
            border: 1px solid #979797; 
            color: #333;
            .iconfont {
                font-size: 0.21rem;
                margin: 0.05rem;
            }
        }
    }
}
</style>