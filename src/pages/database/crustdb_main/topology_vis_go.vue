<template>
    <div class="flex flex-row">
        <h1 class="text-3xl mt-5 ml-5 font-500 text-[#3262a8]">GO Vis</h1>
    </div>
    <div class="flex flex-row">
        <div class="h-150 w-335 mb-10 mt-5 p-5 ml-8" style="box-shadow: 0 0 64px #cfd5db">
            <div id="my2dEcharts" class="h-140" ref="echart2dDom"></div>
        </div>
    </div>
</template>

<script setup lang="ts">
// @ts-nocheck
/* eslint-disable camelcase */
import { ref, toRefs, toRaw } from 'vue'
import * as echarts from 'echarts'
import 'echarts-gl'

const max_node_size = 20
const min_node_size = 7

let my2dEcharts: echarts.ECharts
const echart2dDom = ref<HTMLElement | null>(null)
const option_2d = ref({})

const props = defineProps<{
    graphSelectionStr
    repeat_data_uid: String
    go_info
    topoid
}>()

const { graphSelectionStr, repeat_data_uid, go_info, topoid } = toRefs(props)

const preprocess_2d = () => {
    const this_go_info = toRaw(go_info.value)
    const { Gene_set, Term, p_inv, Hits_ratio } = this_go_info
    const Gene_set_uniq = Array.from(new Set(Gene_set))

    // 在首位加空值，是为了在 scatter plot 左右留出空位，更好看一点
    Gene_set_uniq.splice(0, 0, '') // .splice(idx, 0, element)
    Gene_set_uniq.push('')

    const data = []
    p_inv.forEach((element, idx) => {
        data.push([Gene_set[idx], Term[idx], Hits_ratio[idx], element])
    })

    const min_color_by_value = Math.min.apply(null, p_inv)
    const max_color_by_value = Math.max.apply(null, p_inv)

    const min_hits_ratio = Math.min.apply(null, Hits_ratio)
    const max_hits_ratio = Math.max.apply(null, Hits_ratio)
    const resize_node_size = x => {
        return (
            ((x - min_hits_ratio) / (max_hits_ratio - min_hits_ratio)) *
                (max_node_size - min_node_size) +
            min_node_size
        )
    }

    option_2d.value = {
        title: {
            text: `${repeat_data_uid.value}\n${graphSelectionStr.value}`,
            left: 'center',
        },
        tooltip: {
            show: true,
            trigger: 'item',
            triggerOn: 'mousemove',
            position: 'top',
            formatter(params) {
                return `${params.value[0]} <br/>- % Genes in Set : ${params.value[2]} <br/>- -log10 (Adjusted P-value): ${params.value[3]}`
            },
            axisPointer: {
                type: 'cross',
            },
        },
        toolbox: {
            feature: {
                dataView: { readOnly: true },
                saveAsImage: {},
            },
        },
        grid: {
            left: 60,
            bottom: 0,
            right: 70,
            containLabel: true,
        },
        xAxis: {
            type: 'category',
            data: Gene_set_uniq,
            splitLine: {
                lineStyle: {
                    type: 'dashed',
                },
                show: true,
            },
            boundaryGap: false,
            axisLabel: { interval: 0, rotate: 30 },
        },
        yAxis: {
            type: 'category',
            data: Term,
            splitLine: {
                lineStyle: {
                    type: 'dashed',
                },
                show: true,
            },
            boundaryGap: false,
        },
        visualMap: {
            dimension: 3,
            min: min_color_by_value,
            max: max_color_by_value,
            orient: 'vertical',
            right: 0,
            bottom: 70,
            text: ['-log10\n(Adjusted\nP-value)', ''],
            calculable: true,
            inRange: {
                color: ['#fde725', '#5ec962', '#21918c', '#3b528b', '#440154'],
            },
            precision: 4,
        },
        series: [
            {
                type: 'scatter',
                symbolSize(val) {
                    return resize_node_size(val[2]) // index 2: Hits_ratio
                },
                data,
                expandAndCollapse: false,
                animationDuration: 550,
                animationDurationUpdate: 750,
                roam: true, // 图可以在页面整体放缩
            },
        ],
    }
}

const chart2dOption = () => {
    my2dEcharts.clear()
    my2dEcharts.setOption(option_2d.value)
}

onMounted(async () => {
    my2dEcharts = echarts.init(echart2dDom.value as HTMLElement)
})

watch(go_info, async () => {
    preprocess_2d()
    setTimeout(chart2dOption, 1000)
})
watch(topoid, async () => {
    preprocess_2d()
    setTimeout(chart2dOption, 1000)
})
</script>
