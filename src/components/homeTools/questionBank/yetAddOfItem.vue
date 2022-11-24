<template>
    <div class="yet-add-of-item">
        <div class="label">{{ subject.type | typeFilter }}</div>
        <div v-html="subject.topic"></div>
        <div class="analysis-box" :style="{ height: analysisHeight }">
            <!-- <div class="unfold" v-touch="analysis" v-show="!isAnalysis">展开答案和解析</div> -->
            <div class="unfold-box" :style="{ top: analysisTop }">
                <div class="answer">
                    <span class="name-text">答案：</span>
                    <span class="answer-text">{{ analy }}</span>
                </div>
                <div class="analysis">
                    <span class="name-text">解析：</span>
                    <span>{{
                        subject.analysis ? subject.analysis : "无"
                    }}</span>
                </div>
                <div class="pack-up">
                    <span class="analysis-but" v-touch="analysis">
                        {{ analysisText }}
                    </span>
                    <div class="fun" v-if="showDelBtn">
                        <TButton class="but amend" @touch="updateTopic"> 修改 </TButton>
                        <TButton class="but delete" @touch="removeTopic"> 删除 </TButton>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import TButton from "@/components/FunctionalComp/TButton.vue";

export default {
    name: "YetAddOfItem",
    components: {
        TButton,
    },
    filters: {
        typeFilter(type) {
            if (type === 0) {
                return "单选题";
            } else if (type === 1) {
                return "判断题";
            } else {
                return "多选题";
            }
        },
    },
    computed: {
        analy() {
            if (this.subject.type === 1) {
                if (this.subject.answer === "1") {
                    return "√";
                } else {
                    return "×";
                }
            } else if (this.subject.type === 0) {
                return String.fromCharCode(65 + parseInt(this.subject.answer));
            } else {
                let arr = this.subject.answer.split("-");
                let answers = [];
                arr.forEach((item) => {
                    answers.push(String.fromCharCode(65 + parseInt(item)));
                });
                return answers.join("-");
            }
        },
    },
    props: {
        subject: {
            type: Object,
            required: true,
        },
        index: [Number, String],
        showDelBtn: {
            type: Boolean,
            default: true,
        },
    },
    data() {
        return {
            analysisTop: "-1.4rem",
            analysisHeight: "0.4rem",
            analysisText: "展开答案和解析",
            isAnalysis: false,
        };
    },
    methods: {
        // 修改题目
        updateTopic() {
            // console.log('修改');
            this.$emit("updateTopic", this.index);
        },
        // 删除题目
        removeTopic() {
            console.log(this.subject.id);
            this.$emit("removeTopic", this.index);
        },
        // 展开解析
        analysis() {
            if (this.analysisHeight === "0.4rem") {
                this.analysisHeight = "1.8rem";
                this.analysisTop = "0";
                this.analysisText = "收起答案和解析";
            } else {
                this.analysisHeight = "0.4rem";
                this.analysisTop = "-1.4rem";
                this.analysisText = "展开答案和解析";
            }
        },
    },
};
</script>

<style lang="less" scoped>
.yet-add-of-item {
    margin-top: 0.13rem;
    border-radius: 0.04rem;
    border: 2px solid #ced5e0;
    padding: 0.25rem 0.38rem 0.25rem 0.9rem;
    position: relative;
    font-size: 0.21rem;
    background-color: #f6f7f9;
    .analysis {
        transition: all 0.3s;
        // background-color: #666;
        .answer {
            line-height: 2;
            span {
                font-weight: 600;
            }
            strong {
                color: rgb(89, 167, 38);
            }
        }
        .myAnalysis {
            // display: flex;
            p {
                color: rgb(114, 114, 114);
                display: inline-block;
            }
        }
    }
    .analysis-box {
        margin-top: 0.15rem;
        transition: all 0.3s;
        overflow: hidden;
        position: relative;
        flex: 1;
        .unfold {
            color: #3e83f8;
            line-height: 0.4rem;
        }
        .analysis {
            margin-top: 0.1rem;
            height: 0.9rem;
            overflow-y: auto;
            width: 100%;
        }
        .answer {
            height: 0.3rem;
        }
        .pack-up {
            margin-top: 0.1rem;
            color: #3e83f8;
            display: flex;
            .fun {
                flex: 1;
                display: flex;
                justify-content: flex-end;
                .but {
                    width: 0.96rem;
                    height: 0.4rem;
                    font-size: 0.19rem;
                }
                .delete {
                    background: #ffffff;
                    color: #3e83f8;
                    border: 0.01rem solid #3e83f8;
                }
                .amend {
                    background: #3e83f8;
                    color: #fff;
                    margin-right: 0.2rem;
                }
            }
        }
        .name-text {
            color: #999;
        }
        .answer-text {
            font-weight: 600;
        }
        .unfold-box {
            height: 1.8rem;
            position: absolute;
            transition: all 0.3s;
            width: 100%;
        }
    }
    .label {
        width: 0.8rem;
        line-height: 0.33rem;
        background: #e3ebf9;
        border-radius: 0.04rem;
        color: #3e83f8;
        text-align: center;
        font-size: 0.17rem;
        position: absolute;
        top: 0.22rem;
        left: 0;
    }
}
</style>