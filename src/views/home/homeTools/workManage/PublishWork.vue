<template>
    <div class="publish-work">
        <div class="publich-crumbs">
            <!-- 面包屑 -->
            <span v-touch="back">作业列表</span>
            <span>></span>
            <span>{{ navContent }}</span>
        </div>
        <div class="publish-main">
            <div class="publish-main-top">
                <div class="form-box">
                    <el-form
                        ref="form"
                        :model="form"
                        label-width="120px"
                        :rules="rules"
                        :disabled="disabled"
                    >
                        <el-form-item label="作业类型" prop="workType">
                            <el-select
                                v-model="form.workType"
                                :disabled="itemDisabled"
                                placeholder="请选择"
                            >
                                <el-option
                                    v-for="item in form.workTypeOptions"
                                    :key="item.id"
                                    :label="item.subjectName"
                                    :value="item.code"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="作业名称" prop="workName">
                            <el-input
                                v-model="form.workName"
                                placeholder="请输入"
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="发布班级" prop="gradeAndClass">
                            <el-select
                                v-model="form.gradeAndClass"
                                :disabled="itemDisabled"
                                multiple
                                placeholder="请选择"
                            >
                                <el-option
                                    v-for="item in form.gradeAndClassOptions"
                                    :key="item.id"
                                    :label="item.className"
                                    :value="item.id"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="作业内容" prop="workContent">
                            <el-input
                                type="textarea"
                                :rows="3"
                                placeholder="请输入内容"
                                v-model="form.workContent"
                            >
                            </el-input>
                        </el-form-item>
                        <el-form-item
                            class="upload-img"
                            label="上传图片"
                            v-if="facilityENV === 'windows'"
                        >
                            <el-button v-touch="uploadImg"
                                ><i class="el-icon-upload"></i
                                >上传图片</el-button
                            >
                            <template v-solt>
                                <div class="upload-hint">最多上传8张图片</div>
                                <!-- 图片预览区 -->
                                <div class="img-show">
                                    <div
                                        class="img-item"
                                        v-for="(item, index) in imgList"
                                        :key="index"
                                    >
                                        <i
                                            class="iconfont icon-del"
                                            v-if="!($route.params.type >= 1)"
                                            v-touch="
                                                () => {
                                                    delImg(index);
                                                }
                                            "
                                        ></i>
                                        <img :src="item" />
                                    </div>
                                </div>
                            </template>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
            <div class="publish-bottom" v-if="$route.params.type !== 2">
                <TButton class="cancel" @touch="back"> 取消 </TButton>
                <TButton class="confirm" @touch="confirm">
                    {{ butContent }}
                </TButton>
            </div>
        </div>
        <!-- 文件上传器 -->
        <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            ref="upFile"
            @change="upload"
            multiple
            hidden
        />
        <!-- 加载效果 -->
        <Loading contentText="上传中" v-if="isLoading" />
    </div>
</template>

<script>
import TButton from "@/components/FunctionalComp/TButton.vue";
import Loading from "@/components/FunctionalComp/Loading";
import { issueAssignment, updateAssignment } from "@/api/user.js";
import cos from "@/utils/cos";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";
export default {
    components: {
        TButton,
        Loading,
    },
    data() {
        return {
            // 验证规则
            rules: {
                workType: [
                    {
                        required: true,
                        message: "请选择科目",
                        trigger: "change",
                    },
                ],
                workName: [
                    {
                        required: true,
                        message: "请输入作业名称",
                        trigger: "blur",
                    },
                    {
                        min: 1,
                        max: 20,
                        message: "长度在 1 到 20 个字符",
                        trigger: "blur",
                    },
                ],
                gradeAndClass: [
                    {
                        required: true,
                        message: "请选择班级",
                        trigger: "change",
                    },
                ],
                workContent: [
                    { required: true, message: "请输入内容", trigger: "blur" },
                ],
            },
            // 表单数据
            form: {
                workType: "",
                workTypeOptions: this.$store.getters.teachSubjects,
                gradeAndClass: [],
                gradeAndClassOptions: this.$store.getters.teachClasses,
                workName: "",
                workContent: "",
                img: [],
                isSameDay: true,
            },
            issueData: {
                content: "",
                date: "",
                picture: "",
                schoolCode: this.$store.getters.schoolCode,
                subjectCode: "",
                teacherAccount: this.$store.getters.teacherAccount,
                title: "",
                id: -1,
            },
            updateData: {
                content: "",
                picture: "",
                title: "",
                id: -1,
            },
            imgList: [],
            isLoading: false, // 是否显示加载状态
            disabled: false, // 表单是否禁用
            butContent: "发布", // 按钮内容
            navContent: "发布作业", // 导航内容
            itemDisabled: false,
            facilityENV: this.$store.getters.facilityENV,
        };
    },
    methods: {
        // 后退
        back() {
            this.$router.back();
        },
        // 删除图片
        delImg(index) {
            this.imgList.splice(index, 1);
            this.removeByCos(this.form.img[index]);
            this.form.img.splice(index, 1);
        },
        uploadImg() {
            if (this.disabled) return;
            this.$refs.upFile.click();
        },
        // 上传
        upload(e) {
            // 如果图片数量超出限制  退出并提示
            if (this.imgList.length + e.target.files.length > 8)
                return this.$message({
                    message: "最多上传8张图片",
                    type: "warning",
                });
            // let num = 0;
            e.target.files.forEach((item) => {
                if (
                    item.type === "image/jpeg" ||
                    item.type === "image/png" ||
                    item.type === "image/webp"
                ) {
                    // console.log(item);
                    // this.imgList[num] = this.getObjectURL(item)
                    this.uploadToCos(item);
                } else {
                    this.$message({
                        message: item.name + "文件格式有误",
                        type: "error",
                    });
                }
            });
        },
        // 上传至腾讯云
        async uploadToCos(file) {
            try {
                this.isLoading = true;
                const res = await cos.seniorFile({
                    type: 0,
                    file,
                    key: `${this.$store.getters.schoolCode}/work/${uuidv4()}`,
                });
                this.form.img.push(res.fileName);
                this.imgList.push(this.getObjectURL(file));
                this.isLoading = false;
            } catch (err) {
                this.isLoading = false;
                console.log(err);
            }
        },
        // 从腾讯云删除
        async removeByCos(fileName) {
            try {
                await cos.removeFile({
                    type: 0,
                    key: fileName,
                });
            } catch (err) {
                console.log(err);
            }
        },
        // 获取文件的本地地址
        getObjectURL(file) {
            let url = null;
            if (window.createObjectURL != undefined) {
                // basic
                url = window.createObjectURL(file);
            } else if (window.webkitURL != undefined) {
                // webkit or chrome
                url = window.webkitURL.createObjectURL(file);
            } else if (window.URL != undefined) {
                // mozilla(firefox)
                url = window.URL.createObjectURL(file);
            }

            return url;
        },
        // 验证表单
        verifyForm() {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    this.issueData.content = this.form.workContent;
                    this.issueData.title = this.form.workName;
                    this.issueData.picture = this.form.img.join();
                    if (this.butContent === "发布") {
                        this.issueData.date = moment(new Date()).format(
                            "YYYY-MM-DD"
                        );
                        this.issueData.subjectCode = this.form.workType;
                        this.form.gradeAndClass.forEach((item) => {
                            const obj = this.form.gradeAndClassOptions.filter(
                                (i) => i.id === item
                            )[0];
                            console.log(obj);
                            // this.issue(obj.classCode, obj.gradeCode);
                            this.issue(obj);
                        });
                    } else {
                        this.updateAssignment();
                    }
                    // 验证成功 发布作业
                } else {
                    console.log("验证失败");
                }
            });
        },
        // 确定
        confirm() {
            if (!this.form.isSameDay) return this.$router.back();
            if (this.butContent === "修改") {
                this.disabled = false;
                this.butContent = "确定";
            } else {
                this.verifyForm();
            }
        },
        // 发布
        async issue(classInfo) {
            try {
                console.log(classInfo);
                const res = await issueAssignment(
                    JSON.stringify({
                        ...this.issueData,
                        clazzCode: classInfo.classCode,
                        gradeCode: classInfo.gradeCode,
                    })
                );
                if (res.code === 0) {
                    // 发布成功后触发数据上传事件
                    this.data_triggerEvent({
                        eventId: "publishWork",
                        className: classInfo.clazzName,
                        gradeName: classInfo.gradeName,
                        logValue: this.form.workType,
                    });
                    if (this.$route.name !== "WorkList")
                        this.$router.push({ name: "WorkList" });
                } else {
                    this.$message({
                        message: res.msg,
                        type: "warning",
                    });
                }
            } catch (err) {
                console.log(err);
            }
        },
        // 修改作业
        async updateAssignment() {
            try {
                const res = await updateAssignment(
                    JSON.stringify({
                        id: this.issueData.id,
                        content: this.issueData.content,
                        title: this.issueData.title,
                        picture: this.issueData.picture,
                    })
                );
                console.log(res);
                if (this.$route.name !== "WorkList")
                    this.$router.push({ name: "WorkList" });
            } catch (err) {
                console.log(err);
            }
        },
        // 预览图片
        async imgPreview(fileName) {
            try {
                const res = await cos.getObjectUrl({
                    type: 0,
                    key: fileName,
                });
                // this.imgList[num] = res.Url
                this.imgList.push(res.Url);
            } catch (err) {
                console.log(err);
            }
        },
    },

    created() {
        const routenData = this.$route.params;
        if (routenData.type) {
            this.classId = this.form.gradeAndClassOptions.filter(
                (item) => item.classCode === routenData.classCode
            )[0].id;
            this.form.gradeAndClass.push(this.classId);
            this.form.workType = routenData.subjectCode;
            this.form.workName = routenData.title;
            this.form.workContent = routenData.content;
            this.issueData.id = routenData.id;
            if (routenData.picture) {
                // for (let i = 0; i < routenData.picture.length; i ++) {
                //     this.imgPreview(routenData.picture[i], i)
                // }
                routenData.picture.forEach((item) => this.imgPreview(item));
                this.form.img = routenData.picture;
            }
            this.disabled = routenData.type === 1 ? false : true;
            this.itemDisabled = true;
            this.navContent = "作业详情";
            if (routenData.isSameDay) {
                this.butContent = routenData.type === 1 ? "确定" : "修改";
            } else {
                this.butContent = "确定";
                this.form.isSameDay = false;
            }
        }
    },
};
</script>

<style lang="less">
.publish-work {
    width: 100%;
    height: 100%;
    margin-top: 0.12rem;
    display: flex;
    flex-direction: column;
    .publich-crumbs {
        height: 0.3rem;
        margin-bottom: 0.35rem;
        display: flex;
        align-items: center;
        span {
            font-size: 0.21rem;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #333333;
            margin-right: 0.08rem;
            cursor: pointer;
            &:not(span:first-child) {
                color: #999999;
            }
        }
    }
    .publish-main {
        flex: 1;
        padding: 0 1.13rem;
        display: flex;
        flex-direction: column;
        .publish-main-top {
            flex: 1;
            .form-box {
                height: 6.5rem;
                overflow-y: auto;
            }
        }
        .el-form-item__label {
            font-size: 0.23rem;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #333333;
        }
        .el-form-item {
            .el-input__inner {
                border: 0.01rem solid #c2c2c2;
            }
            &:nth-child(2) {
                .el-input__inner {
                    background: #f7f8fb;
                }
            }
            .el-textarea__inner {
                border: 0.01rem solid #c2c2c2;
                background: #f7f8fb;
                resize: none;
            }
        }
        .upload-img {
            margin-bottom: 10px;
            .upload-hint {
                font-size: 0.17rem;
                color: #999999;
                line-height: 1.8;
            }
            .img-show {
                .img-item {
                    position: relative;
                    display: inline-block;
                    height: 2rem;
                    margin-right: 10px;
                    img {
                        height: 100%;
                    }
                    .iconfont {
                        position: absolute;
                        font-size: 0.23rem;
                        top: 0;
                        right: 0;
                        transform: translate(30%, -30%);
                        color: tomato;
                        line-height: 1;
                        &::before {
                            background-color: #fff;
                            border-radius: 50%;
                        }
                    }
                }
            }
        }

        .publish-bottom {
            width: 100%;
            display: flex;
            justify-content: flex-end;
            .cancel {
                width: 1.21rem;
                height: 0.42rem;
                background: #fff;
                border-radius: 0.08rem;
                font-size: 0.23rem;
                font-weight: 400;
                color: #333333;
                margin: 0 0.21rem 0 0;
                border: 0.01rem solid #979797;
            }
            .confirm {
                width: 1.21rem;
                height: 0.42rem;
                background: #3e83f8;
                border-radius: 0.08rem;
                font-size: 0.23rem;
                font-weight: 400;
                color: #fff;
            }
        }
    }
}
</style>