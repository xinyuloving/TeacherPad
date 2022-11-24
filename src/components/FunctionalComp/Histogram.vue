<template>
    <div class="histogram">
        <!-- 柱状图 -->
        <div class="main" ref="main"></div>
    </div>
</template>

<script>
// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口。
import * as echarts from "echarts/core";
// 引入柱状图图表，图表后缀都为 Chart
import { BarChart } from "echarts/charts";
// 引入提示框，标题，直角坐标系组件，组件后缀都为 Component
import {
    TitleComponent,
    TooltipComponent,
    GridComponent,
} from "echarts/components";
// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import { CanvasRenderer } from "echarts/renderers";
// 注册必须的组件
echarts.use([
    TitleComponent,
    TooltipComponent,
    GridComponent,
    BarChart,
    CanvasRenderer,
]);

// 初始化图表，设置配置项
import { throttle } from "@/utils/util";
export default {
    props: {
        // choiceOptions: {
        //     type: Array,
        //     required: true,
        // },
        // seriesData: {
        //     type: Array,
        //     required: true,
        // },
        configItems: {
            type: Object,
            required: true,
        },
    },
    mounted() {
        if (!this.myChart) {
            this.myChart = echarts.init(this.$refs.main);
            this.mapping();
        }
    },
    watch: {
        "configItems.seriesData": {
            handler() {
                // throttle(this.mapping)();
                throttle(this.mapping, this.mappingTimer, 2000);
            },
            deep: true,
        },
    },
    methods: {
        mapping() {
            // 绘制图表函数
            const that = this;
            const publicOption = {
                xAxis: {
                    data: that.configItems.choiceOptions,
                    axisTick: {
                        show: false,
                    },
                    axisLabel: {
                        // interval: 0,
                        color: "#333333",
                    },
                },
                yAxis: {
                    axisLabel: {
                        show: true,
                        color: "#333333",
                        fontFamily: "PingFangSC-Medium, PingFang SC",
                    },
                    minInterval: 1,
                },
                // grid: {
                //     top: "5%",
                //     width: "100%",
                //     height: "80%",
                // },
                series: [
                    {
                        type: "bar",
                        data: that.configItems.seriesData,
                        barWidth: "50%",
                        itemStyle: {
                            // color: "#3E83F8",
                            color(params) {
                                return that.configItems.barColorGroups[
                                    params.dataIndex
                                ];
                            },
                            borderRadius: [3, 3, 0, 0],
                        },
                    },
                ],
            };
            this.myChart.setOption(publicOption);
        },
    },
};
</script>

<style lang="less" scoped>
.histogram {
    width: 100%;
    height: 100%;
    .main {
        width: 100%;
        height: 100%;
    }
}
</style>