<template>
    <div class="t-list">
        <div class="list-con">
            <template v-if="showData.length">
                <ListItem
                    :checkedValue="checkedValue"
                    v-for="item in showData"
                    :key="item[mapProps.value]"
                    :itemData="item"
                    @itemTouch="itemTouch"
                    :props="mapProps"
                    :disabled="disabled"
                />
            </template>
            <DefalutPage
                v-if="!showData.length || isNetworkBad"
                :textContent="
                    isNetworkBad ? '您的网络飞走了' : '暂时还没有内容'
                "
                :imgName="isNetworkBad ? 'not_network' : 'not_content'"
                @refresh="loadData"
            />
        </div>
        <Loading v-if="isLoading" :modal="false" contentText="加载中..." />
        <!-- v-show 会有问题 -->
    </div>
</template>

<script>
// 使用该组件必须传进来一个 folderName 且用 sync 修饰，通过它来控制文件夹跳转
import { recursive } from "@/utils/util";
import ListItem from "./ListItem.vue";
import DefalutPage from "../DefalutPage.vue";
import Loading from "../Loading.vue";
const props = () => ({
    value: "id", // 每一项的唯一标识
    label: "name",
    lazy: false,
    lazyLoad() {},
    isSelectedValue: true, // 选中的数组中，是否只存放选中项的value字段的值，默认是true，false的话将会把整项存到 selectedValue 中
});
export default {
    components: {
        ListItem,
        DefalutPage,
        Loading,
    },
    props: {
        listData: {
            type: Array,
            default: () => [],
        },
        props: {
            type: Object,
            default: props,
        },
        multiple: Boolean,
        disabled: {
            type: Array,
            default: () => [],
            // 禁用，Array 中存放需要禁用的对象或某些字段，它会受 isSelectedValue 和 value 影响，如果isSelectedValue 为 false 的话，该数组中必须要存放一些以value为唯一字段的对象，为true的话需要存放一些以value为唯一字段的值
        },
    },
    data() {
        return {
            checkedValue: [], // 存放文件 指定 value 的 标识符组成的数组
            showData: [], // 展示的数据
            isLoading: false,
            isNetworkBad: false, // 没有网络
        };
    },
    computed: {
        mapProps() {
            // return Object.assign(props(), this.props);
            return { ...props(), ...this.props };
        },
    },
    watch: {
        "listData.length": {
            handler() {
                if (!this.mapProps.lazy) {
                    this.showData = this.listData;
                }
            },
            immediate: true,
        },
        "$attrs.levelList.length": {
            handler(newValue) {
                if (this.mapProps.lazy) {
                    this.loadData();
                } else {
                    if (newValue) {
                        const t = recursive(
                            this.listData,
                            JSON.parse(JSON.stringify(this.$attrs.levelList)),
                            this.mapProps.value
                        );
                        this.showData = t.children;
                    } else {
                        this.$emit("update:levelList", []);
                        this.showData = this.listData;
                    }
                }
            },
            immediate: true,
        },
    },
    methods: {
        itemTouch(item) {
            const { isSelectedValue, value } = this.mapProps;
            if (!item.type) {
                // 点击的是 文件夹
                // if (this.mapProps.lazy) {
                //     // this.loadData();
                // } else {
                //     const list = JSON.parse(
                //         JSON.stringify(this.$attrs.levelList)
                //     );
                //     list.push(item[this.mapProps.value]);
                //     this.$emit("update:levelList", list);
                // }
                const list = JSON.parse(JSON.stringify(this.$attrs.levelList));
                list.push(item[value]);
                this.$emit("update:levelList", list);
            } else {
                // 点击的是 文件
                if (!this.multiple) {
                    // 单选
                    if (isSelectedValue) {
                        if (this.checkedValue[0] !== item[value])
                            this.$set(this.checkedValue, 0, item[value]);
                    } else {
                        if (
                            !this.checkedValue[0] ||
                            this.checkedValue[0][value] !== item[value]
                        )
                            this.$set(this.checkedValue, 0, item);
                    }
                } else {
                    // 多选
                    let index = -1;
                    if (isSelectedValue) {
                        index = this.checkedValue.lastIndexOf(item[value]);
                    } else {
                        index = this.checkedValue.findIndex(
                            (ele) => ele[value] == item[value]
                        );
                    }
                    if (index === -1) {
                        this.checkedValue.push(
                            isSelectedValue ? item[value] : item
                        );
                    } else {
                        this.checkedValue.splice(index, 1);
                    }
                }
                this.$emit("update:selectedValue", this.checkedValue);
            }
            this.$emit("itemTouch", item);
        },
        async loadData() {
            this.isLoading = true;
            try {
                this.showData = await this.mapProps.lazyLoad();
                if (this.isNetworkBad) this.isNetworkBad = false;
            } catch (error) {
                this.isNetworkBad = true;
            } finally {
                this.isLoading = false;
            }
        },
    },
};
</script>

<style lang="less" scoped>
.t-list {
    width: 100%;
    height: 100%;
    overflow: scroll;
    position: relative;
    .list-con {
        width: 100%;
        padding: 0.1rem 0.3rem;
        height: 100%;
        display: flex;
        flex-wrap: wrap;
        align-content: flex-start;
    }
}
</style>