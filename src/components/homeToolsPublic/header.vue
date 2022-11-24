<template>
    <div class="header">
        <!-- 按钮 -->
        <div class="button-box">
            <TButton 
                :class="index === 0 ? 't-but' : 't-but1'" 
                @touch="() => { $emit('onButton', item.content) }" 
                v-for="(item, index) in buttonList" 
                :key="index"
            >
                <i :class="['iconfont', item.icon]" v-if="item.icon"></i>
                <span>{{ item.content }}</span>
            </TButton>
        </div>
        <!-- 搜索框 -->
        <div class="search-box">
            <input type="text" v-model="searchValue" @keyup.enter="$emit('search', searchValue)">
            <TButton class="img-but" v-touch="() => { $emit('search', searchValue) }">
                <img src="@/assets/img/home/homeTools/PrepareLessons/search.png" />
            </TButton>
        </div>
    </div>
</template>

<script>

import TButton from "@/components/FunctionalComp/TButton.vue"

export default {
    name: 'Header',

    components: { 
        TButton
    },

    props: {
        buttonList: Array
    },

    data() {
        return {
            searchValue: ''
        }
    }
}
</script>

<style lang="less" scoped>
.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .button-box {
        display: flex;
        .t-but,
        .t-but1 {
            width: auto;
            padding: 0 0.3rem;
            height: 0.42rem;
            margin-right: 0.2rem;
        }
        .t-but1 {
            background-color: #fff;
            border: 1px solid #979797;
            color: #333;
            font-size: 0.23rem;
        }
    }
    .search-box {
        display: flex;
        input {
            width: 4.2rem;
            height: 0.42rem;
            background-color: #F3F3F3;
            padding-left: 10px;
            font-size: 0.25rem;
            border-radius: 0.05rem 0 0 0.05rem;
        }
        .img-but {
            width: 0.63rem;
            height: 0.42rem;
            img {
                width: 100%;
                height: 100%;
            }
        }
    }
    .iconfont {
        font-size: 0.21rem;
        margin-right: 0.05rem;
    }
}
</style>