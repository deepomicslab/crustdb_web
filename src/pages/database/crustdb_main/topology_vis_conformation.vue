<template>
    <div class="w-180 h-120 text-xl mt-0" ref="echartlineDom"></div>
</template>

<script setup lang="ts">
// @ts-nocheck
/* eslint-disable camelcase */

import { ref } from 'vue'
import * as echarts from 'echarts'
import _ from 'lodash'

const props = defineProps<{
    detailsdata
}>()
const { detailsdata } = toRefs(props)

let mylineEcharts

const echartlineDom = ref<HTMLElement | null>(null)

const chartOption = () => {
    mylineEcharts.clear()
    mylineEcharts.setOption({
        title: {
            text: `Convergence of Cytocraft Conformation\n${detailsdata.value.repeat_data_uid}`,
            left: 'center',
        },
        tooltip: {},
        toolbox: {
            itemSize: 20,
            iconStyle: {
                borderColor: '#34498e',
            },
            feature: {
                dataView: { readOnly: true },
                saveAsImage: {},
            },
        },
        xAxis: {
            name: 'Iteration',
            nameLocation: 'middle',
            nameGap: 30,
            scale: true,
            data: _.range(detailsdata.value.distance_list.length),
            axisLabel: {
                rotate: 0,
                fontSize: 13,
            },
        },
        yAxis: {
            name: 'cvRMSD',
            nameLocation: 'middle',
            nameGap: 30,
            scale: true,
            type: 'value',
        },
        series: [
            {
                name: 'Iteration number',
                type: 'line',
                data: detailsdata.value.distance_list,
            },
        ],
    })
}
onMounted(async () => {
    mylineEcharts = echarts.init(echartlineDom.value as HTMLElement)
})

watch(detailsdata, () => {
    chartOption()
})
</script>
