<template>
    <div class="topic-item">
        <!-- 是否正确 -->
        <div class="is-correct">
            <i class="iconfont icon-duihao1" v-if="subject.answerResult === 0"></i>
            <i class="iconfont icon-cuo" v-else></i>
        </div>
        <!-- 题目内容 -->
        <div class="content-box">
            <div class="content" v-html="subject.topic"></div>
            <!-- 解析 -->
            <div class="analysis-box" :style="{ height: analysisHeight }">
                <!-- <div class="unfold" v-touch="analysis" v-show="!isAnalysis">展开答案和解析</div> -->
                <div class="unfold-box" :style="{ top: analysisTop }">
                    <div class="answer">
                        <span class="name-text">答案：</span>
                        <span class="answer-text">{{ subject.answer }}</span>
                    </div>
                    <div class="analysis">
                        <span class="name-text">解析：</span>
                        <span>{{ subject.analysis ? subject.analysis : '无' }}</span>
                    </div>
                    <div class="pack-up" v-touch="analysis">{{ analysisText }}</div>
                </div>
                
            </div>
        </div>
        <!-- 所选答案 -->
        <div class="input-answer">（{{ subject.inputAnswer }}）</div>
    </div>
</template>

<script>

export default {

    name: 'TopicItem',

    props: {
        subject: {
            type: Object,
            required: true
        }
    },

    data() {
        return {
            analysisHeight: '0.4rem',      // 解析高度
            analysisText: '展开答案和解析',       // 是否预览
            analysisTop: '-1.4rem'
        }
    },

    methods: {
        // 获取显示的答案
        getAnswer(answer) {
            if (this.subject.type === 0 && answer !== '') {
                return String.fromCharCode(parseInt(answer) + 65)
            } else if (this.subject.type === 1 && answer !== '') {
                if (answer === '0') return '×';
                return '√'
            } else if (this.subject.type === 2 && answer !== '') {
                let arr = [];
                answer.split('-').forEach(item => arr.push(String.fromCharCode(parseInt(item) + 65)));
                return arr.join(',')
            } else {
                return ''
            }
        },
        analysis() {
            if (this.analysisHeight === '0.4rem') {
                this.analysisHeight = '1.8rem';
                this.analysisTop = '0';
                this.analysisText = '收起答案和解析'
            } else {
                this.analysisHeight = '0.4rem';
                this.analysisTop = '-1.4rem';
                this.analysisText = '展开答案和解析'
            }
        }
    },
    created() {
        this.subject.inputAnswer = this.getAnswer(this.subject.inputAnswer);
        this.subject.answer = this.getAnswer(this.subject.answer)
    }
}
</script>

<style lang="less" scoped>
    .topic-item {
        margin-top: 0.33rem;
        display: flex;
        padding-right: 2rem;
        position: relative;
        .input-answer {
            position: absolute;
            top: 0;
            right: 0;
        }
        .is-correct {
            // width: 0.23rem;
            margin-right: 0.21rem;
        }
        .content-box {
            flex: 1;
            .content {
                /deep/ .option-box {
                    display: flex;
                    flex-wrap: wrap;
                    .option-item {
                        margin-right: 30px;
                        margin-top: 10px;
                    }
                }
            }
            .analysis-box {
                margin-top: 0.15rem;
                transition: all .3s;
                overflow: hidden;
                position: relative;
                flex: 1;
                .unfold {
                    color: #3E83F8;
                    line-height: 0.4rem;
                }
                .analysis {
                    margin-top: 0.1rem;
                    height: 0.9rem;
                    overflow-y: auto;
                }
                .answer {
                    height: 0.3rem;
                }
                .pack-up {
                    margin-top: 0.1rem;
                    color: #3E83F8;
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
                    transition: all .3s;
                }
            }
        }
    }
    .icon-duihao1 {
        color: #0BC75B;
    }
    .icon-cuo {
        color: #F35E5E;
    }
</style>