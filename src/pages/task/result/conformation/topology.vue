<template>
    <div class="flex flex-col mx-1/20 justify-start">
        <div class="mt-18 ml-10">
            <div class="flex flex-row border-b-2 border-gray-300">
                <div class="text-4xl font-500 mb-8">Task Result Page</div>
            </div>
        </div>
        <div class="mt-5 ml-15">
            <div class="text-3xl mt-5 ml-7 font-500 text-[#3262a8]">Task Result</div>
        </div>
        <div class="w-330 mt-5 ml-15">
            <el-descriptions class="w-330 text-xl mt-8" :column="2" size="large" border>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">Task ID</div>
                    </template>
                    <div class="cell-item">{{ taskdata.results.id }}</div>
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">Using Demo File</div>
                    </template>
                    {{ taskdata.results.is_demo_input }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">Species</div>
                    </template>
                    {{ taskdata.results.species }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">Task Status</div>
                    </template>
                    <el-tag :type="StatusColor(taskdata.results.status)" size="large">
                        {{ taskdata.results.status }}
                    </el-tag>
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">Analysis Type</div>
                    </template>
                    {{ taskdata.results.analysis_type }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">Created At</div>
                    </template>
                    {{ taskdata.results.created_at }}
                </el-descriptions-item>
            </el-descriptions>
        </div>
        <div class="mt-18" v-if="!craftsuccess">
            <div class="text-3xl mt-5 ml-7 font-500 text-[#3262a8]">Craft Output</div>
        </div>
        <div class="mt-18" v-if="!craftsuccess && detailsdata">
            <el-scrollbar :class="logStyle" v-loading="consoleloading">
                <n-code :code="detailsdata.log_lines" word-wrap show-line-numbers />
            </el-scrollbar>
        </div>
    </div>
    <!-- <topologyVis :taskid="taskid" v-if="craftsuccess" /> -->
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
                            <topologyVis3D
                                :graphSelectionStr="graphSelectionStr"
                                :nodesCoord_3d="nodesCoord_3d"
                                :edgeList_3d="edgeList_3d"
                                :colorby="colorby"
                                :component_threshold="component_threshold"
                            />
                        </td>
                        <td>
                            <topologyVis2D
                                :graphSelectionStr="graphSelectionStr"
                                :nodesCoord_3d="nodesCoord_3d"
                                :edgeList_3d="edgeList_3d"
                                :mst_parentchild_relation="mst_parentchild_relation"
                                :isMST="isMST"
                                :colorby="colorby"
                                :component_threshold="component_threshold"
                            />
                        </td>
                    </tr>
                    <tr v-if="isMST == false">
                        <td colspan="2">
                            <topologyVisGO
                                :graphSelectionStr="graphSelectionStr"
                                :go_info="go_info"
                            />
                        </td>
                    </tr>
                </tbody>
            </n-table>
        </div>
        <topologyGraphTable
            :graphSelectionStr="graphSelectionStr"
            :taskid="taskid"
            :graph_info="graph_info"
        />
        <topologyGoTable
            v-if="isMST == false"
            :graphSelectionStr="graphSelectionStr"
            :go_info="go_info"
            :go_original_info="go_original_info"
        />
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
import axios from 'axios'
import { AddCircleOutline as selectIcon } from '@vicons/ionicons5'
import { ref } from 'vue'
import { decrypt } from '@/utils/crypto'
import { StatusColor } from '@/utils/crustdb'
import topologyVis3D from './topology_vis_3d.vue'
import topologyVis2D from './topology_vis_2d.vue'
import topologyVisGO from './topology_vis_go.vue'
import topologyGraphTable from './topology_graph_table.vue'
import topologyGoTable from './topology_go_table.vue'

const craftsuccess = ref(true)
const logStyle = ref('h-150 bg-dark p-4 text-light')
const consoleloading = ref(false)

const route = useRoute()
const taskid = computed(() => {
    return decrypt(
        route.query?.taskid as string,
        'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2'
    )
})

const colorby = ref('componentsize')
const component_threshold = ref(5)
const max_component_threshold = ref(15)

const graphSelectionStr = ref('')
const isMST = ref(false)

const topologyselectiondata = ref([])

const nodesCoord_3d = ref({
    node_name: [],
    X: [],
    y: [],
    z: [],
    degrees: [],
    betweenness: [],
    closeness_centrality: [],
    degree_centrality: [],
    page_rank_score: [],
    component_id: [],
    component_size: [],
})
const edgeList_3d = ref()
const graph_info = ref({
    assortativity: '',
    average_branching_factor: 0,
    betweenness_centrality: '',
    closeness_centrality: 0,
    degree_centrality: 0,
    modularity: 0,
    span: 0,
})
const mst_parentchild_relation = ref()
const nodeattr_data = ref({
    node_name: [],
    X: [],
    y: [],
    z: [],
    degrees: [],
    betweenness: [],
    closeness_centrality: [],
    degree_centrality: [],
    page_rank_score: [],
    component_id: [],
    component_size: [],
})

const selectGraphTypeDialogVisible = ref(false)

const graph_type_list = ref([] as any[])

const selectGraphTypeCheckList = ref([] as any[])

const checkIsMST = () => {
    if (graphSelectionStr.value.includes('MST')) {
        isMST.value = true
        colorby.value = 'pagerankscore'
    } else {
        isMST.value = false
    }
}
const taskdata = ref({
    results: {
        id: 0,
        user_id: 0,
        is_demo_input: true,
        analysis_type: '',
        species: '',
        status: '',
        created_at: '',
        input_path: [] as any[],
    },
})

const detailsdata = ref()
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

const helper_topology_graphlist = async () => {
    const topology_list_response = await axios.get(`/tasks/vis/topology_graphlist/`, {
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
}

const helper_topology = async () => {
    const topology_response = await axios.get(`/tasks/vis/topology/`, {
        baseURL: '/api',
        timeout: 10000,
        params: {
            taskid: taskid.value,
            graph_selection_str: graphSelectionStr.value,
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
    const topology_nodeattr_response = await axios.get(`/tasks/vis/topology_nodeattr/`, {
        baseURL: '/api',
        timeout: 10000,
        params: {
            taskid: taskid.value,
            graph_selection_str: graphSelectionStr.value,
        },
    })
    const [topo_data6] = topology_nodeattr_response.data
    nodeattr_data.value = topo_data6
}

const helper_topology_go = async () => {
    const topology_go_response = await axios.get(`/tasks/vis/topology_go`, {
        baseURL: '/api',
        timeout: 10000,
        params: {
            graph_selection_str: graphSelectionStr.value,
            taskid: taskid.value,
        },
    })
    const [go_data1, go_data2] = topology_go_response.data
    go_info.value = go_data1
    go_original_info.value = go_data2
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

        helper_topology()
        selectGraphTypeCheckList.value.length = 0
        selectGraphTypeDialogVisible.value = false
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
    const response2 = await axios.get(`/tasks/detail/`, {
        baseURL: '/api',
        timeout: 10000,
        params: {
            taskid: taskid.value,
        },
    })
    taskdata.value = response2.data
    if (taskdata.value.results.status === 'Success') {
        craftsuccess.value = true
    } else if (taskdata.value.results.status === 'Failed') {
        craftsuccess.value = false
    }

    helper_topology_graphlist()
    // helper_topology()
    // setTimeout(helper_topology_nodeattr, 500)
    // setTimeout(helper_topology_go, 500)
})
watch(graphSelectionStr, async () => {
    // helper_topology_graphlist()
    helper_topology()
    setTimeout(helper_topology_nodeattr, 500)
    if (!isMST.value) {
        setTimeout(helper_topology_go, 500)
    }
})
</script>
