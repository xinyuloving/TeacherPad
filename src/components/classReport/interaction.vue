<template>
    <div class="interaction">
        <ItemShell :imgName="2" :title="'奖励与举手情况'">
            <article class="content">
                <section class="reward">
                    <div class="top">
                        <img src="../../assets/img/cloudClassroom/reward.png" />
                    </div>
                    <div class="middle">
                        <div class="left-box">
                            <div class="speed-of-progress" :style="{height: flower.sum ? null : '0px'}">
                                <strong>{{ flower.sum }}</strong>
                            </div>
                        </div>
                        <div class="right-box">
                            <div class="speed-of-progress" :style="{ height: (flower.sum ? (flower.peopleNum / flower.sum) * 100 : 0) + '%' }">
                                <strong>{{ flower.peopleNum }}</strong>
                            </div>
                        </div>
                    </div>
                    <div class="floor">
                        <div class="frequency">
                            <span class="color"></span>
                            <span class="text">累计小红花数</span>
                        </div>
                        <div class="number-of-people">
                            <span class="color"></span>
                            <span class="text">累计奖励人数</span>
                        </div>
                    </div>
                </section>
                <section class="raise-hands">
                    <div class="top">
                        <img src="../../assets/img/cloudClassroom/classReport/6.png" />
                    </div>
                    <div class="middle">
                        <div class="left-box">
                            <div class="speed-of-progress" :style="{height: raiseHand.sum ? null : '0px'}">
                                <strong>{{ raiseHand.sum }}</strong>
                            </div>
                        </div>
                        <div class="right-box">
                            <div class="speed-of-progress" :style="{ height: (raiseHand.sum ? (raiseHand.peopleNum / raiseHand.sum) * 100 : 0) + '%' }">
                                <strong>{{ raiseHand.peopleNum }}</strong>
                            </div>
                        </div>
                    </div>
                    <div class="floor">
                        <div class="frequency">
                            <span class="color"></span>
                            <span class="text">累计举手次数</span>
                        </div>
                        <div class="number-of-people">
                            <span class="color"></span>
                            <span class="text">累计举手人数</span>
                        </div>
                    </div>
                </section>
            </article>
        </ItemShell>
    </div>
</template>

<script>
import ItemShell from './itemShell.vue'
export default {
    name: 'Interaction',
    components: {
        ItemShell
    },
    props: {
        flower: Object,
        raiseHand: Object
    }
    // (flower.sum ? (flower.peopleNum / flower.sum) * 100 : 0)
    // (raiseHands.sum ? (raiseHands.peopleNum / raiseHands.sum) * 100 : 0)
}
</script>

<style lang="less" scoped>
.interaction {
    width: 100%;
    height: 4.32rem;
    .content {
        height: 100%;
        display: flex;
        .reward,
        .raise-hands {
            flex: 1;
            height: 100%;
            .top {
                text-align: center;
                padding-top: 0.4rem;
                margin-bottom: 0.1rem;
                img {
                    width: 0.37rem;
                }
            }
            .middle {
                display: flex;
                height: 1.6rem;
                margin-bottom: 0.2rem;
                justify-content: center;
                align-items: flex-end;
                .left-box,
                .right-box {
                    height: 1.3rem;
                    width: 0.6rem;
                    position: relative;
                    .speed-of-progress {
                        position: absolute;
                        bottom: 0;
                        width: 100%;
                        display: flex;
                        justify-content: center;
                        strong {
                            position: absolute;
                            top: -0.35rem;
                            font-size: 0.27rem;
                        }
                    }
                }
            }
            .floor {
                .frequency,
                .number-of-people {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    margin-bottom: 0.05rem;
                    .color {
                        width: 0.33rem;
                        height: 0.19rem;
                    }
                    .text {
                        font-size: 0.21rem;
                        margin-left: 0.1rem;
                    }
                }
                
            }
        }
        .reward {
            .middle {
                .left-box {
                    .speed-of-progress {
                        background: #FE7876;
                        height: 100%;
                    }
                }
                .right-box {
                    .speed-of-progress {
                        background: pink;
                    }
                }
            }
            .floor {
                .frequency {
                    .color {
                        background: #FE7876;
                    }
                }
                .number-of-people {
                    .color {
                        background: pink;
                    }
                }
            }
        }
        .raise-hands {
            .middle {
                .left-box {
                    .speed-of-progress {
                        background: #379DFE;
                        height: 100%;
                    }
                }
                .right-box {
                    .speed-of-progress {
                        background: #81dbff;
                    }
                }
            }
            .floor {
                .frequency {
                    .color {
                        background: #379DFE;
                    }
                }
                .number-of-people {
                    .color {
                        background: #81dbff;
                    }
                }
            }
        }
    }
}
</style>