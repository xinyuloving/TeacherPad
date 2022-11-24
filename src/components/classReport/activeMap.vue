<template>
    <div class="active-map">
        <ItemShell :imgName="3" :title="'课堂活跃热力图'">
            <article>
                <section class="map-box">
                    <SeatingPlan :type="0" :row="classroomInfo.row" :column="classroomInfo.column"/>
                </section>
                <section class="floor">
                    <div class="state" v-for="item in 3" :key="item">
                        <img :src="require(`../../assets/img/cloudClassroom/classReport/state_${item}.png`)" />
                        <div class="right">
                            <span>{{ item | textFilter }}</span>
                            <span class="color" :style="{ background: item === 1 ? '#FB6868' : (item === 2) ? '#FFAB5E' : '#FFE083' }"></span>
                        </div>
                    </div>
                </section>
            </article>
        </ItemShell>
    </div>
</template>

<script>
import ItemShell from './itemShell.vue'
import SeatingPlan from '../home/SeatingPlan.vue'
import { mapState } from 'vuex'
export default {
    name: 'ActiveMap',
    components: {
        ItemShell,
        SeatingPlan
    },
    filters: {
        textFilter(val) {
            return val === 1 ? '表现优异' : (val === 2 ? '表现普通' : '还需努力')
        }
    },
    computed: {
        ...mapState('inCloudClassroom', ['classroomInfo'])
    }
}
</script>

<style lang="less" scoped>
.active-map {
    width: 100%;
    height: 100%;
    article {
        height: 100%;
        .map-box {
            height: 7.2rem;
        }
        .floor {
            margin-top: 0.3rem;
            padding: 0 1.7rem;
            display: flex;
            justify-content: space-between;
            .state {
                display: flex;
                img {
                    width: 0.46rem;
                }
                .right {
                    display: flex;
                    flex-direction: column;
                    font-size: 0.19rem;
                    justify-content: space-between;
                    margin-left: 0.13rem;
                    .color {
                        width: 0.31rem;
                        height: 0.17rem;
                    }
                }
            }
        }
    }
}
</style>