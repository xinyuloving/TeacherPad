<template>
    <div class="t-tree" :class="[scale ? '' : 'scale']">
        <!-- 弃用 -->
        <ul class="tree-wrapper">
            <!-- 包裹层-->
            <li
                :class="['tree-item']"
                v-for="(item, index) in data"
                :key="index"
                v-touch.stop="
                    () => {
                        handleTouch(item);
                    }
                "
            >
                <!-- 遍历-->
                <div class="item-content">
                    <div class="left">
                        <img
                            :src="
                                require(`../../assets/img/home/homeTools/PrepareLessons/${item.icon}.png`)
                            "
                            alt=""
                            :style="{
                                width:
                                    item.icon === 'folder'
                                        ? '0.42rem'
                                        : '0.4rem',
                                height:
                                    item.icon === 'folder'
                                        ? '0.4rem'
                                        : '0.38rem',
                            }"
                        />
                        <span class="item-text">{{ item.label }}</span>
                    </div>
                    <!-- 展开图标-->
                    <div class="right">
                        <i
                            v-if="!item.size"
                            :class="['iconfont', 'icon-ico-down-arrow']"
                        ></i>
                    </div>
                </div>
                <Tree
                    v-show="item.children"
                    :treeData="item.children"
                    :scale="item.expanded"
                ></Tree>
                <!-- 遍历children-->
            </li>
        </ul>
    </div>
</template>

<script>
import { mapMutations } from "vuex";
export default {
    name: "Tree",
    props: {
        treeData: {
            type: Array,
            default: () => {
                return [];
            },
        },
        scale: Boolean,
    },
    data() {
        return {
            data: [],
        };
    },
    created() {
        this.data = this.repaintData();
    },
    methods: {
        ...mapMutations({
        }),
        repaintData() {
            const copyData = JSON.parse(JSON.stringify(this.treeData));
            for (let i = 0; i < copyData.length; i++) {
                const e = copyData[i];
                if (e.children) {
                    e.expanded = false;
                }
            }
            return copyData;
        },
        handleTouch(item) {
            if (item.children) {
                item.expanded = !item.expanded;
            } else {
            }
        },
    },
};
</script>

<style lang="less">
.t-tree {
    width: 100%;
    height: 100%;
    overflow: scroll;
    transition: all 0.3s linear;
    transform-origin: center top;
    .tree-wrapper {
        height: 100%;
        width: 100%;
        .tree-item {
            width: 100%;
            // background: #e8e8e8;
            padding-left: 0.5rem;
            cursor: pointer;
            .item-content {
                height: 0.86rem;
                transition: all 0.3s linear;
                display: flex;
                align-items: center;
                justify-content: space-between;
                transform-origin: center top;
                .left {
                    display: flex;
                    align-items: center;
                    img {
                        margin-right: 0.25rem;
                    }
                    .item-text {
                        font-size: 0.23rem;
                        font-weight: 400;
                        color: #333333;
                    }
                }
                .right {
                    margin-right: 0.27rem;
                    .iconfont {
                        font-size: 0.23rem;
                        color: #434343;
                        transition: all 0.3s linear;
                        transform-origin: center center;
                    }
                    .rotate {
                        transform: rotateY(90deg);
                    }
                }
            }
            .scale {
                transform: scaleY(0);
                opacity: 0;
                .tree-item {
                    .item-content {
                        height: 0;
                        opacity: 0;
                    }
                }
            }
        }
        .single-style {
            background: #e8e8e8;
        }
    }
}
</style>