<template>
    <div class="flex flex-col mx-1/20 justify-start">
        <div class="w-300 mt-18 ml-10">
            <div class="flex flex-row w-350 border-b-2 border-gray-300">
                <div class="text-4xl font-500 mb-8">CyGraph Conformation</div>
                <div class="mt-1.5 ml-10">
                    <el-button class="ml-5" @click="download">
                        <template #icon>
                            <n-icon>
                                <di />
                            </n-icon>
                        </template>
                        Download Conformation data
                    </el-button>
                </div>
                <div class="mt-1.5 ml-10">
                    <el-button class="ml-5" @click="selectRepeat">
                        <template #icon>
                            <n-icon>
                                <selectIcon />
                            </n-icon>
                        </template>
                        Choose Repeat #
                    </el-button>
                </div>
            </div>

            <div class="flex flex-row justify-between mt-6 ml-8 w-350">
                <n-table :bordered="false">
                    <tbody>
                        <tr>
                            <td>
                                <el-descriptions
                                    class="w-130 h-120 text-xl mt-8"
                                    :column="1"
                                    size="large"
                                    border
                                    v-loading="loaddata"
                                >
                                    <el-descriptions-item :width="165">
                                        <template #label>
                                            <div class="cell-item">Data UID</div>
                                        </template>
                                        {{ detailsdata.repeat_data_uid }}
                                    </el-descriptions-item>
                                    <el-descriptions-item :width="165">
                                        <template #label>
                                            <div class="cell-item">Seed</div>
                                        </template>
                                        {{ detailsdata.seed }}
                                    </el-descriptions-item>
                                    <el-descriptions-item :width="165">
                                        <template #label>
                                            <div class="cell-item">Sample Name</div>
                                        </template>
                                        {{ detailsdata.sample_name }}
                                    </el-descriptions-item>
                                    <el-descriptions-item :width="165">
                                        <template #label>
                                            <div class="cell-item">Threshold for gene filter</div>
                                        </template>
                                        {{ detailsdata.gene_filter_threshold }}
                                    </el-descriptions-item>
                                    <el-descriptions-item :width="165">
                                        <template #label>
                                            <div class="cell-item">
                                                Proportion of genes used for Rotation Derivation
                                            </div>
                                        </template>
                                        {{ detailsdata.anchor_gene_proportion }}
                                    </el-descriptions-item>
                                    <el-descriptions-item :width="165">
                                        <template #label>
                                            <div class="cell-item">Task ID</div>
                                        </template>
                                        {{ detailsdata.task_id }}
                                    </el-descriptions-item>
                                    <el-descriptions-item :width="165">
                                        <template #label>
                                            <div class="cell-item">
                                                Number of total Transcription centers
                                            </div>
                                        </template>
                                        {{ detailsdata.inferred_trans_center_num }}
                                    </el-descriptions-item>
                                </el-descriptions>
                            </td>
                            <td>
                                <div class="w-180 h-120 text-xl mt-0" ref="echartlineDom"></div>
                            </td>
                        </tr>
                    </tbody>
                </n-table>
            </div>
        </div>

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
                        <n-space align="center">
                            <n-radio-group v-model:value="colorby">
                                <n-radio-button value="componentsize" v-if="isMST == false">
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
        v-model="downloadphagedialogVisible"
        title="Select download data"
        width="30%"
        align-center
    >
        <div>
            <el-checkbox-group v-model="checkList" :max="1">
                <el-checkbox
                    v-for="v in repeat_data_uid_list"
                    :key="v"
                    :label="'Download ' + v + '.zip'"
                />
            </el-checkbox-group>
        </div>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="downloadphagedialogVisible = false">Cancel</el-button>
                <el-button type="primary" @click="downloadrequest">Download</el-button>
            </span>
        </template>
    </el-dialog>
    <el-dialog v-model="selectRepeatDialogVisible" title="Select repeat #" width="30%" align-center>
        <div>
            <el-checkbox-group v-model="selectRepeatCheckList" :max="1">
                <el-checkbox
                    v-for="(v, idx) in repeat_data_uid_list"
                    :key="v"
                    :label="'(Repeat #' + (idx + 1) + ') ' + v"
                />
            </el-checkbox-group>
        </div>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="selectRepeatDialogVisible = false">Cancel</el-button>
                <el-button type="primary" @click="selectRepeatRequest">Select</el-button>
            </span>
        </template>
    </el-dialog>
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
import { CloudDownloadOutline as di, AddCircleOutline as selectIcon } from '@vicons/ionicons5'
//
import axios from 'axios'
import { reactive, ref, isProxy, toRaw } from 'vue'
import * as echarts from 'echarts'
import 'echarts-gl'
import { NTooltip } from 'naive-ui'
import _ from 'lodash'

const topoid = ref('')

const colorby = ref('componentsize')
const component_threshold = ref(5)
const max_component_threshold = ref(15)

const loaddata = ref(false)
const loadtopologydata = ref(false)
const graphSelectionStr = ref('')
const isMST = ref(false)
const max_node_size = 20
const min_node_size = 7

const route = useRoute()
const phageid = computed(() => route.query?.crustdb_main_id as number)
const repeatuid = computed(() => route.query?.details_uid as string)
let mylineEcharts
let my3dEcharts
let my2dEcharts

const phagedata = ref({
    st_platform: '',
    species: '',
    disease_stage: '',
    developmental_stage: '',
    sex: '',
    cell_type: '',
    cell_num: 0,
    gene_num: 0,
    uniq_data_uid: '',
    slice_name: '',
    repeat_data_uid_list: [],
})

const detailsdata = ref({
    repeat_data_uid: '',
    seed: 0,
    sample_name: '',
    gene_filter_threshold: '',
    anchor_gene_proportion: 0,
    task_id: '',
    inferred_trans_center_num: 0,
    distance_list: [],
})

const topologyselectiondata = ref([])

const nodesCoord_3d = ref()
const edgeList_3d = ref()
const graph_info = ref()
const mst_parentchild_relation = ref()
const nodeattr_data = ref()
// const topology_id = ref(0)

const echartlineDom = ref<HTMLElement | null>(null)
const echart3dDom = ref<HTMLElement | null>(null)
const echart2dDom = ref<HTMLElement | null>(null)

const downloadphagedialogVisible = ref(false)

const selectRepeatDialogVisible = ref(false)
const selectGraphTypeDialogVisible = ref(false)

const repeat_data_uid_list = ref([] as any[])
const graph_type_list = ref([] as any[])

const downloadtype = ref('')
const checkList = ref([] as any[])
const selectRepeatCheckList = ref([] as any[])
const selectGraphTypeCheckList = ref([] as any[])
const checkedRowKeysRef = ref<DataTableRowKey[]>([])
// const router = useRouter()

const option_3d = ref({})
const option_2d = ref({})

const checkIsMST = () => {
    if (graphSelectionStr.value.includes('MST')) {
        isMST.value = true
        colorby.value = 'pagerankscore'
    } else {
        isMST.value = false
    }
}

const downloadrequest = async () => {
    if (checkList.value.length === 0) {
        window.$message.warning('Please select one zip data to download', {
            closable: true,
            duration: 5000,
        })
    } else {
        window.open(
            `/api/crustdb_main/zip/?crustid=${checkedRowKeysRef.value[0]}&checkList=${checkList.value}`,
            '_blank'
        )
    }
    checkList.value.length = 0
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
            text: `${detailsdata.value.repeat_data_uid} ${graphSelectionStr.value}`,
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
            text: `${detailsdata.value.repeat_data_uid} ${graphSelectionStr.value}`,
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
            text: `${detailsdata.value.repeat_data_uid} ${graphSelectionStr.value}`,
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
            text: `${detailsdata.value.repeat_data_uid} ${graphSelectionStr.value}`,
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
            text: `${detailsdata.value.repeat_data_uid} ${graphSelectionStr.value}`,
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

const selectRepeatRequest = async () => {
    if (selectRepeatCheckList.value.length === 0) {
        window.$message.warning('Please select one repeat', {
            closable: true,
            duration: 5000,
        })
    } else {
        const data_uid = selectRepeatCheckList.value[0].split(' ')[2]
        selectRepeatCheckList.value.length = 0 // clear the checkList
        const response2 = await axios.get(`/details`, {
            baseURL: '/api',
            timeout: 10000,
            params: {
                details_uid: data_uid, // details.repeat_data_uid
            },
        })

        detailsdata.value = response2.data // show the 1st repeat, by default
        const [details_data1, details_data2] = response2.data
        detailsdata.value = details_data1
        topoid.value = details_data2
        selectRepeatDialogVisible.value = false

        // ============== topology data ==============
        loadtopologydata.value = true

        const topology_list_response = await axios.get(`/details/topology_graphlist`, {
            baseURL: '/api',
            timeout: 10000,
            params: {
                topoid: topoid.value,
            },
        })
        topologyselectiondata.value = topology_list_response.data // 返回该 repeat 对应的 graph list
        // 默认展示第一个 graph (index 0) =================================================================================================
        // index 6 is mst
        const this_selection = topologyselectiondata.value[0]
        graphSelectionStr.value = this_selection
        checkIsMST()

        const topology_response = await axios.get(`/details/topology`, {
            baseURL: '/api',
            timeout: 10000,
            params: {
                graph_selection_str: graphSelectionStr.value,
                topoid: topoid.value,
            },
        })

        const [topo_data, topo_data3, topo_data4, topo_data5] = topology_response.data
        nodesCoord_3d.value = topo_data

        edgeList_3d.value = topo_data3
        graph_info.value = topo_data4
        mst_parentchild_relation.value = topo_data5

        preprocess_3d()
        preprocess_2d()

        const topology_nodeattr_response = await axios.get(`/details/topology_nodeattr`, {
            baseURL: '/api',
            timeout: 10000,
            params: {
                graph_selection_str: this_selection,
                topoid: topoid.value,
            },
        })
        const [topo_data6] = topology_nodeattr_response.data
        nodeattr_data.value = topo_data6

        loadtopologydata.value = false
    }
}

// const graph_type_map = str => {
//     const tmp_algo = str.split(' ')[1]
//     let para

//     if (tmp_algo === 'MST') {
//         para = 'MST-MST.pkl'
//     } else if (tmp_algo === '1NN') {
//         para = '1NN-1NN.pkl'
//     } else {
//         const tmp_para1 = str.split(' ')[2].slice(3, -1)
//         if (tmp_algo === 'KNN') {
//             para = `KNN-${tmp_para1}.pkl`
//         } else if (tmp_algo === 'KNN-SNN') {
//             para = `KNN_SNN-${tmp_para1}.pkl`
//         } else if (tmp_algo === 'RNN') {
//             para = `RNN-${tmp_para1}.pkl`
//         } else if (tmp_algo === 'RNN-SNN') {
//             const tmp_para2 = str.split(' ')[3].slice(2, -1)
//             para = `RNN_SNN-${tmp_para1}_${tmp_para2}.pkl`
//         }
//     }
//     return `${topology_id.value}-${para}`
// }
const graph_type_map = str => {
    if (str.includes('MST') || str.includes('1NN')) {
        return str.split(' ')[1]
    }
    return `${str.split(')')[1]})`
}

const selectGraphTypeRequest = async () => {
    if (selectGraphTypeCheckList.value.length === 0) {
        window.$message.warning('Please select one repeat', {
            closable: true,
            duration: 5000,
        })
    } else {
        // const this_selection = selectGraphTypeCheckList.value[0].split(') ')[1].trim()
        console.log('=======================================', selectGraphTypeCheckList.value)
        const this_selection = graph_type_map(selectGraphTypeCheckList.value[0])
        console.log('=======================================', this_selection)
        graphSelectionStr.value = this_selection
        checkIsMST()
        const topology_response = await axios.get(`/details/topology`, {
            baseURL: '/api',
            timeout: 10000,
            params: {
                graph_selection_str: graphSelectionStr.value,
                topoid: topoid.value,
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

        const topology_nodeattr_response = await axios.get(`/details/topology_nodeattr`, {
            baseURL: '/api',
            timeout: 10000,
            params: {
                graph_selection_str: this_selection,
                topoid: topoid.value,
            },
        })
        const [topo_data6] = topology_nodeattr_response.data
        nodeattr_data.value = topo_data6
    }
}

const updateRepeatList = () => {
    repeat_data_uid_list.value.length = 0
    for (let i = 0; i < phagedata.value.repeat_data_uid_list.length; i += 1) {
        repeat_data_uid_list.value.push(
            `${phagedata.value.uniq_data_uid}_${phagedata.value.repeat_data_uid_list[i]}`
        )
    }
}
const selectRepeat = () => {
    updateRepeatList()
    selectRepeatDialogVisible.value = true
}

const updateGraphTypeList = () => {
    graph_type_list.value.length = 0
    // graph_type_list.value = topologyselectiondata.value
    for (let i = 0; i < topologyselectiondata.value.length; i += 1) {
        // const tmp = topologyselectiondata.value[i].split('-')
        // const tmp_topologyid = tmp[0]
        // topology_id.value = tmp_topologyid
        // const tmp_algo = tmp[1]
        // let tmp_para = tmp[2]
        // tmp_para = tmp_para.substring(0, tmp_para.length - 4)
        // if (tmp_algo === 'KNN') {
        //     tmp_para = `KNN (k=${tmp_para.split('_')[0]})`
        // } else if (tmp_algo === 'KNN_SNN') {
        //     tmp_para = `KNN-SNN (k=${tmp_para.split('_')[0]})`
        // } else if (tmp_algo === 'RNN') {
        //     tmp_para = `RNN (r=${tmp_para.split('_')[0]})`
        // } else if (tmp_algo === 'RNN_SNN') {
        //     tmp_para = `RNN-SNN (r=${tmp_para.split('_')[0]}, k=${tmp_para.split('_')[1]})`
        // } else if (tmp_algo === 'MST') {
        //     tmp_para = 'MST'
        // } else if (tmp_algo === '1NN') {
        //     tmp_para = '1NN'
        // }
        // graph_type_list.value.push(tmp_para)
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

const download = () => {
    updateRepeatList()
    downloadtype.value = 'single'
    downloadphagedialogVisible.value = true
    checkedRowKeysRef.value = [phageid.value]
}

onBeforeMount(async () => {
    loaddata.value = true
    const response = await axios.get(`/crustdb_main/detail`, {
        baseURL: '/api',
        timeout: 10000,
        params: {
            id: phageid.value, // crustdb_main.id
        },
    })
    const { data } = response
    phagedata.value = data

    let response2 = null
    if (repeatuid.value === '') {
        response2 = await axios.get(`/details`, {
            baseURL: '/api',
            timeout: 10000,
            params: {
                crustdb_main_id: phagedata.value.uniq_data_uid, // details.repeat_data_uid
            },
        })
    } else {
        response2 = await axios.get(`/details`, {
            baseURL: '/api',
            timeout: 10000,
            params: {
                details_uid: repeatuid.value, // details.repeat_data_uid
            },
        })
    }

    detailsdata.value = response2.data // show the 1st repeat, by default
    const [details_data1, details_data2] = response2.data
    detailsdata.value = details_data1
    topoid.value = details_data2
    loaddata.value = false

    // ============== topology data ==============
    loadtopologydata.value = true
    // let topology_list_response = null
    // if (repeatuid.value === '') {
    //     topology_list_response = await axios.get(`/details/topology_graphlist`, {
    //         baseURL: '/api',
    //         timeout: 10000,
    //         params: {
    //             crustdb_main_id: phagedata.value.uniq_data_uid, // 默认展示第一个 repeat
    //         },
    //     })
    // } else {
    //     topology_list_response = await axios.get(`/details/topology_graphlist`, {
    //         baseURL: '/api',
    //         timeout: 10000,
    //         params: {
    //             details_uid: repeatuid.value, // details.repeat_data_uid 用户选择一个 repeat
    //         },
    //     })
    // }
    const topology_list_response = await axios.get(`/details/topology_graphlist`, {
        baseURL: '/api',
        timeout: 10000,
        params: {
            topoid: topoid.value,
        },
    })
    topologyselectiondata.value = topology_list_response.data // 返回该 repeat 对应的 graph list
    // 默认展示第一个 graph (index 0) =================================================================================================
    // index 6 is mst
    const this_selection = topologyselectiondata.value[0]
    graphSelectionStr.value = this_selection
    checkIsMST()

    const topology_response = await axios.get(`/details/topology`, {
        baseURL: '/api',
        timeout: 10000,
        params: {
            graph_selection_str: graphSelectionStr.value,
            topoid: topoid.value,
        },
    })

    const [topo_data, topo_data3, topo_data4, topo_data5] = topology_response.data
    nodesCoord_3d.value = topo_data

    edgeList_3d.value = topo_data3
    graph_info.value = topo_data4
    mst_parentchild_relation.value = topo_data5

    preprocess_3d()
    preprocess_2d()

    const topology_nodeattr_response = await axios.get(`/details/topology_nodeattr`, {
        baseURL: '/api',
        timeout: 10000,
        params: {
            graph_selection_str: this_selection,
            topoid: topoid.value,
        },
    })
    const [topo_data6] = topology_nodeattr_response.data
    nodeattr_data.value = topo_data6

    loadtopologydata.value = false
})
onMounted(async () => {
    mylineEcharts = echarts.init(echartlineDom.value as HTMLElement)
    my3dEcharts = echarts.init(echart3dDom.value as HTMLElement)
    my2dEcharts = echarts.init(echart2dDom.value as HTMLElement)
    chartOption()
    chart3dOption()
    chart2dOption()
})

watch(detailsdata, () => {
    chartOption()
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
            // this_phageList.push({
            //     x: element, // x
            //     // y: nodesCoord_3d.value.y[idx], // y
            //     // z: nodesCoord_3d.value.z[idx], // z
            //     node_name: nodeattr_data.value.node_name[idx], // node_name (i.e. gene name)
            //     degrees: parseInt(nodeattr_data.value.degrees[idx], 10),
            //     degree_centrality:
            //         Math.round(parseFloat(nodeattr_data.value.degree_centrality[idx]) * 1e4) / 1e4,
            //     betweenness:
            //         Math.round(parseFloat(nodeattr_data.value.betweenness[idx]) * 1e4) / 1e4,
            //     closeness_centrality:
            //         Math.round(parseFloat(nodeattr_data.value.closeness_centrality[idx]) * 1e4) /
            //         1e4,
            //     page_rank_score:
            //         Math.round(parseFloat(nodeattr_data.value.page_rank_score[idx]) * 1e4) / 1e4,
            //     component_size: Math.round(parseInt(nodeattr_data.value.component_size[idx], 10)),
            // })
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
