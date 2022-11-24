<template>
    <div class="courseware-list">
        <DefalutPage
            v-if="defaultIsShow"
            :textContent="defalutText"
            :imgName="defaultImgName"
            @refresh="getCwListByParentId"
        />
        <div class="courseware-list-main" v-else>
            <!-- 顶部导航 -->
            <div class="top-box">
                <Navigation :list="navList" @updateNav="updateNav" />
            </div>
            <!-- 头部按钮区 -->
            <Header
                v-show="!isPreview"
                :buttonList="headerButtonList"
                @search="search"
                @onButton="onButton"
            />
            <!-- table表格 -->
            <Table
                v-show="!isPreview"
                ref="table"
                :list="currentList"
                :type="1"
                @open="open"
                @inputBlur="rechristen"
                @unflodEvent="unflodEvent"
                @checkAll="checkAll"
                @radio="radio"
                @updateIndex="(res) => (currentIndex = res)"
                :allCheck="allCheck"
            />
            <!-- 预览界面 -->
            <div class="preview-box" v-if="isPreview">
                <div class="btn">
                    <TButton class="share" @touch="share"> 分享 </TButton>
                </div>
                <div class="preview-bottom">
                    <CoursewarePreview
                        :type="previewType"
                        :previewUrl="previewUrl"
                    />
                </div>
            </div>
        </div>

        <!-- 加载状态 -->
        <Loading v-show="isLoading" :contentText="LoadingText" />
        <!-- 二次确认框 -->
        <ReconfirmDialog
            @confirmToShare="confirmShare"
            :config="dialogConfig"
            @affirm="reconfirm"
            :isDialog.sync="isDialog"
        />

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
import Header from "@/components/homeToolsPublic/header.vue";
import Table from "@/components/homeToolsPublic/table.vue";
import Loading from "@/components/FunctionalComp/Loading.vue";
import TButton from "@/components/FunctionalComp/TButton.vue";
import Navigation from "@/components/FunctionalComp/Navigation.vue";
import CoursewarePreview from "@/components/homeToolsPublic/coursewarePreview.vue";
import cos from "@/utils/cos";
import {
    addCourseware,
    addFolder,
    getCwListByParentId,
    shareToStudent,
} from "@/api/prepareLessons";
import { dataFormatting, download } from "@/utils/tableTreating";
import { fileDownload } from "@/api/file";
import { theUpload } from "@/utils/fileFormat";
import reconfirmDialog from "@/components/mixins/reconfirmDialog.js";
import defalutPage from "@/components/mixins/defalutPage.js";
import courseware from "@/components/mixins/courseware";

export default {
    name: "CoursewareList",

    components: {
        Header,
        Table,
        Loading,
        TButton,
        Navigation,
        CoursewarePreview,
    },

    mixins: [reconfirmDialog, defalutPage, courseware],

    data() {
        return {
            headerButtonList: [], // 按钮数据
            fileFormat: theUpload(), // 文件格式
            navList: [{ name: "我的课件", whereTo: -1 }], // 导航数据
            isLoading: false, // 是否显示加载状态框
            teacherId: this.$store.getters.teacherId, // 教师id
            schoolCode: this.$store.getters.schoolCode, // 学校id
            currentList: [], // 当前显示的列表
            parentId: -1, // 当前列表的父id
            allCheck: false, // 全选
            currentIndex: "", // 当前的索引
            isPreview: false, // 是否显示预览页面
            previewUrl: "", // 要预览的链接
            previewType: 0, // 预览的类型 0：课件  1：图片  2：视频
            LoadingText: "加载中", // loading效果显示的文本
            previewObj: {},
        };
    },

    methods: {
        // 搜索
        search(value) {
            // if (!value) return;
            this.parentId = -1;
            this.getCwListByParentId(value);
            console.log(value);
        },
        // 点击头部功能按钮
        onButton(text) {
            switch (text) {
                case "上传":
                    // 上传功能
                    this.$refs.upFile.click();
                    break;
                case "新建文件夹":
                    // 新建文件夹功能
                    this.newFolder();
                    break;
                case "分享":
                    // 分享功能
                    this.share();
                    break;
            }
        },
        // 拓展框事件展开
        unflodEvent(index) {
            switch (index) {
                case 0:
                    // 打开
                    this.open(this.currentIndex);
                    break;
                case 1:
                    // 共享
                    this.share();
                    break;
                case 2:
                    // 下载
                    this.download();
                    break;
                case 3:
                    // 重命名
                    this.currentList[this.currentIndex].isInput = true;
                    break;
                case 4:
                    // 删除
                    this.delReconfirm();
                    break;
            }
        },
        // 二次确认框 事件
        reconfirm() {
            // 关闭确认框
            this.isDialog = false;
            switch (this.dialogConfig.type) {
                case 0:
                    // 删除
                    this.removeFile(
                        this.currentList[this.currentIndex],
                        "my_courseware"
                    );
                    break;
            }
        },
        // 下载
        async download() {
            try {
                const info = this.currentList[this.currentIndex];
                if (!info.type) return;
                this.isLoading = true;
                // 获取后端签名
                const { data } = await fileDownload({
                    filePath: info.tencentCosName,
                });
                this.LoadingText = "0%";
                // 将返回的url转为blob对象
                download(data, info.name, (progress) => {
                    this.LoadingText = progress + "%";
                    if (progress == 100) {
                        this.isLoading = false;
                        this.LoadingText = "加载中";
                    }
                });
            } catch (err) {
                this.isLoading = false;
                console.log(err);
            }
        },
        // 调取接口添加课件
        addCourseware({ name, size }, fileName) {
            return new Promise(async (resolve, reject) => {
                try {
                    const { data } = await addCourseware(
                        JSON.stringify({
                            creatorId: this.teacherId,
                            name,
                            parentId: this.parentId,
                            schoolCode: this.schoolCode,
                            size,
                            tencentCosName: fileName,
                        })
                    );
                    resolve(data);
                } catch (err) {
                    reject(err);
                }
            });
        },
        // 新建文件夹
        async newFolder() {
            try {
                this.isLoading = true;
                // 调取接口 添加文件夹
                const { data } = await addFolder(
                    JSON.stringify({
                        creatorId: this.teacherId,
                        parentId: this.parentId,
                        schoolCode: this.schoolCode,
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
                    throw new Error("新建失败");
                }
                this.isLoading = false;
            } catch (err) {
                this.$message({
                    message: "新建文件夹失败，请重试",
                    type: "error",
                });
                this.isLoading = false;
                console.log(err);
            }
        },
        // 分享
        share() {
            const arr = this.currentList.filter(
                (item) => !item.type && item.isCheck
            );
            if (arr.length)
                return this.$message({
                    message: "不可分享文件夹",
                    type: "warning",
                });
            const list = this.currentList.filter(
                (item) => item.type && item.isCheck
            );
            if (list.length || this.isPreview) {
                // console.log(list);
                this.shareReconfirm();
            } else {
                this.$message({
                    message: "请选择课件",
                    type: "warning",
                });
            }
        },
        // 确定分享
        confirmShare(obj) {
            console.log(obj);
            this.isDialog = false;
            this.isLoading = true;
            let list = [];
            if (this.isPreview) {
                list.push(this.previewObj);
            } else {
                list = this.currentList.filter(
                    (item) => item.isCheck && item.type
                );
            }
            list.forEach(async (item) => {
                try {
                    const copyTencentName = await cos.copyFile({
                        type: 0,
                        source: item.tencentCosName,
                        suffix: item.icon,
                    });
                    await shareToStudent(
                        JSON.stringify({
                            ...obj,
                            creatorId: this.teacherId,
                            id: item.id,
                            schoolCode: this.schoolCode,
                            copyTencentName,
                        })
                    );
                    this.isLoading = false;
                    item.isCheck = false;
                    this.allCheck = false;
                    // 分享成功后触发数据上传事件
                    this.data_triggerEvent({
                        eventId: "shareCourseware",
                        className: obj.className,
                        gradeName: obj.gradeName,
                    });
                    this.$message({
                        message: item.name + "分享成功",
                        type: "success",
                    });
                } catch (err) {
                    this.$message({
                        message: item.name + "分享失败",
                        type: "error",
                    });
                }
            });
        },
        // 根据父id获取列表
        async getCwListByParentId(name) {
            try {
                // 开启加载状态
                this.isLoading = true;
                // 发送请求获取后端数据
                const { data } = await getCwListByParentId({
                    schoolCode: this.schoolCode,
                    creatorId: this.teacherId,
                    parentId: this.parentId,
                    name,
                });
                if (data && data.length) {
                    this.currentList = dataFormatting(data);
                } else {
                    // 如果data无数据
                    this.currentList = [];
                }
                // 关闭加载状态
                this.isLoading = false;
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
    },

    created() {
        this.getCwListByParentId();
        // 如果是在pc环境则开放上传按钮
        const facilityENV = this.$store.getters.facilityENV;
        if (facilityENV === "windows") {
            this.headerButtonList = [
                {
                    content: "上传",
                    icon: "icon-upload",
                },
                {
                    content: "新建文件夹",
                    icon: "icon-new_folder",
                },
                {
                    content: "分享",
                },
            ];
        } else {
            this.headerButtonList = [
                {
                    content: "新建文件夹",
                    icon: "icon-new_folder",
                },
                {
                    content: "分享",
                },
            ];
        }
    },
};
</script>

<style lang="less" scoped>
.courseware-list {
    position: relative;
    height: 8.8rem;
    .courseware-list-main {
        height: 100%;
        display: flex;
        flex-direction: column;
    }
    /deep/ .table {
        flex: 1;
    }
    .top-box {
        height: 0.8rem;
        display: flex;
        align-items: center;
    }
    .defalut-page-box {
        height: 7.5rem;
        .btn1 {
            width: 1.83rem;
            height: 0.55rem;
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
        .preview-bottom {
            height: 7.55rem;
        }
        .share {
            width: 1rem;
            height: 0.45rem;
            font-size: 0.23rem;
            background: #fff;
            color: #333;
            border: 1px solid #333;
        }
        .btn {
            display: flex;
            justify-content: flex-end;
            margin-bottom: 0.1rem;
        }
    }
}
</style>