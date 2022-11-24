<template>
    <div class="reconfirm-dialog">
        <TDialog
            :visible="isDialog"
            :dialogConStyle="{
                background: '#F1F1F3',
                width: config.width,
                height: config.height,
            }"
            :showClose="false"
        >
            <template v-slot:header>
                <!-- 头部插槽 -->
                <div
                    class="reconfirm-head-con"
                    :style="{ border: config.type ? '0' : null }"
                >
                    <div class="mask" v-show="diaLoading"></div>
                    <span>{{ config.title }}</span>
                    <i class="iconfont icon-close my-icon" v-touch="close"></i>
                </div>
            </template>

            <template v-slot:default>
                <!-- 内容主体 -->
                <div class="content-main" v-if="config.type === 0">
                    {{ config.content }}
                </div>
                <div
                    class="content-main"
                    v-else-if="config.type === 1 || config.type === 2"
                >
                    <div class="share-content">{{ config.content }}</div>
                    <div class="subject">
                        <div class="name">科目</div>
                        <!-- 分享 -->
                        <el-select
                            v-if="config.type === 1"
                            v-model="subjectName"
                            size="mini"
                            placeholder="请选择"
                        >
                            <el-option
                                v-for="item in subjectList"
                                :key="item.id"
                                :label="item.subjectName"
                                :value="item.id"
                            >
                            </el-option>
                        </el-select>
                        <!-- 上传 -->
                        <el-select
                            v-else
                            v-model="subjectName"
                            size="mini"
                            placeholder="请选择"
                        >
                            <el-option
                                v-for="item in schoolSubjects"
                                :key="item.code"
                                :label="item.name"
                                :value="item.code"
                            >
                            </el-option>
                        </el-select>
                    </div>
                    <div class="class-and-grade">
                        <div class="name">
                            {{ config.type === 1 ? "班级" : "年级" }}
                        </div>
                        <!-- 分享 -->
                        <el-select
                            v-if="config.type === 1"
                            v-model="className"
                            size="mini"
                            placeholder="请选择"
                        >
                            <el-option
                                v-for="item in classList"
                                :key="item.id"
                                :label="item.className"
                                :value="item.id"
                            >
                            </el-option>
                        </el-select>
                        <!-- 上传 -->
                        <el-select
                            v-else
                            v-model="className"
                            size="mini"
                            placeholder="请选择"
                        >
                            <el-option
                                v-for="item in gradeAndClassOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            >
                            </el-option>
                        </el-select>
                    </div>
                </div>
                <div
                    class="content-main"
                    v-else-if="config.type === 3"
                    v-loading="diaLoading"
                >
                    <div class="select-tree-box">
                        <SelectTree
                            @selectFolder="
                                (id) => {
                                    $emit('update:folderId', id);
                                }
                            "
                            :folderId="folderId"
                            :treeList="treeList"
                        />
                    </div>
                </div>
                <div class="content-main" v-else-if="config.type === 4">
                    <div class="release-content">{{ config.content }}</div>
                    <div class="class-and-grade">
                        <div class="name">班级</div>
                        <el-select
                            v-model="className"
                            size="mini"
                            placeholder="请选择"
                        >
                            <el-option
                                v-for="item in classList"
                                :key="item.id"
                                :label="item.className"
                                :value="item.id"
                            >
                            </el-option>
                        </el-select>
                    </div>
                </div>
            </template>

            <template v-slot:footer>
                <!-- 底部插槽 -->
                <div class="floor-con" v-if="config.type !== 3">
                    <TButton class="btn1" @touch="affirm">
                        {{ config.butList[0] }}
                    </TButton>
                    <TButton
                        class="btn2"
                        v-if="config.butList[1]"
                        @touch="
                            () => {
                                $emit('update:isDialog', false);
                            }
                        "
                    >
                        {{ config.butList[1] }}
                    </TButton>
                </div>
                <div class="floor-add-but" v-else>
                    <div class="mask" v-show="diaLoading"></div>
                    <TButton class="btn1" @touch="$emit('newFileToMy', 0)">
                        {{ config.butList[0] }}
                    </TButton>
                    <TButton
                        class="btn2"
                        v-if="config.butList[1]"
                        @touch="$emit('newFileToMy', 1)"
                    >
                        {{ config.butList[1] }}
                    </TButton>
                </div>
            </template>
        </TDialog>
    </div>
</template>

<script>
import TButton from "@/components/FunctionalComp/TButton.vue";
import SelectTree from "@/components/FunctionalComp/SelectTree.vue";
import TDialog from "@/components/FunctionalComp/TDialog.vue";
import { mapState } from "vuex";

export default {
    name: "ReconfirmDialog",

    components: {
        TButton,
        SelectTree,
        TDialog,
    },

    computed: {
        ...mapState("teacher", ["gradeAndClassOptions", "schoolSubjects"]),
    },

    data() {
        return {
            className: "",
            subjectName: "",
            classList: this.$store.getters.teachClasses,
            subjectList: this.$store.getters.teachSubjects,
        };
    },

    props: {
        config: Object,
        isDialog: Boolean,
        treeList: Array,
        folderId: [Number, String],
        diaLoading: Boolean,
    },

    methods: {
        // 确认按钮
        affirm() {
            if (this.config.type === 0) {
                this.$emit("affirm");
            } else if (this.config.type === 1) {
                if (!this.className || !this.subjectName)
                    return this.$message({
                        message: "必选项不可为空!",
                        type: "warning",
                    });
                const classInfo = this.classList.filter(
                    (item) => item.id === this.className
                )[0];
                const subInfo = this.subjectList.filter(
                    (item) => item.id === this.subjectName
                )[0];
                if (!classInfo && !subInfo)
                    return this.$message({
                        message: "必须选择班级和科目!",
                        type: "warning",
                    });
                const obj = {
                    classCode: classInfo.classCode,
                    gradeCode: classInfo.gradeCode,
                    gradeName: classInfo.gradeName,
                    className: classInfo.clazzName,
                    subjectCode: subInfo.code,
                };
                this.$emit("confirmToShare", obj);
            } else if (this.config.type === 2) {
                if (!this.className || !this.subjectName)
                    return this.$message({
                        message: "必选项不可为空!",
                        type: "warning",
                    });
                this.$emit("confirmUp", {
                    courseCode: this.subjectName,
                    gradeCode: this.className,
                });
            } else if (this.config.type === 4) {
                if (!this.className)
                    return this.$message({
                        message: "班级不可为空!",
                        type: "warning",
                    });
                const arr = this.classList.filter(
                    (item) => item.id === this.className
                );
                this.$emit("affirmRelease", arr);
            }
            this.subjectName = "";
            this.className = "";
        },

        close() {
            this.subjectName = "";
            this.className = "";
            this.$emit("update:isDialog", false);
        },
    },
};
</script>

<style lang="less" scoped>
.reconfirm-dialog {
    /deep/ .t-dialog-wrapper {
        main {
            flex: 0;
        }
    }
    .reconfirm-head-con {
        line-height: 0.65rem;
        font-size: 0.25rem;
        font-weight: 600;
        text-align: center;
        border-bottom: 1px solid #dedede;
        position: relative;
        width: 100%;
        .mask {
            border-radius: 0.21rem 0.21rem 0 0;
        }
        .icon-close {
            line-height: 1;
            font-size: 0.3rem;
            position: absolute;
            right: 0.2rem;
            top: 0.2rem;
        }
    }
    .content-main {
        text-align: center;
        line-height: 2;
        font-size: 0.23rem;
        padding: 0.3rem;
        min-height: 1.4rem;
        width: 100%;
        .subject,
        .class-and-grade {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-top: 0.3rem;
            .name {
                margin-right: 0.1rem;
            }
            .el-select {
                width: 60%;
            }
        }
        .select-tree-box {
            height: 4rem;
            overflow-y: auto;
        }
        .release-class {
            margin-top: 0.2rem;
            display: flex;
            justify-content: center;
            align-items: center;
            .name {
                margin-right: 0.1rem;
            }
            .el-select {
                width: 60%;
            }
        }
        .release-content,
        .share-content {
            margin-top: 0.2rem;
        }
    }
    .floor-con {
        display: flex;
        justify-content: space-around;
        width: 100%;
        margin-top: 0.1rem;
        .btn1 {
            font-size: 0.23rem;
            width: 2.2rem;
            height: 0.5rem;
            color: #fff;
            background: #3e83f8;
        }
        .btn2 {
            font-size: 0.23rem;
            width: 2.2rem;
            height: 0.5rem;
            color: #333333;
            background: #fff;
        }
    }
    .floor-add-but {
        display: flex;
        width: 100%;
        height: 0.94rem;
        padding: 0 0.3rem;
        justify-content: flex-end;
        position: relative;
        .mask {
            border-radius: 0 0 0.21rem 0.21rem;
        }
        .btn1 {
            font-size: 0.23rem;
            width: 2.2rem;
            height: 0.5rem;
            color: #333333;
            border: 0.01rem solid #979797;
            border-radius: 0.08rem;
            background: #f1f1f3;
            margin-right: 0.2rem;
        }
        .btn2 {
            font-size: 0.23rem;
            width: 2.2rem;
            height: 0.5rem;
            color: #fff;
            background: #3e83f8;
        }
    }
    .mask {
        position: absolute;
        width: 100%;
        height: 100%;
        background-color: rgba(255, 255, 255, 0.9);
        left: 0;
        z-index: 9;
    }
}
</style>