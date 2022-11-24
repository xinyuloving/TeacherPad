<template>
    <section class="item-shell">
        <header class="title">
            <img :src="require(`../../assets/img/cloudClassroom/classReport/${imgName}.png`)" />
            <span>{{ title }}</span>
        </header>
        <article class="content">
            <slot></slot>
        </article>
    </section>
</template>

<script>
export default {
    name: 'ItemShell',
    props: {
        imgName: {
            type: [String, Number],
            default: '1'
        },
        title: {
            type: String,
            required: true
        }
    }
}
</script>

<style lang="less" scoped>
.item-shell {
    width: 100%;
    height: 100%;
    border-radius: 0.16rem;
    background: #fff;
    display: flex;
    flex-direction: column;
    .title {
        height: 0.75rem;
        padding-left: 0.21rem;
        display: flex;
        align-items: center;
        border-bottom: 0.01rem solid #E8E8E8;
        font-weight: 500;
        font-size: 0.25rem;
        img {
            width: 0.33rem;
            margin-right: 0.13rem;
        }
    }
    .content {
        width: 100%;
        flex: 1;
    }
}
</style>