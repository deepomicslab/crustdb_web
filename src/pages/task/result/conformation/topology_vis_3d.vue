<template>
    <div class="flex flex-row">
        <h1 class="text-3xl mt-5 ml-5 font-500 text-[#3262a8]">3D Vis</h1>
    </div>
    <div class="flex flex-row">
        <div class="h-150 w-160 mb-10 mt-5 p-5 ml-8" style="box-shadow: 0 0 64px #cfd5db">
            <div id="my3dEcharts" class="h-140" ref="echart3dDom"></div>
        </div>
    </div>
</template>

<script setup lang="ts">
// @ts-nocheck
/* eslint-disable camelcase */

import { ref, toRefs } from 'vue'
import * as echarts from 'echarts'
import 'echarts-gl'

const max_node_size = 20
const min_node_size = 7

let my3dEcharts: echarts.ECharts

const echart3dDom = ref<HTMLElement | null>(null)

const option_3d = ref({})

const props = defineProps<{
    graphSelectionStr: string
    nodesCoord_3d
    edgeList_3d
    // isMST: boolean
    colorby: string
    component_threshold: number
}>()
const {
    graphSelectionStr,
    nodesCoord_3d,
    edgeList_3d,
    // isMST,
    colorby,
    component_threshold,
} = toRefs(props)

const colormap = [
    '#313695',
    '#4575b4',
    '#74add1',
    '#abd9e9',
    '#fdae61',
    '#f46d43',
    '#d73027',
    '#a50026',
    '#6E1326',
]

const applythresholding2 = size => {
    return size >= component_threshold.value
}

const preprocess_3d_colorby_componentsize = () => {
    const seriesData = []

    const this_nodesCoord_3d = []
    const this_nodesCoord_3d_tmp = []
    const x_list = Array.from(new Set(nodesCoord_3d.value.x))
    const node_name_list = []

    x_list.forEach((element, idx) => {
        const tmp_instance = [
            element, // x
            nodesCoord_3d.value.y[idx], // y
            nodesCoord_3d.value.z[idx], // z
            parseInt(nodesCoord_3d.value.component_size[idx], 10), // index 3, used to filter out component
            nodesCoord_3d.value.node_name[idx], // node_name (i.e. gene name)
            nodesCoord_3d.value.page_rank_score[idx], // index 5
            nodesCoord_3d.value.component_id[idx], // index 6
        ]
        if (applythresholding2(parseInt(nodesCoord_3d.value.component_size[idx], 10))) {
            this_nodesCoord_3d.push(tmp_instance)
            node_name_list.push(nodesCoord_3d.value.node_name[idx])
        }
        this_nodesCoord_3d_tmp.push(tmp_instance)
    })
    const edge_index_list = Array.from(new Set(edgeList_3d.value))
    edge_index_list.forEach(element => {
        if (
            this_nodesCoord_3d_tmp[element[0]] &&
            node_name_list.includes(this_nodesCoord_3d_tmp[element[0]][4]) &&
            this_nodesCoord_3d_tmp[element[1]] &&
            node_name_list.includes(this_nodesCoord_3d_tmp[element[1]][4])
        ) {
            const this_line_data = [
                this_nodesCoord_3d_tmp[element[0]],
                this_nodesCoord_3d_tmp[element[1]],
            ]
            seriesData.push({
                data: this_line_data,
                type: 'line3D',
                lineStyle: {
                    width: 4,
                },
            })
        }
    })
    this_nodesCoord_3d_tmp.length = 0
    const arrayColumn = (arr, n) => arr.map(x => x[n])
    const array_col_3 = arrayColumn(this_nodesCoord_3d, 3) // color_by
    const min_color_by_value = Math.min.apply(null, array_col_3)
    const max_color_by_value = Math.max.apply(null, array_col_3)
    const array_col_5 = arrayColumn(this_nodesCoord_3d, 5) // node size <--- page rank score
    const min_page_rank_score = Math.min.apply(null, array_col_5)
    const max_page_rank_score = Math.max.apply(null, array_col_5)
    const resize_node_size = x => {
        return (
            ((x - min_page_rank_score) / (max_page_rank_score - min_page_rank_score)) *
                (max_node_size - min_node_size) +
            min_node_size
        )
    }
    seriesData.push({
        type: 'scatter3D',
        symbolSize(data) {
            return resize_node_size(data[5])
        },
        encode: {
            x: 'x',
            y: 'y',
            z: 'z',
            tooltip: [0, 1, 2, 3, 4],
        },
    })

    option_3d.value = {
        title: {
            text: graphSelectionStr.value,
        },
        tooltip: {
            show: true,
            formatter(param) {
                if (param.value) {
                    const str = `Gene Name ${param.value[4]} <br>- x: ${
                        Math.round(param.value[0] * 1e4) / 1e4
                    }<br>- y: ${Math.round(param.value[1] * 1e4) / 1e4}<br>- z: ${
                        Math.round(param.value[2] * 1e4) / 1e4
                    }<br>- page rank score: ${param.value[5]}<br>- component id ${param.value[6]}`
                    if (param.value[3] >= component_threshold.value) {
                        return `${str} <br>- component size: ${param.value[3]}`
                    }
                    return `${str} <br>- component size smaller than the threshold`
                }
                return ''
            },
        },
        visualMap: {
            dimension: 3, // page_rank_score
            min: min_color_by_value,
            max: max_color_by_value,
            inRange: {
                color: colormap,
            },
            precision: 0,
        },
        grid3D: {},
        xAxis3D: {},
        yAxis3D: {},
        zAxis3D: {},
        series: seriesData,
        dataset: {
            dimensions: ['x', 'y', 'z', 'node_name', 'color_by'],
            source: this_nodesCoord_3d,
        },
    }
}

const preprocess_3d_colorby_pagerankscore = () => {
    const this_nodesCoord_3d = []
    const x_list = Array.from(new Set(nodesCoord_3d.value.x))
    x_list.forEach((element, idx) => {
        this_nodesCoord_3d.push([
            element, // x
            nodesCoord_3d.value.y[idx], // y
            nodesCoord_3d.value.z[idx], // z
            parseFloat(nodesCoord_3d.value.page_rank_score[idx]), // index 3, used to filter out component
            nodesCoord_3d.value.node_name[idx], // node_name (i.e. gene name)
            nodesCoord_3d.value.page_rank_score[idx], // index 5
        ])
    })
    const arrayColumn = (arr, n) => arr.map(x => x[n])
    const array_col_3 = arrayColumn(this_nodesCoord_3d, 3) // color_by
    const min_color_by_value = Math.min.apply(null, array_col_3)
    const max_color_by_value = Math.max.apply(null, array_col_3)
    const seriesData = [
        {
            type: 'scatter3D',
            symbolSize: 12,
            encode: {
                x: 'x',
                y: 'y',
                z: 'z',
                tooltip: [0, 1, 2, 3, 4],
            },
        },
    ]
    const edge_index_list = Array.from(new Set(edgeList_3d.value))
    edge_index_list.forEach(element => {
        const this_line_data = [this_nodesCoord_3d[element[0]], this_nodesCoord_3d[element[1]]]
        seriesData.push({
            data: this_line_data,
            type: 'line3D',
            lineStyle: {
                color: '#5470C6',
                width: 4,
            },
        })
    })

    option_3d.value = {
        title: {
            text: graphSelectionStr.value,
        },
        tooltip: {
            show: true,
            formatter(param) {
                if (param.value) {
                    const str = `Gene Name ${param.value[4]} <br>- x: ${
                        Math.round(param.value[0] * 1e4) / 1e4
                    }<br>- y: ${Math.round(param.value[1] * 1e4) / 1e4}<br>- z: ${
                        Math.round(param.value[2] * 1e4) / 1e4
                    }<br>- page rank score: ${param.value[5]}`
                    return `${str}`
                }
                return ''
            },
        },
        visualMap: {
            dimension: 3, // page_rank_score
            min: min_color_by_value,
            max: max_color_by_value,
            inRange: {
                color: colormap,
            },
            precision: 4,
        },
        grid3D: {},
        xAxis3D: {},
        yAxis3D: {},
        zAxis3D: {},
        series: seriesData,
        dataset: {
            dimensions: ['x', 'y', 'z', 'node_name', 'color_by'],
            source: this_nodesCoord_3d,
        },
    }
}

// 默认的 type 不是 MST，选择 MST 之后，checkMST() 会将 colorby 设置成 pagerankscore，colorby dialog 被隐藏；
// 直至选择其他 graph type 之后，colorby dialog 出现，允许做其他 colorby 选择
const preprocess_3d = () => {
    if (colorby.value === 'componentsize') {
        preprocess_3d_colorby_componentsize()
    } else if (colorby.value === 'pagerankscore') {
        preprocess_3d_colorby_pagerankscore()
    }
}

const chart3dOption = () => {
    my3dEcharts.clear()
    my3dEcharts.setOption(option_3d.value)
}

onMounted(async () => {
    my3dEcharts = echarts.init(echart3dDom.value as HTMLElement)
})

watch(nodesCoord_3d, () => {
    preprocess_3d()
    chart3dOption()
})
watch(colorby, () => {
    preprocess_3d()
    chart3dOption()
})
watch(component_threshold, () => {
    preprocess_3d()
    chart3dOption()
})
</script>
