<template>
    <div class="scholastic-head">
        <div class="scholastic-category">
            <div class="category-name">学科：</div>
            <div class="cheack-all" 
                v-touch="() => { $emit('update:subCode', '') }"
                :style="{background: subCode==='' ? '#3E83F8' : '', color: subCode==='' ? '#fff' : ''}"
            >全选</div>
            <div class="category-box">
                <span 
                    class="category-item" 
                    v-for="(item, index) in schoolSubjects" 
                    :key="index"
                    v-touch="() => { $emit('update:subCode', item.code) }"
                    :style="{background: subCode===item.code ? '#3E83F8' : '', color: subCode===item.code ? '#fff' : ''}"
                >{{ item.name }}</span>
            </div>
            <div class="seach-box">
                <input type="text" v-model="inputContent" @keyup.enter="$emit('search')"/>
                <TButton class="seach-but" v-touch="() => { $emit('search') }">
                    <!-- <svg-icon iconClass="seach" /> -->
                    <img src="~@/assets/img/home/homeTools/PrepareLessons/search.png" />
                </TButton>
            </div>
        </div>
        <div class="scholastic-category">
            <div class="category-name">年级：</div>
            <div class="cheack-all"
                v-touch="() => { $emit('update:gradeCode', '') }"
                :style="{background: gradeCode==='' ? '#3E83F8' : '', color: gradeCode==='' ? '#fff' : ''}"
            >全选</div>
            <div class="category-box">
                <span 
                    class="category-item" 
                    v-for="(item, index) in gradeAndClassOptions" 
                    :key="index"
                    v-touch="() => { $emit('update:gradeCode', item.value) }"
                    :style="{background: gradeCode===item.value ? '#3E83F8' : '', color: gradeCode===item.value ? '#fff' : ''}"
                >{{ item.label }}</span>
            </div>
        </div>
    </div>
</template>

<script>

import TButton from "@/components/FunctionalComp/TButton.vue"
import { mapState } from "vuex"

export default {
    name: 'ScholasticHead',

    components: {
        TButton
    },

    props: {
        subCode: String,
        gradeCode: String
    },

    data() {
        return {
            inputContent: ''
        }
    },

    computed: {
        ...mapState('teacher', ['gradeAndClassOptions', 'schoolSubjects'])
    },

    watch: {
        inputContent() {
            this.$emit('update:searchContent', this.inputContent)
        }
    },

    methods: {
        // 更改年级
        updateGrade(code) {
            if (code === this.gradeCode) {
                this.$emit('update:gradeCode', '')
            } else {
                this.$emit('update:gradeCode', code)
            }
        },
        // 更改学科
        updateSubject(code) {
            if (code === this.subCode) {
                this.$emit('update:subCode', '')
            } else {
                this.$emit('update:subCode', code)
            }
        },
    }
}
</script>

<style lang="less" scoped>
.scholastic-head {
    font-size: 0.23rem;
    line-height: 0.42rem;
    .scholastic-category {
        display: flex;
        margin-bottom: 0.1rem;
        .category-name {
            width: 0.7rem;
            white-space: nowrap
        }
        .category-box {
            display: flex;
            width: 9rem;
            flex-wrap: wrap;
            .category-item {
                padding: 0 0.2rem;
                margin-left: 0.1rem;
                border-radius: 0.05rem;
            }
        }
        .cheack-all {
            padding: 0 0.2rem;
            height: 0.4rem;
            border-radius: 0.05rem;
        }
        .seach-box {
            display: flex;
            align-items: center;
            flex: 1;
            justify-content: flex-end;
            input {
                height: 0.42rem;
                background-color: #F3F3F3;
                border-radius: 0.05rem 0 0 0.05rem;
                width: 4.19rem;
                padding-left: 0.1rem;
            }
            img {
                width: 0.63rem;
            }
            .seach-but {
                width: 0.63rem;
                height: 0.42rem;
            }
        }
    }
}
</style>