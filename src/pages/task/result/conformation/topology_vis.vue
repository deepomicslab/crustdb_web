<template>
    <div class="flex flex-col mx-1/20 justify-start">
        <div class="w-350 mt-18 ml-10">
            <div class="flex flex-row w-350 border-b-2 border-gray-300">
                <div class="text-4xl font-500 mb-6">Graph Information</div>
                <div class="mt-1.5 ml-0">
                    <n-space horizontal>
                        <el-button class="ml-4" @click="selectGraphType">
                            <template #icon>
                                <n-icon>
                                    <selectIcon />
                                </n-icon>
                            </template>
                            Choose Graph Type
                        </el-button>
                        <div class="mt-2" v-if="isMST == false">Colored by</div>
                        <n-space align="center" v-if="isMST == false">
                            <n-radio-group v-model:value="colorby">
                                <n-radio-button value="componentsize">
                                    Component Size
                                </n-radio-button>
                                <n-radio-button value="pagerankscore">
                                    Page Rank Score
                                </n-radio-button>
                            </n-radio-group>
                        </n-space>
                        <div class="mt-2" v-if="colorby == 'componentsize' && isMST == false">
                            Set component size threshold (max {{ max_component_threshold }})
                        </div>
                        <n-space vertical v-if="colorby == 'componentsize' && isMST == false">
                            <n-slider
                                v-model:value="component_threshold"
                                :min="0"
                                :max="max_component_threshold"
                                :step="1"
                            />
                            <n-input-number
                                v-model:value="component_threshold"
                                :min="0"
                                :max="max_component_threshold"
                                size="small"
                            />
                        </n-space>
                    </n-space>
                </div>
            </div>
        </div>
        <div class="w-350 mt-5 ml-10">
            <n-table :bordered="false">
                <tbody>
                    <tr>
                        <td>
                            <div class="flex flex-row">
                                <h1 class="text-3xl mt-5 ml-5 font-500 text-[#3262a8]">3D Vis</h1>
                            </div>
                            <div class="flex flex-row">
                                <div
                                    class="h-150 w-160 mb-10 mt-5 p-5 ml-8"
                                    style="box-shadow: 0 0 64px #cfd5db"
                                >
                                    <div id="my3dEcharts" class="h-140" ref="echart3dDom"></div>
                                </div>
                            </div>
                        </td>
                        <td>
                            <div class="flex flex-row">
                                <h1 class="text-3xl mt-5 ml-5 font-500 text-[#3262a8]">2D Vis</h1>
                            </div>
                            <div class="flex flex-row">
                                <div
                                    class="h-150 w-160 mb-10 mt-5 p-5 ml-8"
                                    style="box-shadow: 0 0 64px #cfd5db"
                                >
                                    <div id="my2dEcharts" class="h-140" ref="echart2dDom"></div>
                                </div>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </n-table>
        </div>

        <div class="w-350 mt-5 ml-15">
            <div class="flex flex-row">
                <h1 class="text-3xl mt-5 ml-5 font-500 text-[#3262a8]">Graph Information</h1>
            </div>
            <el-descriptions
                class="w-350 text-xl mt-8"
                :column="2"
                size="large"
                border
                v-loading="loadtopologydata"
            >
                <el-descriptions-item :width="165">
                    <template #label>
                        <div class="cell-item">Graph Type Selection</div>
                    </template>
                    {{ graphSelectionStr }}
                </el-descriptions-item>
                <el-descriptions-item :width="165" v-if="graph_info">
                    <template #label>
                        <div class="cell-item">Average Branching Factor</div>
                    </template>
                    {{ graph_info.average_branching_factor }}
                </el-descriptions-item>
                <el-descriptions-item :width="165" v-if="graph_info">
                    <template #label>
                        <div class="cell-item">Modularity</div>
                    </template>
                    {{ graph_info.modularity }}
                </el-descriptions-item>
                <el-descriptions-item :width="165" v-if="graph_info">
                    <template #label>
                        <div class="cell-item">Span</div>
                    </template>
                    {{ graph_info.span }}
                </el-descriptions-item>
                <el-descriptions-item :width="165" v-if="graph_info">
                    <template #label>
                        <div class="cell-item">Assortativity</div>
                    </template>
                    {{ graph_info.assortativity }}
                </el-descriptions-item>
                <el-descriptions-item :width="165" v-if="graph_info">
                    <template #label>
                        <div class="cell-item">Degree Centrality</div>
                    </template>
                    {{ graph_info.degree_centrality }}
                </el-descriptions-item>
                <el-descriptions-item :width="165" v-if="graph_info">
                    <template #label>
                        <div class="cell-item">Closeness Centrality</div>
                    </template>
                    {{ graph_info.closeness_centrality }}
                </el-descriptions-item>
                <el-descriptions-item :width="165" v-if="graph_info">
                    <template #label>
                        <div class="cell-item">Betweenness Centrality</div>
                    </template>
                    {{ graph_info.betweenness_centrality }}
                </el-descriptions-item>
            </el-descriptions>
        </div>

        <div class="w-350 mt-5 ml-15">
            <div class="flex flex-row">
                <h1 class="text-3xl mt-5 ml-5 font-500 text-[#3262a8]">Graph Node Information</h1>
            </div>
            <div v-loading="loadtopologydata" class="mt-8">
                <n-data-table
                    :data="phageList"
                    :columns="columns"
                    :pagination="pagination"
                    :max-height="700"
                    :row-key="rowKey"
                    :scroll-x="700"
                    @update:sorter="handleSorterChange"
                />
            </div>
        </div>
    </div>

    <el-dialog
        v-model="selectGraphTypeDialogVisible"
        title="Select Graph Type"
        width="30%"
        align-center
    >
        <div>
            <el-checkbox-group v-model="selectGraphTypeCheckList" :max="1">
                <!-- :cols does not work, only n-gi 限制所有选项在一列 -->
                <n-grid :y-gap="8" :cols="10">
                    <n-gi>
                        <el-checkbox
                            v-for="(v, idx) in graph_type_list"
                            :key="v"
                            :label="'(Graph' + (idx + 1) + ') ' + v"
                        />
                    </n-gi>
                </n-grid>
            </el-checkbox-group>
        </div>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="selectGraphTypeDialogVisible = false">Cancel</el-button>
                <el-button type="primary" @click="selectGraphTypeRequest">Select</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
// @ts-nocheck
/* eslint-disable camelcase */
import { AddCircleOutline as selectIcon } from '@vicons/ionicons5'
//
import axios from 'axios'
import { reactive, ref, isProxy, toRaw, toRefs } from 'vue'
import * as echarts from 'echarts'
import 'echarts-gl'
import { NTooltip } from 'naive-ui'
// import { decrypt } from '@/utils/crypto'

const colorby = ref('componentsize')
const component_threshold = ref(0)
const max_component_threshold = ref(15)

const loadtopologydata = ref(false)
const graphSelectionStr = ref('')
const isMST = ref(false)
const max_node_size = 30
const min_node_size = 10

// const route = useRoute()
let my3dEcharts: echarts.ECharts
let my2dEcharts: echarts.ECharts

const topologyselectiondata = ref([])

const nodesCoord_3d = ref()
const edgeList_3d = ref()
const graph_info = ref()
const mst_parentchild_relation = ref()
const nodeattr_data = ref()
// const topology_id = ref(0)

const echart3dDom = ref<HTMLElement | null>(null)
const echart2dDom = ref<HTMLElement | null>(null)

const selectGraphTypeDialogVisible = ref(false)

const graph_type_list = ref([] as any[])

const selectGraphTypeCheckList = ref([] as any[])

const option_3d = ref({})
const option_2d = ref({})

const props = defineProps({
    taskid: {
        type: String,
        required: true,
    },
})
const { taskid } = toRefs(props)
// const taskid = computed(() => {
//     return decrypt(
//         route.query?.taskid as string,
//         'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2'
//     )
// })
console.log('------------------------------------- taskid.value', taskid.value)

const checkIsMST = () => {
    if (graphSelectionStr.value.includes('MST')) {
        isMST.value = true
        colorby.value = 'pagerankscore'
    } else {
        isMST.value = false
    }
}

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
    // const this_nodesCoord_3d_tmp = toRaw(nodesCoord_3d.value)
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
    // max_component_threshold.value will be updated in preprocess_2d()
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
    // max_component_threshold.value will be updated in preprocess_2d()
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
    // if (colorby.value === 'componentsize' && isMST.value === false) {
    if (colorby.value === 'componentsize') {
        preprocess_3d_colorby_componentsize()
    }
    // } else if (colorby.value === 'pagerankscore' || isMST.value === true) {
    else if (colorby.value === 'pagerankscore') {
        preprocess_3d_colorby_pagerankscore()
    }
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
    max_component_threshold.value = Math.min(
        max_component_threshold.value,
        Math.floor(max_color_by_value)
    )

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

const chart3dOption = () => {
    my3dEcharts.clear()
    my3dEcharts.setOption(option_3d.value)
}
const chart2dOption = () => {
    my2dEcharts.clear()
    my2dEcharts.setOption(option_2d.value)
}

const selectGraphTypeRequest = async () => {
    if (selectGraphTypeCheckList.value.length === 0) {
        window.$message.warning('Please select one graph to display', {
            closable: true,
            duration: 5000,
        })
    } else {
        const this_selection = selectGraphTypeCheckList.value[0]
        graphSelectionStr.value = this_selection
        checkIsMST()

        const topology_response = await axios.get(`/tasks/vis/topology/`, {
            baseURL: '/api',
            timeout: 10000,
            params: {
                taskid: taskid.value,
                graph_selection_str: this_selection,
            },
        })
        selectGraphTypeCheckList.value.length = 0
        selectGraphTypeDialogVisible.value = false

        const [topo_data, topo_data3, topo_data4, topo_data5] = topology_response.data
        nodesCoord_3d.value = topo_data

        edgeList_3d.value = topo_data3
        graph_info.value = topo_data4
        mst_parentchild_relation.value = topo_data5

        preprocess_3d()
        preprocess_2d()

        const topology_nodeattr_response = await axios.get(`/tasks/vis/topology_nodeattr/`, {
            baseURL: '/api',
            timeout: 10000,
            params: {
                taskid: taskid.value,
                graph_selection_str: this_selection,
            },
        })
        const [topo_data6] = topology_nodeattr_response.data
        nodeattr_data.value = topo_data6
    }
}

const updateGraphTypeList = () => {
    graph_type_list.value.length = 0
    for (let i = 0; i < topologyselectiondata.value.length; i += 1) {
        graph_type_list.value.push(topologyselectiondata.value[i])
    }
}
const selectGraphType = () => {
    if (graph_type_list.value.length === 0) {
        // --------------------------------------------------------------------------------------------------------------------------------------- 可能会有问题，记录一下
        updateGraphTypeList()
    }
    selectGraphTypeDialogVisible.value = true
}

onBeforeMount(async () => {
    // ============== topology data ==============
    loadtopologydata.value = true
    let topology_list_response = null
    topology_list_response = await axios.get(`/tasks/vis/topology_graphlist/`, {
        baseURL: '/api',
        timeout: 10000,
        params: {
            taskid: taskid.value,
        },
    })
    topologyselectiondata.value = topology_list_response.data // 返回该 repeat 对应的 graph list

    // 默认展示第一个 graph (index 0) =================================================================================================
    // index 6 is mst
    const this_selection = topologyselectiondata.value[0]
    graphSelectionStr.value = this_selection
    checkIsMST()

    // const topology_response = await axios.get(`/details/topology`, {
    const topology_response = await axios.get(`/tasks/vis/topology/`, {
        baseURL: '/api',
        timeout: 10000,
        params: {
            taskid: taskid.value,
            graph_selection_str: this_selection,
        },
    })

    const [topo_data, topo_data3, topo_data4, topo_data5] = topology_response.data
    nodesCoord_3d.value = topo_data

    edgeList_3d.value = topo_data3
    graph_info.value = topo_data4
    mst_parentchild_relation.value = topo_data5

    preprocess_3d()
    preprocess_2d()

    const topology_nodeattr_response = await axios.get(`/tasks/vis/topology_nodeattr/`, {
        baseURL: '/api',
        timeout: 10000,
        params: {
            taskid: taskid.value,
            graph_selection_str: this_selection,
        },
    })
    const [topo_data6] = topology_nodeattr_response.data
    nodeattr_data.value = topo_data6

    loadtopologydata.value = false
})
onMounted(async () => {
    my3dEcharts = echarts.init(echart3dDom.value as HTMLElement)
    my2dEcharts = echarts.init(echart2dDom.value as HTMLElement)
    chart3dOption()
    chart2dOption()
})

watch(nodesCoord_3d, () => {
    chart3dOption()
    chart2dOption()
})
watch(colorby, () => {
    preprocess_2d()
    preprocess_3d()
    chart2dOption()
    chart3dOption()
})
watch(component_threshold, () => {
    preprocess_2d()
    preprocess_3d()
    chart2dOption()
    chart3dOption()
})

const phageList = computed(() => {
    const this_phageList = []
    if (nodeattr_data.value) {
        const x_list = Array.from(new Set(nodeattr_data.value.x))
        x_list.forEach((element, idx) => {
            this_phageList.push({
                x: element, // x
                // y: nodesCoord_3d.value.y[idx], // y
                // z: nodesCoord_3d.value.z[idx], // z
                node_name: nodeattr_data.value.node_name[idx], // node_name (i.e. gene name)
                degrees: nodeattr_data.value.degrees[idx],
                degree_centrality: nodeattr_data.value.degree_centrality[idx],
                betweenness: nodeattr_data.value.betweenness[idx],
                closeness_centrality: nodeattr_data.value.closeness_centrality[idx],
                page_rank_score: nodeattr_data.value.page_rank_score[idx],
                component_size: nodeattr_data.value.component_size[idx],
                component_id: nodeattr_data.value.component_id[idx],
            })
        })
    }
    return this_phageList
})

const pagination = reactive({
    page: 1,
    pageSize: 30,
    showSizePicker: true,
    pageSizes: [30, 50, 100],
    onChange: (page: number) => {
        pagination.page = page
    },
    onUpdatePageSize: (pageSize: number) => {
        pagination.pageSize = pageSize
        pagination.page = 1
    },
})

const handleSorterChange = async sorter => {
    loadtopologydata.value = true
    const topology_nodeattr_response = await axios.get(`/details/topology_nodeattr`, {
        baseURL: '/api',
        timeout: 10000,
        params: {
            graph_selection_str: graphSelectionStr.value, // details.repeat_data_uid
            sorter,
        },
    })
    const [topo_data6] = topology_nodeattr_response.data
    nodeattr_data.value = topo_data6
    loadtopologydata.value = false
}

const col_width = {
    node_name: 70,
    degrees: 50,
    degree_centrality: 60,
    betweenness: 55,
    closeness_centrality: 60,
    page_rank_score: 60,
    component_id: 60,
}

type RowData = {
    degrees: string
    degree_centrality: string
    betweenness: string
    closeness_centrality: string
    page_rank_score: string
    component_id: string
}
const renderTooltip = (trigger: any, content: any) => {
    return h(NTooltip, null, {
        trigger: () => trigger,
        default: () => content,
    })
}
const rowKey = (row: RowData) => {
    return row.id
}
const createColumns = (): DataTableColumns<RowData> => {
    return [
        {
            title() {
                return renderTooltip(h('div', null, { default: () => 'Gene Name' }), 'Gene Name')
            },
            key: 'node_name',
            align: 'center',
            sorter: true,
            ellipsis: {
                tooltip: true,
            },
            width: col_width.node_name,
        },
        {
            title() {
                return renderTooltip(h('div', null, { default: () => 'Degrees' }), 'degrees')
            },
            key: 'degrees',
            align: 'center',
            sorter: true,
            ellipsis: {
                tooltip: true,
            },
            width: col_width.degrees,
        },
        {
            title() {
                return renderTooltip(
                    h('div', null, { default: () => 'Degree Centrality' }),
                    'degree centrality'
                )
            },
            key: 'degree_centrality',
            align: 'center',
            sorter: true,
            ellipsis: {
                tooltip: true,
            },
            width: col_width.degree_centrality,
        },
        {
            title() {
                return renderTooltip(
                    h('div', null, { default: () => 'Betweenness' }),
                    'betweenness'
                )
            },
            key: 'betweenness',
            align: 'center',
            sorter: true,
            ellipsis: {
                tooltip: true,
            },
            width: col_width.betweenness,
        },
        {
            title() {
                return renderTooltip(
                    h('div', null, { default: () => 'Closeness Centrality' }),
                    'closeness centrality'
                )
            },
            key: 'closeness_centrality',
            align: 'center',
            sorter: true,
            ellipsis: {
                tooltip: true,
            },
            width: col_width.closeness_centrality,
        },
        {
            title() {
                return renderTooltip(
                    h('div', null, { default: () => 'Page Rank Score' }),
                    'page rank score'
                )
            },
            key: 'page_rank_score',
            align: 'center',
            sorter: true,
            ellipsis: {
                tooltip: true,
            },
            width: col_width.page_rank_score,
        },
        {
            title() {
                return renderTooltip(
                    h('div', null, { default: () => 'Component ID' }),
                    'component ID, the lower, the larger size it is of'
                )
            },
            key: 'component_id',
            align: 'center',
            sorter: true,
            ellipsis: {
                tooltip: true,
            },
            width: col_width.component_id,
        },
    ]
}

const columns = createColumns()
</script>
