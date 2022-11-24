<template>
    <div class="ranking">
        <ItemShell :imgName="4" :title="'答题正确率前十名'">
            <ul v-if="list.length">
                <li v-for="(item, index) in list" :key="index">{{ item.name }}</li>
            </ul>
            <DefalutPage v-else :textContent="'暂无内容'" :imgConfig="{ width: '1.8rem' }"/>
        </ItemShell>
    </div>
</template>

<script>
import ItemShell from './itemShell.vue'
import DefalutPage from '../FunctionalComp/DefalutPage.vue'
export default {
    name: 'Ranking',
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
.ranking {
    width: 100%;
    height: 3.26rem;
    ul {
        padding-top: 0.4rem;
        overflow-y: auto;
        height: 2.4rem;
        li {
            text-align: center;
            font-size: 0.23rem;
            margin-bottom: 0.2rem;
        }
    }
}
</style>