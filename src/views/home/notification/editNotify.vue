<template>
    <div class="edit-notify">
        <div class="crumbs">
            <!-- 面包屑 -->
            <span
                v-touch="
                    () => {
                        $router.back();
                    }
                "
                >通知列表</span
            >
            <span>></span>
            <span>编辑通知</span>
        </div>
        <!-- 表单区域 -->
        <div class="notify-form">
            <el-form
                ref="form"
                :model="formData"
                label-width="120px"
                :rules="rules"
                :disabled="disabled"
            >
                <el-form-item label="通知标题" prop="topic">
                    <el-input
                        v-model="formData.topic"
                        placeholder="请输入"
                    ></el-input>
                </el-form-item>
                <el-form-item label="发布班级" prop="gradeAndClass">
                    <el-select
                        v-model="formData.gradeAndClass"
                        multiple
                        placeholder="请选择"
                    >
                        <el-option
                            v-for="item in gradeAndClassOptions"
                            :key="item.id"
                            :label="item.className"
                            :value="item.id"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="通知内容" prop="content">
                    <el-input
                        type="textarea"
                        :rows="3"
                        placeholder="请输入内容"
                        v-model="formData.content"
                    >
                    </el-input>
                </el-form-item>
                <el-form-item
                    class="upload-img"
                    :label="facilityENV === 'windows' ? '上传图片' : ''"
                >
                    <el-button
                        @click="$refs.upImg.click()"
                        v-if="facilityENV === 'windows'"
                        ><i class="el-icon-upload"></i>上传图片</el-button
                    >
                    <template v-solt>
                        <div
                            class="upload-hint"
                            v-if="facilityENV === 'windows'"
                        >
                            最多上传8张图片
                        </div>
                        <!-- 图片预览区 -->
                        <div class="img-show">
                            <OccupiedPicture
                                v-for="(item, index) in images"
                                :key="index"
                                :height="100"
                                :imgSrc="item"
                                :isDel="!disabled"
                                @del="delImg"
                            />
                        </div>
                    </template>
                </el-form-item>
            </el-form>
        </div>
        <!-- 底部按钮 -->
        <div class="notify-floor" v-if="butIsShow">
            <TButton class="cancel" @touch="$router.back()"> 取消 </TButton>
            <TButton class="confirm" @touch="verifyForm"> 发布 </TButton>
        </div>
        <Loading contentText="加载中" v-if="isLoading" />
        <input
            type="file"
            multiple
            ref="upImg"
            :accept="imgFormat"
            @change="inpChange"
            hidden
        />
    </div>
</template>

<script>
import TButton from "@/components/FunctionalComp/TButton.vue";
import { publishNotify } from "@/api/notify";
import moment from "moment";
import Loading from "@/components/FunctionalComp/Loading";
import { imageFormat } from "@/utils/fileFormat";
import cos from "@/utils/cos";
import { getObjectURL, createStudentIM } from "@/utils/util";
import OccupiedPicture from "@/components/FunctionalComp/OccupiedPicture.vue";
import { v4 as uuidv4 } from "uuid";
import { getStudentIMList } from "@/api/student";
import sendMessage from "@/utils/sendMessage";

export default {
    name: "EditNotify",

    components: {
        TButton,
        Loading,
        OccupiedPicture,
    },

    data() {
        return {
            formData: {
                topic: "",
                gradeAndClass: [],
                content: "",
            },
            rules: {
                topic: [
                    {
                        required: true,
                        message: "请输入标题",
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
                content: [
                    { required: true, message: "请输入内容", trigger: "blur" },
                    {
                        min: 1,
                        max: 500,
                        message: "最多输入500个字符",
                        trigger: "blur",
                    },
                ],
            },
            gradeAndClassOptions: this.$store.getters.teachClasses,
            images: [],
            disabled: false,
            facilityENV: this.$store.getters.facilityENV,
            schoolCode: this.$store.getters.schoolCode,
            teacherAccount: this.$store.getters.teacherAccount,
            isLoading: false,
            butIsShow: true,
            imgFormat: imageFormat(),
            files: [],
            count: 0,
            students: [],
        };
    },

    methods: {
        // 主动验证表单数据
        verifyForm() {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    this.uploadImgs();
                } else {
                    console.log("验证失败");
                }
            });
        },
        // 准备请求数据
        prepareData() {
            let arr = [];
            const data = {
                topic: this.formData.topic,
                content: this.formData.content,
                senderAccount: this.teacherAccount,
                schoolCode: this.schoolCode,
                images: JSON.stringify(this.files),
                createTime: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
            };
            this.formData.gradeAndClass.forEach((item) => {
                const gradeInfo = this.gradeAndClassOptions.filter(
                    (i) => i.id === item
                )[0];
                this.getStudents(gradeInfo);
                arr.push({
                    ...data,
                    clazzCode: gradeInfo.classCode,
                    gradeCode: gradeInfo.gradeCode,
                    clazzName: gradeInfo.clazzName,
                    gradeName: gradeInfo.gradeName
                });
            });
            this.publishNotify(arr);
        },
        // 发布通知
        async publishNotify(arr) {
            console.log(arr);
            try {
                this.isLoading = true;
                const res = await publishNotify(JSON.stringify(arr));
                if (res.code === 0) {
                    this.isLoading = false;
                    // 发布成功后触发数据上传事件
                    this.data_triggerEvent({
                        eventId: "publishNotify",
                        className: arr[0].clazzName,
                        gradeName: arr[0].gradeName,
                    });
                    this.$message({
                        message: "发布成功",
                        type: "success",
                    });
                    this.$router.back();
                } else {
                    throw new Error("发布失败,请重试!");
                }
            } catch (err) {
                console.log(err);
                this.isLoading = false;
                this.$message({
                    message: JSON.stringify(err),
                    type: "error",
                });
            }
        },
        inpChange(e) {
            const files = e.target.files;
            if (files.length + this.images.length > 8) {
                return this.$message({
                    message: "最多只能上传8个图片",
                    type: "warning",
                });
            }
            files.forEach((item) => {
                const reg = new RegExp(
                    item.name.slice(item.name.lastIndexOf(".")),
                    "gi"
                );
                if (reg.test(this.imgFormat)) {
                    this.images.push(getObjectURL(item));
                    this.files.push(item);
                } else {
                    this.$message({
                        message: item.name + "格式不正确！",
                        type: "warning",
                    });
                }
            });
        },
        delImg(data) {
            const i = this.images.findIndex((item) => item === data);
            this.images.splice(i, 1);
            this.files.splice(i, 1);
        },
        uploadImgs() {
            if (this.files.length) {
                this.files.forEach((item) => {
                    this.upToCos(item, this.files.length);
                });
                this.files = [];
            } else {
                this.prepareData();
            }
        },
        async upToCos(file, length) {
            try {
                this.isLoading = true;
                const res = await cos.seniorFile({
                    type: 0,
                    file,
                    key: `${this.schoolCode}/notify/${uuidv4()}`,
                });
                console.log(res);
                this.files.push(res.fileName);
                this.counter(length);
            } catch (err) {
                this.counter(length);
                console.log(err);
            }
        },
        counter(length) {
            this.count++;
            if (this.count >= length) {
                this.count = 0;
                this.prepareData();
            }
        },
        async getStudents(obj) {
            try {
                const { data } = await getStudentIMList(
                    JSON.stringify({
                        clazzCode: obj.classCode,
                        gradeCode: obj.gradeCode,
                        schoolCode: this.schoolCode,
                        page: 1,
                        page: 999,
                    })
                );
                data.forEach((item) => this.sendMsg(item));
            } catch (err) {
                console.log(err);
            }
        },
        async sendMsg(id) {
            try {
                await sendMessage({
                    to: createStudentIM(id),
                    type: 2,
                    mesType: "NOTIFY",
                    content: "",
                });
            } catch (err) {
                console.log(err);
            }
        },
    },

    created() {
        const obj = this.$route.params;
        if (obj.topic) {
            const id = this.gradeAndClassOptions.filter(
                (item) => item.className === obj.gradeAndClass
            )[0].id;
            this.formData.topic = obj.topic;
            this.formData.content = obj.content;
            this.formData.gradeAndClass.push(id);
            this.images = JSON.parse(obj.images);
            this.disabled = true;
            this.butIsShow = false;
        }
    },
};
</script>

<style lang="less" scoped>
.edit-notify {
    width: 100%;
    height: 100%;
    .crumbs {
        height: 4%;
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
    .notify-form {
        height: 7rem;
        padding: 0.35rem 1.13rem 0;
        overflow-y: auto;
        /deep/ .el-form-item__label {
            font-size: 0.23rem;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #333333;
        }
        .upload-img {
            .upload-hint {
                font-size: 0.17rem;
                color: #999999;
                line-height: 1.8;
            }
        }
    }
    .notify-floor {
        height: 5%;
        display: flex;
        justify-content: flex-end;
        padding-right: 1.13rem;
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
    .img-show {
        display: flex;
        flex-wrap: wrap;
    }
}
</style>