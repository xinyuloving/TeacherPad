<template>
    <div class="concerned">
        <ItemShell :imgName="5" :title="'建议重点关注学生'">
            <ul v-if="list.length">
                <li v-for="(item, index) in list" :key="index">
                    <span class="top">{{ item.name.slice(0, 1) }}</span>
                    <span class="bottom">{{ item.name }}</span>
                </li>
            </ul>
            <DefalutPage v-else :textContent="'暂无内容'" :imgConfig="{ width: '1.8rem' }"/>
        </ItemShell>
    </div>
</template>

<script>
import ItemShell from './itemShell.vue'
import DefalutPage from '../FunctionalComp/DefalutPage.vue'
export default {
    name: 'Concerned',
    components: {
        ItemShell,
        DefalutPage
    },
    props: {
        list: Array
    }
}
</script>

<style lang="less" scoped>
.concerned {
    width: 100%;
    height: 3.2rem;
    ul {
        padding: 0.4rem 0.67rem 0;
        height: 2.4rem;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        overflow-y: auto;
        li {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-bottom: 0.25rem;
            .top {
                width: 0.69rem;
                height: 0.69rem;
                border-radius: 50%;
                background: #3E83F8;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 0.35rem;
                font-weight: 500;
                color: #fff;
                margin-bottom: 0.06rem;
            }
            .bottom {
                font-size: 0.19rem;
            }
        }
    }
}
</style>