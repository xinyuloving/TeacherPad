<template>
    <div class="navigation" :style="{fontSize}">
        <span class="nav-item single_elli" v-for="(item, index) in list" :key="index" v-touch="() => { updateNav(index) }" :style="{color: index === 0 ? '#333' : '', fontSize: index === 0 ? '0.28rem' : ''}">
            <span v-if="index !== 0">&gt;</span>
            {{item.name}}
        </span>
    </div>
</template>

<script>
export default {
    name: 'Navigation',
    props: {
        list: {
            type: Array,
            required: true
        },
        fontSize: String
    },
    methods: {
        updateNav(index) {
            if (index === this.list.length - 1) return;
            this.$emit('updateNav', {to: this.list[index].whereTo, index})
        }
    },
    created() {
        console.log(this.list);
    }
}
</script>

<style lang="less" scoped>
.navigation {
    font-size: 0.25rem;
    color: #333;
    span:nth-last-child(1) {
        color: #c6c6c6;
    }
    .nav-item {
        display: inline-block;
        max-width: 2rem;
    }
}
</style>