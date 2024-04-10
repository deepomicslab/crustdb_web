<template>
    <div class="flex flex-col py-5 px-20">
        <div class="flex flex-row ml-1 my-7">
            <div class="text-4xl font-600">Datasets</div>
            <el-button round color="#34498E" class="ml-5 mt-2" @click="godatahelper">
                Database Helper
            </el-button>
        </div>
        <div class="flex flex-row justify-between mb-4 items-center">
            <div class="mt-1.5 ml-1 felx flex-row justify-start items-center">
                <div>
                    <el-button class="mb-1" @click="gofilter">
                        <n-icon class="mr-2">
                            <FunnelOutline />
                        </n-icon>
                        Record Filter
                    </el-button>
                </div>
            </div>

            <div class="flex flex-row justify-start">
                <div class="mt-2 text-lg">
                    <el-tooltip
                        effect="dark"
                        content="Fuzzy string search on columns (ST Platform, Species, Disease Stage, Developmental Stage, Sex, Cell Type, Slice ID)"
                        placement="top"
                        class="mt-4"
                    >
                        <el-icon class="text-base text-[#34498E]">
                            <InfoFilled />
                        </el-icon>
                    </el-tooltip>
                    Search:
                </div>
                <el-input class="w-50 ml-3" size="small" v-model="searchinput">
                    <template #append>
                        <el-button :icon="Search" @click="filtersearch" />
                    </template>
                </el-input>
                <el-button class="mt-1 ml-2" :icon="RefreshRight" circle @click="resetsearch" />
            </div>
        </div>

        <!-- navigation bar with anchor -->
        <!-- Filtering, by st_platform -->
        <div class="flex flex-row justify-between">
            <el-menu
                :default-active="datasets"
                class="el-menu-demo h-14 mt-2 w-77/100"
                mode="horizontal"
                @select="handleSelectSet"
            >
                <el-menu-item index="crustdb_main" class="text-lg">All</el-menu-item>
                <!-- <el-menu-item index="crustdb_stereo" class="text-lg">Stereo-Seq</el-menu-item>
                <el-menu-item index="crustdb_cosmx" class="text-lg">CosMx</el-menu-item>
                <el-menu-item index="crustdb_merfish" class="text-lg">Merfish</el-menu-item> -->
            </el-menu>
            <div class="flex flex-row mt-7 text-[16px] font-400">
                <div># Datasets</div>
                <div class="ml-5">{{ crust_num }}</div>
            </div>
        </div>

        <!-- main table -->
        <!-- @update:filters="handleUpdateFilter" -->
        <div v-loading="loading" class="h-420">
            <n-data-table
                :columns="columns"
                :data="datasetList"
                :row-key="rowKey"
                :scroll-x="1000"
                :max-height="1600"
                :single-line="false"
                @update:checked-row-keys="handleCheck"
                @update:sorter="handleSorterChange"
            />
        </div>

        <!-- change page button -->
        <div>
            <n-pagination
                class="mt-10 ml-130 mb-20"
                v-model:page="pagevalue"
                v-model:pageSize="pageSize"
                show-size-picker
                :default-page-size="30"
                :page-sizes="[30, 50, 100]"
                show-quick-jumper
                :item-count="count"
                @update:page="pagechange"
                @update:page-size="pagesizechange"
            >
                <template #prev>
                    <n-button @click="prevPage" v-bind:disabled="pagevalue === 1" size="small">
                        <template #icon>
                            <n-icon>
                                <ChevronBack />
                            </n-icon>
                        </template>
                    </n-button>
                </template>
                <template #next>
                    <n-button @click="nextPage" size="small">
                        <template #icon>
                            <n-icon>
                                <ChevronForward />
                            </n-icon>
                        </template>
                    </n-button>
                </template>
            </n-pagination>
        </div>
    </div>

    <el-dialog v-model="filterVisible" width="70%" height="80%" align-center>
        <div class="h-180">
            <filterview />
        </div>
    </el-dialog>
</template>

<script setup lang="ts">
/* eslint-disable camelcase */
// @ts-nocheck
import type { DataTableColumns, DataTableRowKey } from 'naive-ui'
import { h } from 'vue'
// import { NButton, NTag, NEllipsis, NTooltip } from 'naive-ui'
import { NButton, NTooltip } from 'naive-ui'
import { FunnelOutline, ChevronBack, ChevronForward } from '@vicons/ionicons5'
// import { Search, RefreshRight, ArrowDown, InfoFilled, Switch } from '@element-plus/icons-vue'
import { Search, RefreshRight, InfoFilled } from '@element-plus/icons-vue'
import _ from 'lodash'
import axios from 'axios'
import filterview from '../filter/index.vue'
// import { datasetDict, datasetList } from '@/utils/phage'
// import { celltypeDict, sexDict, devDict } from '@/utils/crustdb'

const pagevalue = ref(1)
const pageSize = ref(30)
const datasets = ref('crustdb_main')
const crust_num = ref()
const loading = ref(false)
const searchinput = ref('')

// const phagedata = useRequest(() => phageService.getPhageList(pagevalue.value, pageSize.value)).data
const phagedata = ref()

const dataseturl = ref(`/dataset/`)
const route = useRoute()

const sorter_dict = ref('')
// const filter_dict = ref('')

onBeforeMount(async () => {
    if (route.query?.dataset) {
        datasets.value = route.query?.dataset as string
        dataseturl.value = `/${route.query?.dataset}/`
    }
    loading.value = true
    const response = await axios.get(dataseturl.value, {
        baseURL: '/api',
        timeout: 100000,
        params: {
            page: pagevalue.value,
            pagesize: pageSize.value,
            search: searchinput.value,
        },
    })
    console.log('response', response)
    const { data } = response
    phagedata.value = data
    crust_num.value = phagedata.value.count
    loading.value = false
})

const datasetList = computed(() => {
    return _.map(phagedata.value?.results, (row: any) => {
        // eslint-disable-next-line
        // row.gc_content = Number(parseFloat(row.gc_content).toFixed(2))
        return row
    })
})

const count = computed(() => phagedata.value?.count)

const nextPage = async () => {
    loading.value = true
    const response = await axios.get(dataseturl.value, {
        baseURL: '/api',
        timeout: 100000,
        params: {
            page: pagevalue.value + 1,
            pagesize: pageSize.value,
            search: searchinput.value,
            sorter: sorter_dict.value,
            // filter: filter_dict.value,
        },
    })
    const { data } = response
    phagedata.value = data
    loading.value = false
}

const prevPage = async () => {
    loading.value = true
    const response = await axios.get(dataseturl.value, {
        baseURL: '/api',
        timeout: 100000,
        params: {
            page: pagevalue.value - 1,
            pagesize: pageSize.value,
            search: searchinput.value,
            sorter: sorter_dict.value,
            // filter: filter_dict.value,
        },
    })
    const { data } = response
    phagedata.value = data
    loading.value = false
}
const pagechange = async () => {
    loading.value = true
    const response = await axios.get(dataseturl.value, {
        baseURL: '/api',
        timeout: 100000,
        params: {
            page: pagevalue.value,
            pagesize: pageSize.value,
            search: searchinput.value,
            sorter: sorter_dict.value,
            // filter: filter_dict.value,
        },
    })
    const { data } = response
    phagedata.value = data
    loading.value = false
}
const pagesizechange = async () => {
    loading.value = true
    const response = await axios.get(dataseturl.value, {
        baseURL: '/api',
        timeout: 100000,
        params: {
            page: pagevalue.value,
            pagesize: pageSize.value,
            search: searchinput.value,
            sorter: sorter_dict.value,
            // filter: filter_dict.value,
        },
    })
    const { data } = response
    phagedata.value = data
    loading.value = false
}

const router = useRouter()

const filterVisible = ref(false)

const gofilter = () => {
    filterVisible.value = true
}
const detail = (row: any) => {
    // router.push({ path: '/database/phage/detail', query: { phageid: row.id } })
    router.push({
        path: '/database/crustdb_main/detail',
        query: { crustdb_main_id: row.id, details_uid: '' },
    })
}

const checkedRowKeysRef = ref<DataTableRowKey[]>([])
function handleCheck(rowKeys: DataTableRowKey[]) {
    checkedRowKeysRef.value = rowKeys
}

type RowData = {
    n_slices: number
    n_cell_types: number
    n_conformations: number
    n_cells: number
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

const filtersearch = async () => {
    loading.value = true
    dataseturl.value = 'crustdb_main/search/'
    const response = await axios.get(dataseturl.value, {
        baseURL: '/api',
        timeout: 100000,
        params: {
            page: pagevalue.value,
            pagesize: pageSize.value,
            search: searchinput.value,
        },
    })
    phagedata.value = response.data
    loading.value = false
}
const resetsearch = async () => {
    dataseturl.value = '/crustdb_main/'
    searchinput.value = ''
    loading.value = true
    const response = await axios.get(dataseturl.value, {
        baseURL: '/api',
        timeout: 100000,
        params: {
            page: pagevalue.value,
            pagesize: pageSize.value,
        },
    })
    const { data } = response
    phagedata.value = data
    loading.value = false
}

const col_width = {
    // total 2500
    doi: 70,
    n_slices: 70,
    n_cell_types: 70,
    n_conformations: 70,
    n_cells: 70,
    actions: 100,
}

const createColumns = (): DataTableColumns<RowData> => {
    return [
        // {
        //     type: 'selection',
        // },
        // id
        {
            title() {
                return renderTooltip(
                    h('div', null, { default: () => 'Publication DOI' }),
                    'Publication DOI'
                )
            },
            // fixed: 'left',
            key: 'doi',
            align: 'center',
            ellipsis: {
                tooltip: true,
            },
            width: col_width.doi,
        },
        // n_slices
        {
            title() {
                return renderTooltip(
                    h('div', null, { default: () => 'Number of Slices' }),
                    'Number of Slices'
                )
            },
            // fixed: 'left',
            key: 'n_slices',
            align: 'center',
            sorter: true,
            ellipsis: {
                tooltip: true,
            },
            width: col_width.n_slices,
        },
        // n_cell_types
        {
            title() {
                return renderTooltip(
                    h('div', null, { default: () => 'Number of Cell Types' }),
                    'Number of Cell Types'
                )
            },
            key: 'n_cell_types',
            align: 'center',
            sorter: true,
            ellipsis: {
                tooltip: true,
            },
            width: col_width.n_cell_types,
        },
        // n_conformations
        {
            title() {
                return renderTooltip(
                    h('div', null, { default: () => 'Number of Conformations' }),
                    'Number of Conformations'
                )
            },
            key: 'n_conformations',
            align: 'center',
            sorter: true,
            ellipsis: {
                tooltip: true,
            },
            width: col_width.n_conformations,
        },
        // n_cells
        {
            title() {
                return renderTooltip(
                    h('div', null, { default: () => 'Total Number of Cells' }),
                    'Total Number of Cells'
                )
            },
            key: 'n_cells',
            align: 'center',
            sorter: true,
            ellipsis: {
                tooltip: true,
            },
            width: col_width.n_cells,
        },
        // actions
        {
            title: 'Action',
            key: 'actions',
            align: 'center',
            width: col_width.actions,
            fixed: 'right',
            render(row: any) {
                return h(
                    'div',
                    {
                        style: {
                            // display: 'flex',
                            justifyContent: 'space-between',
                        },
                    },
                    [
                        h(
                            NButton,
                            {
                                strong: true,
                                size: 'small',
                                type: 'info',
                                onClick: () => detail(row),
                            },
                            { default: () => 'Publication Details' }
                        ),
                    ]
                )
            },
        },
    ]
}

const columns = createColumns()

const paginationReactive = reactive({
    page: 1,
    pageSize: 30,
    showSizePicker: true,
    pageSizes: [30, 50, 100],
    showQuickJumper: true,
    onChange: (page: number) => {
        paginationReactive.page = page
    },
})
const handleSelectSet = async (value: any) => {
    dataseturl.value = `/${value}/`

    loading.value = true
    const response = await axios.get(dataseturl.value, {
        baseURL: '/api',
        timeout: 100000,
        params: {
            page: pagevalue.value,
            pagesize: pageSize.value,
        },
    })
    const { data } = response
    phagedata.value = data
    loading.value = false
}

const handleSorterChange = async sorter => {
    // console.log('sorter', sorter)
    // sorter_columnkey.value = sorter.columnKey
    // sorter_order.value = sorter.order
    sorter_dict.value = sorter
    // dataseturl.value = '/crustdb_main/'
    searchinput.value = ''
    loading.value = true
    const response = await axios.get(dataseturl.value, {
        baseURL: '/api',
        timeout: 100000,
        params: {
            page: pagevalue.value,
            pagesize: pageSize.value,
            sorter: sorter_dict.value,
        },
    })
    const { data } = response
    phagedata.value = data
    loading.value = false
}

// const handleUpdateFilter = async filters => {
//     filter_dict.value = filters
//     // dataseturl.value = '/crustdb_main/'
//     loading.value = true
//     const response = await axios.get(dataseturl.value, {
//         baseURL: '/api',
//         timeout: 100000,
//         params: {
//             page: pagevalue.value,
//             pagesize: pageSize.value,
//             sorter: sorter_dict.value,
//             filter: filter_dict.value,
//         },
//     })
//     const { data } = response
//     phagedata.value = data
//     loading.value = false
// }

const godatahelper = () => {
    router.push({
        path: '/tutorial',
        query: { type: 'database_intro' },
    })
}
</script>

<style scoped>
:deep .n-data-table-th {
    text-align: center;
}

:deep .n-data-table-td {
    text-align: center;
}
</style>
