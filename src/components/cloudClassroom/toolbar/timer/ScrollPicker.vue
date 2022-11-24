<template>
    <div class="scroll_picker">
        <!-- <ul
            class="scroll_con scroll_bar"
            ref="scrollBar"
            v-touch:start="getMousePosition"
            v-touch:moving="handleMouseMove"
            v-touch:end="bounce"
            @wheel="handleWheel"
            :style="{
                transform: `translateY(${distance}px)`,
                transition: isBounce ? `transform 0.15s` : '',
            }"
        >
            <li
                :class="{ active: index === activeIndex }"
                v-for="(item, index) in options"
                :key="index"
                ref="scrollItem"
            >
                {{ item }}
            </li>
        </ul> -->
        <ul
            class="scroll_con scroll_bar"
            ref="scrollBar"
            @touchstart="getMousePosition"
            @touchmove="handleMouseMove"
            @touchend="bounce"
            @wheel="handleWheel"
            :style="{
                transform: `translateY(${distance}px)`,
                transition: isBounce ? `transform 0.15s` : '',
            }"
        >
            <li
                :class="{ active: index === activeIndex }"
                v-for="(item, index) in options"
                :key="index"
                ref="scrollItem"
            >
                {{ item }}
            </li>
        </ul>
    </div>
</template>

<script>
import { isPc } from "@/utils/util";
let y;
export default {
    props: {
        options: {
            type: Array,
            required: true,
        },
    },

    data() {
        return {
            itemHeight: 0, // 每一项的高度
            scrollBarHeight: 0, // 滚动条的高度
            activeIndex: -1,
            distance: 0,
            isBounce: true,
            isPress: false, // 是否按下，按下之后才能移动，兼容 pc
        };
    },

    computed: {
        scrollBar() {
            return this.$refs.scrollBar;
        },
        scrollItem() {
            return this.$refs.scrollItem[0];
        },
    },
    mounted() {
        this.init();
        this.$refs.scrollBar.addEventListener(
            "mousedown",
            this.getMousePosition
        );
    },
    watch: {
        isBounce: {
            handler(newValue) {
                if (newValue) {
                    // 判断滚动到了那个item --> 滚动的距离加上第一项的高度/每一项的高度，四舍五入就是滚动到了哪个或者容器中占有最多的该项元素

                    const target = this.calculate();
                    const realDistance = target * this.itemHeight;
                    this.distance =
                        this.distance < 0 ? -realDistance : realDistance;
                }
            },
        },
    },
    methods: {
        init() {
            this.itemHeight = this.scrollItem.offsetHeight;
            this.scrollBarHeight = this.itemHeight * (this.options.length - 1);
        },
        getMousePosition(evt) {
            // 获取鼠标按下的点位
            const e = evt.touches ? evt.touches[0] : evt;
            y = parseInt(e.clientY);
            this.isPress = true;
            this.isBounce = false;

            this.handlePc(); // 绑定移动和松开事件
        },
        handleMouseMove(evt) {
            // 移动
            // 先要判断上滑还是下滑
            if (!this.isPress) return;
            const e = evt.touches ? evt.touches[0] : evt;
            const targetY = parseInt(e.clientY); // 滑动后获取鼠标位置
            let distance; // 滑动的距离
            if (targetY < y) {
                // 上滑
                distance = targetY - y;
                this.distance += distance;
            } else {
                // 下滑
                distance = y - targetY;
                this.distance -= distance;
            }
            y = targetY;
        },
        bounce() {
            this.isBounce = true;
            this.isPress = false;

            this.unBound(); // 解绑事件

            const { distance, scrollBarHeight } = this;
            if (distance < 0 && distance < -scrollBarHeight) {
                this.distance = -scrollBarHeight;
                return;
            }

            if (distance > 0) {
                this.distance = 0;
                return;
            }
        },
        handleWheel(e) {
            const flag = e.deltaY > 0; // true 下滑；false 上滑
            if (flag) {
                if (Math.abs(this.distance) < this.scrollBarHeight)
                    this.distance -= this.itemHeight;
            } else {
                if (this.distance < 0) this.distance += this.itemHeight;
            }
            this.calculate();
        },
        calculate() {
            // 计算并写入数据
            const target = Math.abs(
                Math.round(this.distance / this.itemHeight)
            ); // 第几个 --> 下标
            this.activeIndex = target;
            this.$emit("update:value", this.options[target]);
            return target;
        },
        handlePc() {
            if (isPc()) {
                document.body.addEventListener(
                    "mousemove",
                    this.handleMouseMove
                );
                document.body.addEventListener("mouseup", this.bounce);
            }
        },
        unBound() {
            if (isPc()) {
                document.body.removeEventListener(
                    "mousemove",
                    this.handleMouseMove
                );
                document.body.removeEventListener("mouseup", this.bounce);
            }
        },
    },
};
</script>

<style lang="less">
.scroll_picker {
    width: 1.33rem;
    height: 1.93rem;
    background: #595972;
    border-radius: 0.18rem;
    overflow: hidden;
    .scroll_con {
        // width: 1.33rem;
        // height: 1.93rem;
        // background: #595972;
        // border-radius: 0.18rem;
        // overflow: hidden;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        user-select: none;
        li {
            width: 100%;
            height: 100%;
            flex-shrink: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 1.13rem;
            font-weight: 600;
            color: #8b8b9c;
            cursor: pointer;
            transition: color 0.2s;
        }
        .active {
            color: #ffffff;
        }
    }
}

// .scroll_bar {
//     &::-webkit-scrollbar {
//         // width: 0.05rem;
//         width: 0;
//     }
//     // &::-webkit-scrollbar-thumb {
//     //     background: rgba(0, 0, 0, 0.2);
//     // }
//     // &::-webkit-scrollbar-track {
//     //     box-shadow: inset 0 0 0.05rem rgba(0, 0, 0, 0.2);
//     //     border-radius: 0;
//     //     background: rgba(0, 0, 0, 0.1);
//     // }
// }
</style>