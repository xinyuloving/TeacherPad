<template>
    <!-- <h1>教学反馈</h1> -->
    <div class="teaching-feeback">
        <ClassReportHeader />
        <main>
            <article class="left-box">
                <UseOfTools />
                <Interaction :flower="flower" :raiseHand="raiseHand" />
            </article>
            <article class="middle-box">
                <ActiveMap />
            </article>
            <article class="right-box">
                <Accuracy />
                <Ranking :list="ranking" />
                <Concerned :list="focusOn" />
            </article>
        </main>
    </div>
</template>
<script>
import TButton from "../../components/FunctionalComp/TButton.vue";
import ClassReportHeader from '@/components/classReport/classReportHeader.vue'
import UseOfTools from '@/components/classReport/useOfTools.vue'
import Interaction from '@/components/classReport/interaction.vue'
import ActiveMap from '@/components/classReport/activeMap.vue'
import Accuracy from '@/components/classReport/accuracy.vue'
import Ranking from '@/components/classReport/ranking.vue'
import Concerned from '@/components/classReport/concerned.vue'
import { mapState } from 'vuex'
export default {
    name: "TeachingFeedback",
    components: {
        TButton,
        ClassReportHeader,
        UseOfTools,
        Interaction,
        ActiveMap,
        Accuracy,
        Ranking,
        Concerned
    },
    data() {
        return {
            flower: {           // 小红花
                sum: 0,
                peopleNum: 0
            },
            raiseHand: {        // 举手
                sum: 0,
                peopleNum: 0
            },
            ranking: [],        // 排名
            focusOn: []         // 重点关注
        }
    },
    computed: {
        ...mapState('inCloudClassroom', ['studentList', 'correctRate'])
    },
    methods: {
        dataInit() {
            this.studentList.forEach(item => {
                const correct = item.questionNum ? (item.correctNum / item.questionNum).toFixed(2) : 0;
                this.flower.sum += item.flowers;
                this.raiseHand.sum += item.raiseHands;
                item.isFlower && this.flower.peopleNum++;
                item.isRaiseHand && this.raiseHand.peopleNum++;
                this.correctRate > correct && !item.interactiveNum && this.focusOn.push(item);
                correct && this.rankingInit(item.name, correct)
            })
        },
        rankingInit(studentName, correct) {
            let obj = {
                name: studentName,
                correct
            }
            for(let i = 0; i < this.ranking.length; i++) {
                if (obj.correct > this.ranking[i].correct) {
                    let newObj = obj;
                    obj = this.ranking[i];
                    this.ranking[i] = newObj
                }
            }
            this.ranking.push(obj);
            this.ranking.length > 10 && this.ranking.pop()
        }
    },
    created() {
        this.dataInit();
        this.data_batchUpload()
    }
};
</script>
<style lang="less" scoped>
.teaching-feeback {
    width: 100vw;
    height: 100vh;
    position: relative;
    background: #f0f5fd;
    display: flex;
    flex-direction: column;
    color: #333;
    main {
        flex: 1;
        width: 100%;
        padding: 0.33rem 0.38rem;
        display: flex;
        justify-content: space-between;
        article {
            height: 9.3rem;
        }
        .left-box {
            width: 4.52rem;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }
        .middle-box {
            width: 10.49rem;
        }
        .right-box {
            width: 3.91rem;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }
    }
}
</style>
