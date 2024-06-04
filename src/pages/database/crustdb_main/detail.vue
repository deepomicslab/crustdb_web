<template>
    <div class="flex flex-col mx-1/10 justify-start">
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

            <!-- Phage Informatin table -->
            <el-descriptions
                class="w-330 text-xl mt-8"
                :column="2"
                size="large"
                border
                v-loading="loaddata"
            >
                <el-descriptions-item :width="165">
                    <template #label>
                        <div class="cell-item">Publication Link</div>
                    </template>
                    {{ detailsdata.publication_link }}
                </el-descriptions-item>
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
                        <div class="cell-item">Cell Type</div>
                    </template>
                    {{ detailsdata.celltype }}
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
                        <div class="cell-item">Number of total Transcription centers</div>
                    </template>
                    {{ detailsdata.inferred_trans_center_num }}
                </el-descriptions-item>
            </el-descriptions>
        </div>

        <div class="mt-5 ml-15">
            <div class="flex flex-row w-200">
                <h1 class="text-3xl mt-5 ml-7 font-500 text-[#3262a8]">3D Vis</h1>
            </div>
            <div class="flex flex-row">
                <div class="w-300 h-150 mb-10 mt-5 p-5 ml-8" style="box-shadow: 0 0 64px #cfd5db">
                    <div id="my3dEcharts" class="h-140" ref="echart3dDom"></div>
                </div>
            </div>
            <!-- <div class="flex flex-row"> -->
            <!-- <mst /> -->
            <!-- <annotation /> -->
            <!-- </div> -->
        </div>
        <div class="mt-5 ml-15">
            <div class="flex flex-row w-200">
                <h1 class="text-3xl mt-9 ml-7 font-500 text-[#3262a8]">Convergence Curve</h1>
            </div>
            <!-- <div class="flex flex-row justify-between mt-6 ml-8 w-285">
                <n-form-item label="Please choose plot type" class="w-100">
                    <n-select
                        v-model:value="linechartvalue"
                        :options="linechartoptions"
                        @update:value="detailsdata"
                    ></n-select>
                </n-form-item>
            </div> -->
            <div class="flex flex-row">
                <div class="w-300 h-150 mb-10 mt-5 p-5 ml-8" style="box-shadow: 0 0 64px #cfd5db">
                    <div id="myEcharts" class="h-140" ref="echartlineDom"></div>
                </div>
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
</template>

<script setup lang="ts">
// @ts-nocheck
/* eslint-disable camelcase */
import { CloudDownloadOutline as di, AddCircleOutline as selectIcon } from '@vicons/ionicons5'
//
import axios from 'axios'
import { reactive, ref } from 'vue'
import * as echarts from 'echarts'
import 'echarts-gl'
import _ from 'lodash'
import { usePhageStore } from '@/store/phage'
import { useCrustDBStore } from '@/store/crustdb'

// import mst from '../../visualize/components/mst.vue'
// import annotation from '../../visualize/components/annotation.vue'

const phageStore = usePhageStore()
const crustdbStore = useCrustDBStore()
const loaddata = ref(false)
const route = useRoute()
const phageid = computed(() => route.query?.crustdb_main_id as number)
const repeatuid = computed(() => route.query?.details_uid as string)
let mylineEcharts
let my3dEcharts

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

const nodesCoord_3d = ref()
const edgeList_3d = ref()

const echartlineDom = ref<HTMLElement | null>(null)
const echart3dDom = ref<HTMLElement | null>(null)
// const linechartvalue = ref('Convergence of Conformation with Cytocraft')
// const linechartoptions = [
//     {
//         label: 'ST Platform Distribution',
//         value: 'ST Platform Distribution',
//     },
//     {
//         label: 'ST Platform Distribution',
//         value: 'ST Platform Distribution',
//     },
// ]

const downloadphagedialogVisible = ref(false)

const selectRepeatDialogVisible = ref(false)
const repeat_data_uid_list = ref([] as any[])

const downloadtype = ref('')
const checkList = ref([] as any[])
const selectRepeatCheckList = ref([] as any[])
const checkedRowKeysRef = ref<DataTableRowKey[]>([])
// const router = useRouter()

const option_3d = ref({})

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

const selectRepeatRequest = async () => {
    if (selectRepeatCheckList.value.length === 0) {
        window.$message.warning('Please select one repeat', {
            closable: true,
            duration: 5000,
        })
    } else {
        const data_uid = selectRepeatCheckList.value[0].split(' ')[2]
        // console.log(data_uid) // Stage44.CP_1XOH
        selectRepeatCheckList.value.length = 0 // clear the checkList
        const response2 = await axios.get(`/details`, {
            baseURL: '/api',
            timeout: 10000,
            params: {
                details_uid: data_uid, // details.repeat_data_uid
            },
        })
        detailsdata.value = response2.data
        selectRepeatDialogVisible.value = false
    }
}

const chartOption = () => {
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
                // magicType: { type: ['line', 'bar'] },
                // restore: {},
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

const preprocess_3d = () => {
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
    const array_col_3 = arrayColumn(this_nodesCoord_3d, 3) // page_rank_score
    const min_page_rank_score = Math.min.apply(null, array_col_3)
    const max_page_rank_score = Math.max.apply(null, array_col_3)

    const seriesData = [
        {
            // data: this_nodesCoord_3d,
            type: 'scatter3D',
            symbolSize: 7,
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
        tooltip: {
            show: true,
            formatter(param) {
                // if (param.seriesName === 'line segment') {
                //     return ''
                // }
                // return 'node'
                return `Gene Name ${param.value[4]} <br>- x: ${param.value[0]}<br>- y: ${param.value[1]}<br>- z: ${param.value[2]}<br>- page_rank_score: ${param.value[3]}`
            },
        },
        visualMap: {
            // show: false,
            dimension: 3, // page_rank_score
            min: min_page_rank_score,
            max: max_page_rank_score,
            inRange: {
                color: [
                    '#313695',
                    '#4575b4',
                    '#74add1',
                    '#abd9e9',
                    '#e0f3f8',
                    '#ffffbf',
                    '#fee090',
                    '#fdae61',
                    '#f46d43',
                    '#d73027',
                    '#a50026',
                ],
            },
        },
        grid3D: {},
        xAxis3D: {},
        yAxis3D: {},
        zAxis3D: {},
        series: seriesData,
        dataset: {
            dimensions: ['x', 'y', 'z', 'node_name', 'page_rank_score'],
            source: this_nodesCoord_3d,
        },
    }
}

const chart3dOption = () => {
    my3dEcharts.setOption(option_3d.value)
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
const download = () => {
    updateRepeatList()
    downloadtype.value = 'single'
    downloadphagedialogVisible.value = true
    checkedRowKeysRef.value = [phageid.value]
}

onBeforeMount(async () => {
    // From table crustdb_main
    loaddata.value = true
    phageStore.phagedataloaded = false
    phageStore.phageid = phageid.value
    const response = await axios.get(`/crustdb_main/detail`, {
        baseURL: '/api',
        timeout: 10000,
        params: {
            id: phageid.value, // crustdb_main.id
        },
    })
    const { data } = response
    phagedata.value = data

    // From table details
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
    // crustdbStore.detailsDistanceList = detailsdata.value.distance_list
    loaddata.value = false

    // ============== topology data ==============
    let topology_response = null
    if (repeatuid.value === '') {
        topology_response = await axios.get(`/details/topology`, {
            baseURL: '/api',
            timeout: 10000,
            params: {
                crustdb_main_id: phagedata.value.uniq_data_uid, // details.repeat_data_uid
            },
        })
    } else {
        topology_response = await axios.get(`/details/topology`, {
            baseURL: '/api',
            timeout: 10000,
            params: {
                details_uid: repeatuid.value, // details.repeat_data_uid
            },
        })
    }
    // console.log('topology_response', topology_response)

    const [topo_data, topo_data3] = topology_response.data
    crustdbStore.nodesCoord = topo_data
    nodesCoord_3d.value = topo_data

    // crustdbStore.nodeIndex = topo_data2
    crustdbStore.edgeList = topo_data3
    edgeList_3d.value = topo_data3
    // const this_nodesCoord_3d = []
    // for (let i = 0; i < topo_data3.length; i += 1) {
    //     this_nodesCoord_3d.push([topo_data.x[i], topo_data.y[i], topo_data.z[i]])
    // }
    // // const this_nodesCoord_3d = []
    // // nodesCoord_3d.value.forEach(element => {
    // //     console.log('element', element)
    // //     this_nodesCoord_3d.push(element)
    // // })
    // // console.log('this_nodesCoord_3d', this_nodesCoord_3d)
    // nodesCoord_3d.value = this_nodesCoord_3d
    // console.log('nodesCoord_3d.value', nodesCoord_3d.value)
    preprocess_3d()
})
onMounted(async () => {
    mylineEcharts = echarts.init(echartlineDom.value as HTMLElement)
    my3dEcharts = echarts.init(echart3dDom.value as HTMLElement)
    chartOption()
    chart3dOption()
})

watch(detailsdata, () => {
    chartOption()
})
watch(nodesCoord_3d, () => {
    chart3dOption()
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
</script>
