<template>
    <el-select placeholder="请选择" :value="channel_id" @change="toFather($event)">
    <!-- <el-select placeholder="请选择" v-model="channel_id" @change="$emit('xxoo',channel_id)"> -->
      <el-option label="所有频道" value=""></el-option>
      <el-option v-for="item in channelList" :key="item.id" :label="item.name" :value="item.id"></el-option>
    </el-select>
</template>

<script>
export default {
    name: 'ttchannel',
    props:['channel_id'],
    model:{
        prop:'channel_id',
        event:'xxoo'
    },
    data() {
        return {
            channelList: [],
        }
    },
    async created() {
        //发请求获取所有频道
        const res = await this.$axios.get('/mp/v1_0/channels')
        this.channelList = res.data.data.channels
    },
    methods:{
        toFather(e) {
            this.$emit('xxoo',e)
        }
    }
};
</script>

<style></style>
