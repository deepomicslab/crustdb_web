<template>
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
                :single-line="false"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
// @ts-nocheck
/* eslint-disable camelcase */
import axios from 'axios'
import { reactive, ref, toRefs } from 'vue'
import { NTooltip } from 'naive-ui'

const loadtopologydata = ref(false)
const nodeattr_data = ref()

const props = defineProps<{
    graphSelectionStr: string
    taskid: string
    graph_info
}>()
const { graphSelectionStr, taskid, graph_info } = toRefs(props)

const selectGraphTypeRequest = async () => {
    loadtopologydata.value = true
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
    loadtopologydata.value = false
}

watch(taskid, () => {
    selectGraphTypeRequest()
})
watch(graphSelectionStr, () => {
    selectGraphTypeRequest()
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
            graph_selection_str: graphSelectionStr.value,
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
