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
                                <topologyConformationTable :detailsdata="detailsdata" />
                            </td>
                            <td>
                                <!-- <div class="w-180 h-120 text-xl mt-0" ref="echartlineDom"></div> -->
                                <topologyVisConformation :detailsdata="detailsdata" />
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
                        <el-button class="ml-2" @click="selectGraphType">
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
                            <topologyVis3d
                                :graphSelectionStr="graphSelectionStr"
                                :nodesCoord_3d="nodesCoord_3d"
                                :edgeList_3d="edgeList_3d"
                                :colorby="colorby"
                                :component_threshold="component_threshold"
                                :repeat_data_uid="detailsdata.repeat_data_uid"
                            />
                        </td>
                        <td>
                            <topologyVis2d
                                :graphSelectionStr="graphSelectionStr"
                                :nodesCoord_3d="nodesCoord_3d"
                                :edgeList_3d="edgeList_3d"
                                :mst_parentchild_relation="mst_parentchild_relation"
                                :isMST="isMST"
                                :colorby="colorby"
                                :component_threshold="component_threshold"
                                :repeat_data_uid="detailsdata.repeat_data_uid"
                            />
                        </td>
                    </tr>
                    <tr v-if="isMST == false">
                        <td colspan="2">
                            <topologyVisGO
                                :graphSelectionStr="graphSelectionStr"
                                :repeat_data_uid="detailsdata.repeat_data_uid"
                                :go_info="go_info"
                                :topoid="topoid"
                            />
                        </td>
                    </tr>
                </tbody>
            </n-table>
        </div>

        <topologyGraphTable
            :graphSelectionStr="graphSelectionStr"
            :graph_info="graph_info"
            :nodeattr_data="nodeattr_data"
        />
        <topologyGoTable
            v-if="isMST == false"
            :go_info="go_info"
            :go_original_info="go_original_info"
        />
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
import { ref, toRaw } from 'vue'
import topologyVisGO from './topology_vis_go.vue'
import topologyVis2d from './topology_vis_2d.vue'
import topologyVis3d from './topology_vis_3d.vue'
import topologyGraphTable from './topology_graph_table.vue'
import topologyGoTable from './topology_go_table.vue'
import topologyConformationTable from './topology_conformation_table.vue'
import topologyVisConformation from './topology_vis_conformation.vue'

const topoid = ref('')

const colorby = ref('componentsize')
const component_threshold = ref(5)
const max_component_threshold = ref(15)

const loaddata = ref(false)
const graphSelectionStr = ref('')
const isMST = ref(false)

const route = useRoute()
const phageid = computed(() => route.query?.crustdb_main_id as number)
const repeatuid = computed(() => route.query?.details_uid as string)

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

const go_info = ref({
    Gene_set: [],
    Term: [],
    p_inv: [],
    Hits_ratio: [],
})
const go_original_info = ref({
    Gene_set: [],
    Term: [],
    Overlap: [],
    P_value: [],
    Adjusted_P_value: [],
    Old_P_value: [],
    Old_Adjusted_P_value: [],
    Odds_Ratio: [],
    Combined_Score: [],
    Genes: [],
})

const topologyselectiondata = ref([])

const nodesCoord_3d = ref()
const edgeList_3d = ref()
const graph_info = ref()
const mst_parentchild_relation = ref()
const nodeattr_data = ref()

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

const helper_topology_graphlist = async () => {
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
}

const helper_topology = async () => {
    if (graphSelectionStr.value === '') {
        return
    }

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
    max_component_threshold.value = Math.max.apply(null, toRaw(nodesCoord_3d.value.component_size))
}

const helper_topology_nodeattr = async () => {
    const topology_nodeattr_response = await axios.get(`/details/topology_nodeattr`, {
        baseURL: '/api',
        timeout: 10000,
        params: {
            graph_selection_str: graphSelectionStr.value,
            topoid: topoid.value,
        },
    })
    const [topo_data6] = topology_nodeattr_response.data
    nodeattr_data.value = topo_data6
}

const helper_topology_go = async () => {
    const topology_go_response = await axios.get(`/details/topology_go`, {
        baseURL: '/api',
        timeout: 10000,
        params: {
            graph_selection_str: graphSelectionStr.value,
            topoid: topoid.value,
        },
    })
    const [go_data1, go_data2] = topology_go_response.data
    go_info.value = go_data1
    go_original_info.value = go_data2
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
        // helper_topology_graphlist()
        // helper_topology()
    }
}

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
        const this_selection = graph_type_map(selectGraphTypeCheckList.value[0])
        graphSelectionStr.value = this_selection
        checkIsMST()

        helper_topology()
        selectGraphTypeCheckList.value.length = 0
        selectGraphTypeDialogVisible.value = false
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

    // helper_topology_graphlist()
    // helper_topology()
})

watch(graphSelectionStr, async () => {
    helper_topology()
    helper_topology_nodeattr()
    helper_topology_go()
})
watch(topoid, async () => {
    // setTimeout(helper_topology, 500)
    // helper_topology()
    helper_topology_graphlist()
    helper_topology()
    setTimeout(helper_topology_nodeattr, 500)
    setTimeout(helper_topology_go, 500)
})
</script>
