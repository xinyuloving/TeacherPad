<template>
    <!-- 校本资源 -->
    <div class="scholastic-resource">
        <DefalutPage v-if="defaultIsShow" :textContent="defalutText" :imgName="defaultImgName" @refresh="getPermission" />
        <div class="scholastic-resource-main" v-else>
            <!-- 顶部导航 -->
            <div class="top-box">
                <Navigation :list="navList" @updateNav="updateNav" />
            </div>
            <!-- 内容筛选 -->
            <div class="screen-box" v-if="!isPreview">
                <ScholasticHead 
                    :subCode.sync="currentSubCode" 
                    :searchContent.sync="searchContent" 
                    :gradeCode.sync="currentGradeCode"
                    @search="getScholasticList"
                />
                <div class="buttons" v-if="isPermission">
                    <TButton class="but left" v-touch="upDatum" v-if="facilityENV === 'windows'">
                        <!-- <svg-icon iconClass="upload" /> -->
                        <i class="iconfont icon-upload"></i>
                        上传
                    </TButton>
                    <TButton class="but right" v-touch="newFolder">
                        <!-- <svg-icon iconClass="new_folder"/> -->
                        <i class="iconfont icon-new_folder"></i>
                        新建文件夹
                    </TButton>
                </div>
            </div>
            <Table 
                v-if="!isPreview"
                :list="currentList" 
                :allCheck="allCheck" 
                :type="isPermission ? 2 : 3"
                @updateIndex="(res) => (currentIndex = res)"
                @open="open"
                @inputBlur="rechristen"
                @unflodEvent="unflodEvent"
                @checkAll="checkAll"
                @radio="radio"
            />
            <!-- 二次确认框 -->
            <ReconfirmDialog
                @confirmUp="confirmUp"
                :config="dialogConfig"
                :isDialog.sync="isDialog"
                :treeList="treeList"
                @affirm="reconfirm"
                :folderId.sync="selectFolderId"
                @newFileToMy="newFileToMy"
                :diaLoading="diaLoading"
            />
            <!-- 预览界面 -->
            <div class="preview-box" v-if="isPreview">
                <CoursewarePreview
                    :type="previewType"
                    :previewUrl="previewUrl"
                />
            </div>
        </div>
        <!-- 加载状态 -->
        <Loading v-show="isLoading" />
        <!-- 文件选择器 -->
        <input
            multiple
            ref="upFile"
            :accept="fileFormat"
            @change="inputUpload"
            type="file"
            hidden
        />
    </div>
</template>

<script>

import Navigation from "@/components/FunctionalComp/Navigation.vue"
import ScholasticHead from '@/components/homeToolsPublic/scholasticHead.vue'
import Table from '@/components/homeToolsPublic/table.vue'
import { getScholasticByParentId, addScholasticResource, schoolNewFolder, getCoursewareList, addCourseware, addFolder } from '@/api/prepareLessons'
import defalutPage from '@/components/mixins/defalutPage.js'
import reconfirmDialog from '@/components/mixins/reconfirmDialog.js'
import Loading from "@/components/FunctionalComp/Loading.vue"
import { dataFormatting } from "@/utils/tableTreating"
import { getPermissionFromRole } from '@/api/user'
import TButton from "@/components/FunctionalComp/TButton.vue"
import courseware from '@/components/mixins/courseware'
import CoursewarePreview from "@/components/homeToolsPublic/coursewarePreview.vue"
import { theUpload } from "@/utils/fileFormat"
import cos from '@/utils/cos'

export default {
    name: 'ScholasticResource',

    components: {
        Navigation,
        ScholasticHead,
        Table,
        Loading,
        TButton,
        CoursewarePreview
    },

    mixins: [defalutPage, reconfirmDialog, courseware],

    data() {
        return {
            teacherId: this.$store.getters.teacherId,              // 教师id
            schoolCode: this.$store.getters.schoolCode,            // 学校code
            navList: [{ name: "校本资源", whereTo: -1 }],           // 导航数据
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
            flag: false,
            isPermission: false,                                     // 是否有权限
            facilityENV: this.$store.getters.facilityENV,
            fileFormat: theUpload(),
            isLoading: false,
            isPreview: false, // 是否显示预览页面
            previewUrl: "", // 要预览的链接
            previewType: 0, // 预览的类型 0：课件  1：图片  2：视频
            previewObj: {},
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
            }
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
        // 获取校本资源列表
        async getScholasticList(gradeCode, courseCode, type) {
            try {
                this.isLoading = true;
                const { data } = await getScholasticByParentId({
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
                this.flag = false;
                // 关闭缺省页
                this.defaultHidden();
            } catch(err) {
                this.isLoading = false;
                this.flag = false;
                this.defaultShow('网络飞走了，刷新试试吧', 'not_network');
                this.$message({
                    message: '获取列表失败，请重试！',
                    type: 'error'
                })
                console.log(err);
            }
        },
        // 获取用户角色
        async getPermission() {
            try {
                const roleCode = this.$store.getters.roleCode
                if (roleCode.length === 4) {
                    this.isPermission = true
                } else {
                    this.isLoading = true;
                    const { data } = await getPermissionFromRole({roleCode})
                    if (data && data.permissionList) {
                        this.isPermission = data.permissionList.some(item => item.moduleCode === '20800')
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
                const { data } = await getCoursewareList({
                    schoolCode: this.schoolCode,
                    creatorId: this.teacherId
                })
                setTimeout(() => {
                    this.dealtTree(data)
                }, 1000);
                // this.dealtTree(data)
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
        // 调取接口添加课件
        addCourseware({ name, size }, fileName) {
            return new Promise(async (resolve, reject) => {
                try {
                    this.uploadData.addCourseware = { 
                        creatorId: this.teacherId,
                        parentId: this.parentId,
                        schoolCode: this.schoolCode,
                        tencentCosName: fileName,
                        name,
                        size
                    }
                    const { data } = await addScholasticResource(
                        JSON.stringify(this.uploadData)
                    );
                    resolve(data)
                } catch(err) {
                    reject(err)
                }
            })
        },
        // 确认新建文件夹
        async confirmNewFolder() {
            try {
                this.isLoading = true;
                this.uploadData.addFolder = {
                    creatorId: this.teacherId,
                    parentId: this.parentId,
                    schoolCode: this.schoolCode
                }
                // 调取接口 添加文件夹
                const { data } = await schoolNewFolder(JSON.stringify(this.uploadData));
                // console.log(data);
                if (data && data.id) {
                    // 如果data有数据则新建成功
                    // 成功后 定义一条文件夹数据并插入到当前显示数据的最顶部
                    if (this.flag) return this.getScholasticList(this.uploadData.gradeCode, this.uploadData.courseCode, 1)
                    this.addData(
                        { ...data, icon: "folder", isInput: true, type: 0 },
                        0
                    );
                } else {
                    throw new Error("新建失败");
                }
                this.isLoading = false;
            } catch(err) {
                this.isLoading = false;
                console.log(err);
            }
        },
        // 新建文件夹
        newFolder() {
            // 如果当前是在根目录则唤醒弹框  否则直接新建文件夹
            if (this.parentId === -1) {
                this.upReconfirm(0)
            } else {
                this.confirmNewFolder()
            }
        },
        // 点击上传按钮事件
        upDatum() {
            // 如果当前是在根目录则唤醒弹框  否则直接选择文件上传
            if (this.parentId === -1) {
                this.upReconfirm(1)
            } else {
                this.$refs.upFile.click()
            }
        },
        // 二次确认框 事件
        reconfirm() {
            // 关闭确认框
            this.isDialog = false;
            switch (this.dialogConfig.type) {
                case 0:
                    // 删除
                    this.removeFile(this.currentList[this.currentIndex], 'school_courseware');
                    break;
            }
        },
        // 确认上传
        confirmUp(obj) {
            console.log(obj);
            this.isDialog = false;
            this.uploadData = {...obj};
            // 如果num为0则新建文件夹  否则上传文件
            if (this.dialogConfig.num) {
                this.$refs.upFile.click()
            } else {
                this.flag = true;
                this.confirmNewFolder();
                this.currentGradeCode = obj.gradeCode;
                this.currentSubCode = obj.courseCode
            }
        },
        // 更新导航
        updateNav(obj) {
            // 将点击后面的导航数据清除
            this.navList.splice(obj.index + 1);
            this.parentId = obj.to;
            this.isPreview = false;
            this.allCheck = false;
            this.getScholasticList();
        },
        // 新建文件夹至我的
        async newFolderToMy() {
            try {
                const { data } = await addFolder(JSON.stringify({
                    creatorId: this.teacherId,
                    parentId: this.selectFolderId || -1,
                    schoolCode: this.schoolCode
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
                const res = await this.copyFileByCos({ cosName: obj.tencentCosName, suffix: obj.icon})
                await addCourseware(JSON.stringify({
                    creatorId: this.teacherId,
                    parentId: this.selectFolderId || -1,
                    schoolCode: this.schoolCode,
                    tencentCosName: res,
                    size: obj.size,
                    name: obj.name
                }))
                this.diaLoading = false;
                this.isDialog = false;
                // 添加成功后触发数据上传事件
                this.data_triggerEvent('addToMyCourseware')
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
        },
        closeLoading() {
            this.isLoading = false
        },
        copyFileByCos(obj) {
            return new Promise(async (resolve, reject) => {
                try {
                    console.log(obj);
                    const res = await cos.copyFile({
                        type: 0,
                        source: obj.cosName,
                        suffix: obj.suffix
                    })
                    resolve(res)
                } catch (err) {
                    reject(err)
                }
            })
        }
    },

    created() {
        this.getPermission();
    }
}
</script>

<style lang="less" scoped>
.scholastic-resource {
    height: 8.8rem;
    position: relative;
    .scholastic-resource-main {
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
        height: 8rem;
    }
    .buttons {
        display: flex;
        margin-top: 0.2rem;
        .but {
            font-size: 0.23rem;
            margin-right: 0.2rem;
        }
        .left {
            width: 1.23rem;
            height: 0.42rem;
            .iconfont {
                font-size: 0.21rem;
                margin: 0.05rem;
            }
        }
        .right {
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
    }
}
</style>