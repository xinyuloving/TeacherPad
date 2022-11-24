<template>
    <div class="select-chart">
        <!-- 选择题/判断题的 图表 -->
        <!-- <Histogram :choiceOptions="choiceOptions" :seriesData="seriesData" /> -->
        <Histogram :configItems="configItems" />
    </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
const { mapState } = createNamespacedHelpers("cloudClassroom");
import Histogram from "@/components/FunctionalComp/Histogram.vue";
export default {
    components: { Histogram },
    computed: {
        ...mapState({
            strongId: (state) => state.toolbar.strongId,
            choiceOptions: (state) => state.toolbar.choice.options,
            choiceCorrectAnswer: (state) => state.toolbar.choice.correctAnswer,
            singleOrMult: (state) => state.toolbar.choice.singleOrMult,
            judgeOptions: (state) => state.toolbar.judge.options,
            judgeCorrectAnswer: (state) => state.toolbar.judge.correctAnswer,
        }),

        configItems() {
            // 传给柱状图的配置项
            // const choiceOptions = this.options.map((item) => item.content);
            // const seriesData = this.options.map((item) => item.selectNum);
            // let barColorGroups;
            // if (!this.correctAnswer) {
            //     // 老师还没有设置正确答案
            //     const temArr = [];
            //     for (let i = 0; i < seriesData.length; i++) {
            //         // const e = seriesData[i];
            //         temArr.push("#3E83F8");
            //     }
            //     barColorGroups = temArr;
            // } else {
            //     // 老师设置了正确答案
            //     const temArr = [];
            //     for (let i = 0; i < seriesData.length; i++) {
            //         temArr.push("#FF6565");
            //     }
            //     if (this.singleOrMult) {
            //         // 多选
            //         for (let i = 0; i < this.correctAnswer.length; i++) {
            //             const e = this.correctAnswer[i];
            //             const index = choiceOptions.findIndex(
            //                 (item) => item === e
            //             );
            //             temArr[index] = "#3E83F8";
            //         }
            //     } else {
            //         // 单选
            //         const index = choiceOptions.findIndex(
            //             (item) => item === this.correctAnswer
            //         );
            //         temArr[index] = "#3E83F8";
            //     }
            //     barColorGroups = temArr;
            // }
            // return {
            //     // 老师设置的所有选项
            //     choiceOptions,
            //     // 学生答题的返回数据
            //     seriesData,
            //     // 老师设置答案之前与老师设置答案之后的颜色
            //     barColorGroups,
            // };

            // const choiceOptions =
            //     this.strongId === 1
            //         ? this.choiceOrJudge.options.map((item) => item.content)
            //         : this.strongId === 3
            //         ? this.choiceOrJudge.options.map((item) => item.content)
            //         : [];
            let choiceOptions, judgeOption, seriesData, correctAnswer; //  --> ['A','B'...], [1, 2] id

            if (this.strongId === 11) {
                choiceOptions = this.choiceOptions.map((item) => item.content);
                seriesData = this.choiceOptions.map((item) => item.selectNum);
                correctAnswer = this.choiceCorrectAnswer;
            } else if (this.strongId === 12) {
                judgeOption = this.judgeOptions.map((item) => item.id);
                choiceOptions = ["正确", "错误"];
                seriesData = this.judgeOptions.map((item) => item.selectNum);
                correctAnswer = this.judgeCorrectAnswer;
            }
            let barColorGroups; // 柱条颜色组

            if (!correctAnswer) {
                // 老师还没有设置正确答案
                const temArr = [];
                for (let i = 0; i < seriesData.length; i++) {
                    // const e = seriesData[i];
                    temArr.push("#3E83F8");
                }
                barColorGroups = temArr;
            } else {
                // 老师设置了正确答案
                const temArr = [];
                for (let i = 0; i < seriesData.length; i++) {
                    temArr.push("#FF6565");
                }
                if (this.strongId === 11) {
                    if (this.singleOrMult) {
                        // 多选
                        for (let i = 0; i < correctAnswer.length; i++) {
                            const e = correctAnswer[i];
                            const index = choiceOptions.findIndex(
                                (item) => item === e
                            );

                            temArr[index] = "#3E83F8";
                        }
                    } else {
                        // 单选
                        const index = choiceOptions.findIndex(
                            (item) => item === correctAnswer
                        );
                        temArr[index] = "#3E83F8";
                    }
                } else if (this.strongId === 12) {
                    const index = judgeOption.findIndex(
                        (item) => item === correctAnswer
                    );
                    temArr[index] = "#3E83F8";
                }
                barColorGroups = temArr;
            }
            return {
                // 老师设置的所有选项
                choiceOptions,
                // 学生答题的返回数据
                seriesData,
                // 老师设置答案之前与老师设置答案之后的颜色
                barColorGroups,
            };
        },
    },
};
</script>

<style lang="less" scoped>
.select-chart {
    width: 100%;
    height: 100%;
}
</style>