<template>
    <el-select placeholder="请选择" v-model="channel_id">
      <el-option label="所有频道" value=""></el-option>
      <el-option v-for="item in channelList" :key="item.id" :label="item.name" :value="item.id"></el-option>
    </el-select>
</template>

<script>
export default {
    name: 'ttchannel',
    data() {
        return {
            channel_id: '',
            channelList: [],
        }
    },
    async created() {
        //发请求获取所有频道
        const res = await this.$axios.get('/mp/v1_0/channels')
        this.channelList = res.data.data.channels
    },
};
</script>

<style></style>
