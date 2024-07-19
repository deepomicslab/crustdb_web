<template>
    <div class="flex flex-row">
        <h1 class="text-3xl mt-5 ml-5 font-500 text-[#3262a8]">2D Vis</h1>
    </div>
    <div class="flex flex-row">
        <div class="h-150 w-160 mb-10 mt-5 p-5 ml-8" style="box-shadow: 0 0 64px #cfd5db">
            <div id="my2dEcharts" class="h-140" ref="echart2dDom"></div>
        </div>
    </div>
</template>

<script setup lang="ts">
// @ts-nocheck
/* eslint-disable camelcase */
import { ref, isProxy, toRaw, toRefs } from 'vue'
import * as echarts from 'echarts'
import 'echarts-gl'

const max_node_size = 20
const min_node_size = 7

let my2dEcharts: echarts.ECharts

const echart2dDom = ref<HTMLElement | null>(null)

const option_2d = ref({})

const props = defineProps<{
    graphSelectionStr: string
    nodesCoord_3d
    edgeList_3d
    mst_parentchild_relation
    isMST: boolean
    colorby: string
    component_threshold: number
}>()

const {
    graphSelectionStr,
    nodesCoord_3d,
    edgeList_3d,
    mst_parentchild_relation,
    isMST,
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

const preprocess_2d_mst = () => {
    const this_nodesCoord_3d = []
    const x_list = Array.from(new Set(nodesCoord_3d.value.x))
    x_list.forEach((element, idx) => {
        this_nodesCoord_3d.push([
            element, // x
            nodesCoord_3d.value.y[idx], // y
            nodesCoord_3d.value.z[idx], // z
            parseFloat(nodesCoord_3d.value.page_rank_score[idx]), // page_rank_score
            nodesCoord_3d.value.node_name[idx], // node_name (i.e. gene name)
        ])
    })
    const arrayColumn = (arr, n) => arr.map(x => x[n])
    const array_col_3 = arrayColumn(this_nodesCoord_3d, 3) // page_rank_score    const min_color_by_value = Math.min.apply(null, array_col_3)
    const min_color_by_value = Math.min.apply(null, array_col_3)
    const max_color_by_value = Math.max.apply(null, array_col_3)
    let this_mst_parentchild_relation = mst_parentchild_relation.value
    if (isProxy(mst_parentchild_relation.value)) {
        this_mst_parentchild_relation = toRaw(mst_parentchild_relation.value)
    }
    option_2d.value = {
        title: {
            text: graphSelectionStr.value,
        },
        tooltip: {
            show: true,
            trigger: 'item',
            triggerOn: 'mousemove',
            formatter(param) {
                return param.name
            },
        },
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
        visualMap: {
            type: 'continuous',
            min: min_color_by_value,
            max: max_color_by_value,
            inRange: {
                color: colormap,
            },
            precision: 4,
        },
        series: [
            {
                type: 'tree',
                data: [this_mst_parentchild_relation],
                symbol: 'circle',
                fontSize: 10,
                labelLayout: {
                    hideOverlap: true,
                },
                symbolSize: 9,
                label: {
                    position: 'left',
                    verticalAlign: 'middle',
                    align: 'right',
                    fontSize: 9,
                },
                leaves: {
                    label: {
                        position: 'right',
                        verticalAlign: 'middle',
                        align: 'left',
                    },
                },
                emphasis: {
                    focus: 'descendant',
                },
                expandAndCollapse: false,
                animationDuration: 550,
                animationDurationUpdate: 750,
                roam: true, // 图可以在页面整体放缩
            },
        ],
        lineStyle: {
            color: '#2f4554',
            width: 4,
        },
    }
}

const preprocess_2d_colorby_componentsize = () => {
    const page_rank_score_list = []
    Array.from(new Set(nodesCoord_3d.value.page_rank_score)).forEach(element => {
        page_rank_score_list.push(parseFloat(element))
    })
    const min_page_rank_score = Math.min.apply(null, page_rank_score_list)
    const max_page_rank_score = Math.max.apply(null, page_rank_score_list)
    const resize_node_size = x => {
        return (
            ((x - min_page_rank_score) / (max_page_rank_score - min_page_rank_score)) *
                (max_node_size - min_node_size) +
            min_node_size
        )
    }
    const this_2d_nodes = []
    const nodename_list = Array.from(new Set(nodesCoord_3d.value.node_name))
    const idx_map = new Map()
    nodename_list.forEach((element, idx) => {
        const tmp_instance = {
            name: element, // node_name (i.e. gene name)
            id: idx,
            value: nodesCoord_3d.value.component_size[idx],
            symbolSize: resize_node_size(parseFloat(nodesCoord_3d.value.page_rank_score[idx])),
            page_rank_score: nodesCoord_3d.value.page_rank_score[idx],
            component_id: nodesCoord_3d.value.component_id[idx],
        }
        if (applythresholding2(parseInt(nodesCoord_3d.value.component_size[idx], 10))) {
            this_2d_nodes.push(tmp_instance)
            idx_map.set(idx, this_2d_nodes.length - 1)
        }
    })

    const this_2d_edges = []
    const edge_index_list = toRaw(edgeList_3d.value)
    edge_index_list.forEach(element => {
        if (idx_map.get(element[0]) !== undefined && idx_map.get(element[1]) !== undefined) {
            this_2d_edges.push({
                source: idx_map.get(element[0]),
                target: idx_map.get(element[1]),
            })
        }
    })

    const arrayColumnValue = arr => arr.map(x => x.value)
    const array_col_2 = arrayColumnValue(this_2d_nodes)
    const min_color_by_value = Math.min.apply(null, array_col_2)
    const max_color_by_value = Math.max.apply(null, array_col_2)

    option_2d.value = {
        title: {
            text: graphSelectionStr.value,
        },
        tooltip: {
            show: true,
            trigger: 'item',
            triggerOn: 'mousemove',
            formatter(param) {
                if (param.value) {
                    const str = `Gene Name ${param.name} <br>- page rank score: ${param.data.page_rank_score} <br>- component id: ${param.data.component_id} <br>- component size`
                    if (param.value >= component_threshold.value) {
                        return `${str}: ${param.value}`
                    }
                    return `${str} <br>- component size smaller than the threshold`
                }
                return ''
            },
        },
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
        visualMap: {
            type: 'continuous',
            min: min_color_by_value,
            max: max_color_by_value,
            inRange: {
                color: colormap,
            },
            precision: 0,
        },
        series: [
            {
                type: 'graph',
                layout: 'force',
                label: {
                    position: 'right',
                    formatter: '{b}',
                },
                draggable: true,
                force: {
                    edgeLength: 10,
                    repulsion: 50,
                    gravity: 0.3,
                },
                data: this_2d_nodes,
                edges: this_2d_edges,
                lineStyle: {
                    color: '#5470C6',
                    width: 2,
                },
                roam: true, // 图可以在页面整体放缩
            },
        ],
    }
}

const preprocess_2d_colorby_pagerankscore = () => {
    const this_2d_edges = []
    const edge_index_list = Array.from(new Set(edgeList_3d.value))
    edge_index_list.forEach(element => {
        this_2d_edges.push({
            source: element[0],
            target: element[1],
        })
    })
    const this_2d_nodes = []
    const nodename_list = Array.from(new Set(nodesCoord_3d.value.node_name))
    nodename_list.forEach((element, idx) => {
        this_2d_nodes.push({
            name: element, // node_name (i.e. gene name)
            id: idx,
            value: parseFloat(nodesCoord_3d.value.page_rank_score[idx]),
            symbolSize: 12,
        })
    })
    const arrayColumnValue = arr => arr.map(x => x.value)
    const array_col_2 = arrayColumnValue(this_2d_nodes) // page_rank_score    const min_color_by_value = Math.min.apply(null, array_col_3)
    const min_color_by_value = Math.min.apply(null, array_col_2)
    const max_color_by_value = Math.max.apply(null, array_col_2)

    option_2d.value = {
        title: {
            text: graphSelectionStr.value,
        },
        tooltip: {
            show: true,
            trigger: 'item',
            triggerOn: 'mousemove',
            formatter(param) {
                if (param.value) {
                    const str = `Gene Name ${param.name} <br>- page rank score:`
                    return `${str} ${param.value}`
                }
                return ''
            },
        },
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
        visualMap: {
            type: 'continuous',
            min: min_color_by_value,
            max: max_color_by_value,
            inRange: {
                color: colormap,
            },
            precision: 4,
        },
        series: [
            {
                type: 'graph',
                layout: 'force',
                label: {
                    position: 'right',
                    formatter: '{b}',
                },
                draggable: true,
                force: {
                    edgeLength: 10,
                    repulsion: 50,
                    gravity: 0.3,
                },
                data: this_2d_nodes,
                edges: this_2d_edges,
                lineStyle: {
                    // color: '#2f4554',
                    width: 2,
                },
                roam: true, // 图可以在页面整体放缩
            },
        ],
    }
}

const preprocess_2d = () => {
    // mst 用 tree graph
    if (isMST.value) {
        preprocess_2d_mst()
    }
    // 其他的用 force directed graph
    else if (colorby.value === 'componentsize') {
        preprocess_2d_colorby_componentsize()
    } else {
        preprocess_2d_colorby_pagerankscore()
    }
}

const chart2dOption = () => {
    my2dEcharts.clear()
    my2dEcharts.setOption(option_2d.value)
}

onMounted(async () => {
    my2dEcharts = echarts.init(echart2dDom.value as HTMLElement)
})

watch(nodesCoord_3d, () => {
    preprocess_2d()
    chart2dOption()
})
watch(colorby, () => {
    preprocess_2d()
    chart2dOption()
})
watch(component_threshold, () => {
    preprocess_2d()
    chart2dOption()
})
</script>
