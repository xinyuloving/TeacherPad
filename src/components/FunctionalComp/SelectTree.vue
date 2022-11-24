<template>
    <div class="select-tree">
        <div class="select-item" v-for="item in treeData" :key="item.id">
            <div class="item-box" v-touch="() => { unfold(item) }" :style="{ background: folderId == item.id ? '#66b1ff2e' : '' }">
                <!-- <svg-icon iconClass="folder"/> -->
                <img src="~@/assets/img/home/homeTools/PrepareLessons/folder.png" />
                <div>{{ item.name }}</div>
                <div class="icon-box" v-if="item.children && item.children.length" :style="{ transform: item.isUnfold ? 'rotate(90deg)' : 'rotate(0deg)' }">
                    <i class="iconfont icon-right" ></i>
                </div>
            </div>
            <div class="children-box" v-if="item.children && item.children.length" v-show="item.isUnfold">
                <SelectTree :treeList="item.children" :folderId="folderId" @selectFolder="id => { $emit('selectFolder', id) }" />
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'SelectTree',

    props: {
        treeList: Array,
        folderId: [Number, String]
    },

    data() {
        return {
            treeData: [],
        }
    },

    watch: {
        treeList: {
            handler() {
                this.treeData.push(this.treeList[this.treeList.length - 1])
            }
        }
    },

    methods: {
        unfold(item) {
            item.isUnfold = !item.isUnfold;
            this.$emit('selectFolder', item.id)
        }
    },

    created() {
        this.treeList.forEach(item => {
            this.treeData.push({...item})
        })
    }
}
</script>

<style lang="less" scoped>
.select-tree {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    .select-item {
        .item-box {
            display: flex;
            align-items: center;
            font-size: 0.23rem;
            position: relative;
            line-height: 0.6rem;
        }
        img {
            width: 0.42rem;
            margin-right: 0.2rem;
            margin-left: 0.1rem;
        }
        .icon-box {
            position: absolute;
            right: 0;
            width: 0.6rem;
            height: 0.6rem;
            display: flex;
            justify-content: center;
            align-items: center;
            transition: all .3s;
            i {
                font-size: 0.23rem;
            }
        }
        .children-box {
            padding-left: 0.3rem;
        }
    }
}
</style>