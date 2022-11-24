<template>
    <div class="test-paper-item">
        <!-- 主体内容 -->
        <div class="content">
            <!-- 左侧 -->
            <div class="left">
                <div class="title">
                    一、添加题目 <span class="must">*</span>
                </div>
                <div class="topic">
                    <div
                        class="topic-content"
                        contenteditable="true"
                        ref="topicRef"
                    >
                        <!-- 导入的图片 -->
                        <!-- <div class="img-box" style="display: flex; display: inline-block; max-width: 32%; white-space: nowrap; vertical-align: text-top;" v-if="imgInfo.length">
                            <img class="topic-img" style="max-width: 100%; margin: 0 5px;" :src="item" v-for="(item, index) in imgInfo" :key="index" />
                        </div> -->
                    </div>
                    <div class="but" v-if="facilityENV === 'windows'">
                        <button class="improtImg" v-touch="improtImg">
                            导入图片
                        </button>
                        <!-- <button v-if="false" class="addOption" v-show="type !== 1" v-touch="addOption">添加选项</button> -->
                    </div>
                </div>
            </div>
            <!-- 右侧 -->
            <div class="right">
                <div class="title">
                    二、题目类型 <span class="must">*</span>
                </div>
                <div class="select-and-judeg">
                    <button
                        :class="type !== 1 ? 'pitch-on' : null"
                        v-touch="
                            () => {
                                $emit('update:type', 0);
                            }
                        "
                    >
                        选择题
                    </button>
                    <button
                        :class="type !== 1 ? null : 'pitch-on'"
                        v-touch="
                            () => {
                                $emit('update:type', 1);
                            }
                        "
                    >
                        判断题
                    </button>
                </div>
                <div class="title">
                    三、题目分值 <span class="must">*</span>
                </div>
                <div class="score">
                    <input
                        type="text"
                        placeholder="请输入数字"
                        v-model="myScore"
                        @input="gradeInput"
                    />
                    <span> 分</span>
                </div>
                <div class="title">
                    四、答案 <span class="must">*</span>
                    <input
                        type="checkbox"
                        @change="check"
                        v-show="type !== 1"
                        :checked="isCheck"
                    />
                    <span v-show="type !== 1">是否多选</span>
                    <span
                        class="jia"
                        v-show="type !== 1"
                        v-touch="
                            () => {
                                updateOption(1);
                            }
                        "
                        >+</span
                    >
                    <span
                        class="jian"
                        v-show="type !== 1"
                        v-touch="
                            () => {
                                updateOption(-1);
                            }
                        "
                        >-</span
                    >
                </div>
                <div class="answer">
                    <div class="box" v-show="type !== 1">
                        <button
                            v-for="(item, index) in optionList"
                            :key="index"
                            v-touch="
                                () => {
                                    selectAnswer(index);
                                }
                            "
                            :class="item.checked ? 'b-color' : null"
                        >
                            {{ item.key }}
                        </button>
                    </div>
                    <div class="box" v-show="type === 1">
                        <button
                            :class="isCorrect === 0 ? 'b-color' : null"
                            v-touch="
                                () => {
                                    judegAnswer(0);
                                }
                            "
                        >
                            ×
                        </button>
                        <button
                            :class="isCorrect === 1 ? 'b-color' : null"
                            v-touch="
                                () => {
                                    judegAnswer(1);
                                }
                            "
                        >
                            √
                        </button>
                    </div>
                </div>
                <div class="title">五、解析</div>
                <div class="analysis-text">
                    <textarea
                        class="analysis"
                        v-text="analysis"
                        maxlength="200"
                        @input="alsInput"
                        placeholder="请输入解析（选填）"
                    ></textarea>
                    <div class="count">
                        <span>{{ textNum }}</span> / 200
                    </div>
                </div>
            </div>
        </div>
        <!-- 底部 -->
        <div class="floor">
            <button v-touch="affirmAdd">{{ butContent }}</button>
        </div>
        <input type="file" accept="image/*" ref="fileRef" hidden />
    </div>
</template>

<script>
import cos from "@/utils/cos";

export default {
    name: "TestPaperItem",
    props: {
        index: {
            type: [Number, String],
            required: true,
        },
        analysis: String,
        answer: String,
        examPaperId: [Number, String],
        options: [Number, String],
        score: [Number, String],
        topic: String,
        type: [Number, String],
    },
    data() {
        return {
            optionList: [], // 选项数组
            isCorrect: -1, // 判断题正确答案 0：错误 1：正确
            isCheck: false, // 是否多选
            imgInfo: [], // 图片信息
            butContent: "确认添加", // 按钮的显示内容
            gradeHtml: "", // 分数的html结构
            myScore: "",
            textNum: 0,
            facilityENV: this.$store.getters.facilityENV,
        };
    },
    watch: {
        type() {
            if (this.type !== 1) {
                this.isCorrect = -1;
            } else {
                setTimeout(() => {
                    this.optionList = [];
                }, 100);
            }
        },
    },
    methods: {
        // 导入图片
        improtImg() {
            const that = this;
            this.$refs.fileRef.click();
            this.$refs.fileRef.onchange = function (e) {
                if (!this.files.length)
                    return this.$message({
                        message: "一次只能上传一张图片",
                        type: "warning",
                    });
                if (this.files[0].type.indexOf("image/") === -1)
                    return this.$message({
                        message: "文件格式错误",
                        type: "warning",
                    });
                if (this.files[0].size / 1048576 > 10)
                    return this.$message({
                        message: "图片最大10M",
                        type: "warning",
                    });
                // 将图片转为base64格式
                let reader = new FileReader();
                reader.readAsDataURL(this.files[0]);
                reader.onloadend = function () {
                    that.imgInfo.push(reader.result);
                    that.addImgDom(reader.result);
                };
            };
        },
        // 添加页面图片dom
        addImgDom(url) {
            console.log(url);
            const imgDom = `<img class="topic-img" style="max-width: 30%; margin: 0 5px;" src=${url} />`;
            this.$refs.topicRef.innerHTML += imgDom;
        },
        // 更新选项
        updateOption(n) {
            if (this.options >= 8 && n > 0) return;
            if (n > 0) {
                const sign = String.fromCharCode(65 + this.optionList.length);
                this.optionList.push({
                    key: sign,
                    checked: false,
                    content: "",
                    isInput: true,
                });
            } else {
                this.optionList.pop();
            }
            this.$emit("update:options", this.options + n);
        },
        // 添加分数
        gradeInput(e) {
            let myGrade = e.target.value.replace(/[^\d]/g, "");
            if (!myGrade) {
                e.target.value = "";
                this.$emit("update:score", myGrade);
                this.myScore = myGrade;
            } else {
                this.$emit("update:score", myGrade);
                this.myScore = myGrade;
                // 如果分数超过限制
                if (myGrade > 50) {
                    e.target.value = 50;
                    myGrade = 50;
                    this.$emit("update:score", myGrade);
                    this.myScore = myGrade;
                    this.$message({
                        message: "分数最高为50",
                        type: "warning",
                    });
                }
                this.gradeHtml = `<span class="grade" style="margin-right: 10px;" contenteditable="false">(${myGrade}分)</span>`;
            }
        },
        alsInput(e) {
            console.log(e.target.value.length);
            this.textNum = e.target.value.length;
            this.$emit("update:analysis", e.target.value);
        },
        // 获取文件的本地地址
        // getObjectURL (file) {
        //     let url = null ;
        //     if (window.createObjectURL != undefined) { // basic
        //         url = window.createObjectURL(file) ;
        //     }else if (window.webkitURL != undefined) { // webkit or chrome
        //         url = window.webkitURL.createObjectURL(file) ;
        //     }else if (window.URL != undefined) { // mozilla(firefox)
        //         url = window.URL.createObjectURL(file) ;
        //     }
        //     return url ;
        // },
        // 判断题选择答案
        judegAnswer(num) {
            this.isCorrect = num;
        },
        // 是否选中多选
        check(e) {
            this.isCheck = e.target.checked;
            console.log(this.isCheck);
            if (!this.isCheck) {
                this.optionList.forEach((item) => (item.checked = false));
            }
        },
        // 选择题答案
        selectAnswer(index) {
            if (this.isCheck) {
                this.optionList[index].checked =
                    !this.optionList[index].checked;
            } else {
                for (let i = 0; i < this.optionList.length; i++) {
                    if (i === index) {
                        this.optionList[i].checked =
                            !this.optionList[index].checked;
                    } else {
                        this.optionList[i].checked = false;
                    }
                }
            }
        },
        // 确认添加
        affirmAdd() {
            const topicContent = this.$refs.topicRef.innerHTML.replace(
                /font-size/gi,
                ""
            );
            if (!topicContent || !this.score)
                return this.$message({
                    message: "必填项不可为空",
                    type: "warning",
                });
            // type为1是判断题
            if (this.type !== 1) {
                if (this.optionList.length < 2)
                    return this.$message({
                        message: "选择题至少有两个选项",
                        type: "warning",
                    });
                let arr = [];
                for (let i = 0; i < this.optionList.length; i++) {
                    if (this.optionList[i].checked) arr.push(i);
                }
                if (this.isCheck && arr.length < 2)
                    return this.$message({
                        message: "多选至少有两个答案",
                        type: "warning",
                    });
                if (!this.isCheck && arr.length < 1)
                    return this.$message({
                        message: "请选择答案",
                        type: "warning",
                    });
                this.$emit("update:answer", arr.join("-"));
                if (this.isCheck) {
                    this.$emit("update:type", 2);
                }
            } else {
                if (this.isCorrect === -1)
                    return this.$message({
                        message: "请选择答案",
                        type: "warning",
                    });
                this.$emit("update:answer", "" + this.isCorrect);
            }
            this.$emit("update:topic", this.gradeHtml + topicContent);
            if (this.butContent === "确认修改") {
                this.$emit("affirmUpdate", this.index);
            } else {
                this.$emit("affirmAdd", this.index);
            }
        },
    },
    created() {
        if (this.type === 2) {
            this.isCheck = true;
        }

        if (this.type == 1) {
            this.isCorrect = parseInt(this.answer);
        } else {
            if (!this.answer) return;
            const answers = this.answer.split("-");
            for (let i = 0; i < this.options; i++) {
                this.optionList.push({
                    key: String.fromCharCode(65 + i),
                    checked: false,
                });
            }
            for (let j = 0; j < answers.length; j++) {
                this.optionList[parseInt(answers[j])].checked = true;
            }
        }
        if (this.score) this.myScore = this.score;
    },

    mounted() {
        if (this.topic) {
            let t = this.topic;
            const rule = `<span class="grade" style="margin-right: 10px;" contenteditable="false">\\(${this.score}分\\)</span>`;
            this.gradeHtml = `<span class="grade" style="margin-right: 10px;" contenteditable="false">(${this.score}分)</span>`;
            const reg = new RegExp(rule);
            t = t.replace(reg, "");
            this.$nextTick(() => {
                this.$refs.topicRef.innerHTML = t;
            });
            this.butContent = "确认修改";
        }
    },
};
</script>

<style lang="less" scoped>
p {
    margin: 0;
    padding: 0;
}
.test-paper-item {
    padding: 0.22rem 0.33rem;
    box-sizing: border-box;
    background-color: #f6f7f9;
    border-radius: 0.04rem;
    margin-top: 20px;
    border: 2px solid #ced5e0;
    .header {
        text-align: center;
        margin-bottom: 0.46rem;
        input {
            width: 6.04rem;
            height: 0.58rem;
            border-radius: 0.04rem;
            border: 2px solid #3e83f8;
            font-size: 0.23rem;
            text-align: center;
            background-color: #f6f7f9;
        }
    }
    .content {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        margin-bottom: 0.38rem;
        .left {
            width: 48%;
            display: flex;
            flex-direction: column;
            .topic {
                flex: 1;
                background-color: #fff;
                border-radius: 0.04rem;
                border: 2px solid #ced5e0;
                padding: 0.21rem;
                box-sizing: border-box;
                display: flex;
                flex-direction: column;
                .topic-content:empty::before {
                    content: "请输入或导入题目";
                    color: #ccc;
                }
                .topic-content {
                    flex: 1;
                    overflow-y: auto;
                    margin-bottom: 10px;
                    font-size: 0.21rem;
                    .option-item {
                        margin: 5px 0;
                    }
                    .details {
                        flex: 1;
                        margin-left: 10px;
                        background-color: #f1f1f1;
                    }
                }
                .but {
                    display: flex;
                    justify-content: space-between;
                    button {
                        width: 1.08rem;
                        line-height: 0.29rem;
                        border-radius: 0.05rem;
                        border: 1px solid #3e83f8;
                        background-color: #fff;
                        font-size: 0.17rem;
                        color: #3e83f8;
                    }
                }
            }
        }
        .right {
            width: 48%;
            font-size: 0.21rem;
            .select-and-judeg {
                margin-bottom: 0.25rem;
                .pitch-on {
                    width: 0.83rem;
                    color: #3e83f8;
                    background: rgba(62, 131, 248, 0.2);
                    border-radius: 0.04rem;
                }
                button {
                    line-height: 0.33rem;
                    font-size: 0.19rem;
                    font-weight: 600;
                    margin-right: 0.42rem;
                    color: #999999;
                }
            }
            .score {
                margin-bottom: 0.25rem;
                input {
                    padding: 5px 10px;
                    background-color: #fff;
                    border: 2px solid #ced5e0;
                    width: 1.54rem;
                    border-radius: 0.04rem;
                }
                span {
                    color: #333333;
                    font-weight: 600;
                    font-size: 0.21rem;
                }
            }
            .answer {
                box-sizing: border-box;
                height: 0.75rem;
                background-color: #fff;
                padding: 8px;
                border: 2px solid #ced5e0;
                border-radius: 0.04rem;
                margin-bottom: 0.25rem;
                .box {
                    height: 100%;
                    overflow-x: auto;
                    .b-color {
                        border: 0.01rem solid #3e83f8;
                        background-color: rgba(62, 131, 248, 0.2);
                    }
                }
                button {
                    height: 100%;
                    width: 0.75rem;
                    text-align: center;
                    background-color: #fff;
                    border: 1px solid #333;
                    border-radius: 0.04rem;
                    margin-right: 10px;
                }
            }
            .analysis-text {
                width: 100%;
                height: 1.05rem;
                position: relative;
                .analysis {
                    width: 100%;
                    height: 100%;
                    background-color: #fff;
                    outline: none;
                    resize: none;
                    border: 2px solid #ced5e0;
                    border-radius: 0.04rem;
                    padding: 10px;
                    box-sizing: border-box;
                }
                .count {
                    position: absolute;
                    font-size: 0.19rem;
                    bottom: 0;
                    right: 0.1rem;
                    span {
                        color: #3e83f8;
                    }
                }
            }
        }
        .title {
            margin-bottom: 0.21rem;
            font-size: 0.21rem;
            font-weight: 600;
            color: #333333;
            line-height: 2;
            .must {
                color: #fc5555;
            }
            input {
                vertical-align: middle;
                margin-left: 0.45rem;
                margin-right: 2px;
            }
            .jia,
            .jian {
                line-height: 2;
                border: 1px solid #333;
                border-radius: 4px;
                margin-left: 20px;
                padding: 0 20px;
            }
            .jian {
                margin-left: 5px;
            }
        }
    }
    .floor {
        text-align: center;
        button {
            width: 2rem;
            line-height: 0.46rem;
            background: #3e83f8;
            border-radius: 0.08rem;
            font-size: 0.21rem;
            color: #fff;
        }
    }
}
</style>