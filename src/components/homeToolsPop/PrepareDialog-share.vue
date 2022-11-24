<template>
    <div class="prepare-dialog">
        <Dialog
            @open="open"
            @close="close"
            width="5.21rem"
            height="2.98rem"
            background="#F1F1F3"
            position="fixed"
        >
            <template v-slot:header>
                <div class="head-con">
                    <span>内容将共享到学习助手，请选择</span>
                    <i class="iconfont icon-close my-icon" v-touch="close"></i>
                </div>
            </template>
            <template v-slot:default>
                <div class="main-con">
                    <!-- <div class="className">
            <span>科目：</span>
            <el-select v-model="dataValue" placeholder="请选择" ref="getValue">
              <el-option
                v-for="item in dataList"
                :key="item.key"
                :label="item.value"
                :value="item.key"
              >
              </el-option>
            </el-select>
          </div>
          <div class="grade">
            <span>年级：</span>
            <el-select v-model="gradeValue" placeholder="请选择">
              <el-option
                v-for="item in gradeList"
                :key="item.value"
                :label="item.value"
                :value="item.key"
              >
              </el-option>
            </el-select>
          </div> -->
                    <div class="className">
                        <span>科目：</span>
                        <DropDown
                            :list="['数学', '英语', '语文']"
                            :dropDownInfo="{
                                width: '1.38rem',
                                height: '0.4rem',
                                background: '#F1F1F3',
                                border: '2px solid #CED5E0',
                            }"
                        ></DropDown>
                    </div>
                    <div class="grade">
                        <span>年级：</span>
                        <DropDown
                            :list="[
                                '一年级',
                                '二年级',
                                '三年级',
                                '四年级',
                                '五年级',
                            ]"
                            :dropDownInfo="{
                                width: '1.38rem',
                                height: '0.4rem',
                                background: '#F1F1F3',
                                border: '2px solid #CED5E0',
                            }"
                        ></DropDown>
                    </div>
                </div>
            </template>
            <template v-slot:footer>
                <div class="footer-con">
                    <TButton
                        class="button"
                        @touch="open(dataValue, gradeValue)"
                    >
                        确认
                    </TButton>
                    <!-- <TButton
                        class="button"
                        content="确认"
                        :configItems="{
                            width: '2.21rem',
                            height: '0.51rem',
                            fontWeight: 400,
                        }"
                        @touch="open(dataValue, gradeValue)"
                    /> -->
                </div>
            </template>
        </Dialog>
    </div>
</template>
<script>
import Dialog from "../FunctionalComp/Dialog.vue";
import TButton from "../FunctionalComp/TButton.vue";
import DropDown from "../FunctionalComp/DropDown.vue";
export default {
    components: {
        Dialog,
        TButton,
        DropDown,
    },
    props: {
        books: Array,
        dialogVisible: Boolean,
    },
    data() {
        return {
            item: {},
            dataList: [
                { key: 1, value: "语文" },
                { key: 2, value: "数学" },
                { key: 3, value: "英语" },
            ],
            dataValue: "",
            gradeList: [
                { key: 1, value: "一年级" },
                { key: 2, value: "二年级" },
                { key: 3, value: "三年级" },
                { key: 4, value: "四年级" },
                { key: 5, value: "五年级" },
            ],
            gradeValue: "",
            start: false,
            tips: "",
        };
    },
    methods: {
        open() {
            // console.log(this.books);
            // dataValue = this.$refs.getValue.selected.value;
            // console.log(dataValue);
            // console.log(gradeValue);
            this.$emit("dialogVisible", false);
            this.$emit("msgChange", { text: "分享成功", flag: true });
        },
        close() {
            // dialog 的关闭事件
            this.$emit("dialogVisible", false);
        },
    },
};
</script>
<style lang="less" scoped>
.prepare-dialog {
    // position: fixed;
    .head-con {
        width: 100%;
        height: 0.23rem;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0.58rem 0 0 0;
        span {
            font-size: 0.23rem;
            color: #333333;
        }
        .my-icon {
            position: absolute;
            // right: 0;
            top: 37%;
            transform: translateY(-50%);
            margin: 0.25rem 0.25rem 2.56rem 4.79rem;
            font-size: 0.35rem;
        }
    }
    .main-con {
        width: 5.21rem;
        height: 0.97rem;

        .className {
            // width: 1.38rem;
            // height: 0.4rem;
            display: flex;
            align-items: center;
            margin-top: 0.21rem;
            margin-left: 1.57rem;
            span {
                font-size: 0.23rem;
                color: #333333;
            }
            .el-select {
                width: 1.5rem;
                // height: 0.4rem;
            }
        }
        .grade {
            // width: 1.38rem;
            // height: 0.4rem;
            display: flex;
            align-items: center;
            margin-top: 0.17rem;
            margin-left: 1.57rem;
            position: fixed;
            span {
                font-size: 0.23rem;
                color: #333333;
            }
            .el-select {
                width: 1.5rem;
                // height: 0.4rem;
            }
        }
    }
    .footer-con {
        width: 100%;
        padding: 0 0.29rem;
        display: flex;
        justify-content: space-between;
        margin-top: 0.25rem;
        .button {
            width: 2.21rem;
            height: 0.51rem;
            font-weight: 400;
            margin: 0rem 1.5rem;
        }
    }
}
</style>
