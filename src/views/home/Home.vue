<template>
    <div class="home">
        <Head />
        <div class="main">
            <router-view />
        </div>
    </div>
</template>

<script>

import Head from '@/components/head/Head.vue'

export default {
    name: 'Home',

    components: {
        Head
    }

}
</script>

<style lang="less" scoped>
.home {
    width: 100vw;
    height: 100vh;
    background-image: linear-gradient(to right top, #e5e5fe, #dff5ff);
    display: flex;
    flex-direction: column;
    color: #333;
    // .head {
    //     background-color: transparent;
    //     box-shadow: 0 0 0 0 transparent;
    // }
    .main {
        flex: 1;
    }
}
</style>