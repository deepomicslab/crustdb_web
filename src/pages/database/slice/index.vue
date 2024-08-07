<template>
    <div class="flex flex-col py-5 px-20">
        <div class="flex flex-row ml-1 my-7">
            <div class="text-4xl font-600">Slices</div>
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
        <!-- @select="handleSelectSet" -->
        <div class="flex flex-row justify-between">
            <el-menu
                :default-active="datasets"
                class="el-menu-demo h-14 mt-2 w-77/100"
                mode="horizontal"
            >
                <el-menu-item index="crustdb_main" class="text-lg">All</el-menu-item>
                <!-- <el-menu-item index="crustdb_stereo" class="text-lg">Stereo-seq</el-menu-item>
                <el-menu-item index="crustdb_cosmx" class="text-lg">CosMx</el-menu-item>
                <el-menu-item index="crustdb_merfish" class="text-lg">MERFISH</el-menu-item> -->
            </el-menu>
            <div class="flex flex-row mt-7 text-[16px] font-400">
                <div># Slices</div>
                <div class="ml-5">{{ crust_num }}</div>
            </div>
        </div>

        <!-- main table -->
        <div v-loading="loading" class="h-420">
            <n-data-table
                :columns="columns"
                :data="datasetList"
                :row-key="rowKey"
                :scroll-x="2400"
                :max-height="1600"
                :bordered="false"
                @update:checked-row-keys="handleCheck"
                @update:filters="handleUpdateFilter"
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
import { NButton, NTag, NTooltip } from 'naive-ui'
import { FunnelOutline, ChevronBack, ChevronForward } from '@vicons/ionicons5'
// import { Search, RefreshRight, ArrowDown, InfoFilled, Switch } from '@element-plus/icons-vue'
import { Search, RefreshRight, InfoFilled } from '@element-plus/icons-vue'
import _ from 'lodash'
import axios from 'axios'
import filterview from '../filter/index.vue'
import {
    sliceidDict,
    publicationTitleDict,
    speciesDict,
    stPlatformDict,
    diseaseStageDict,
    devDict,
    sexDict,
    SpeciesColor,
    STPlatformColor,
    DiseaseStageColor,
} from '@/utils/crustdb'

const pagevalue = ref(1)
const pageSize = ref(30)
const datasets = ref('dataset')
const crust_num = ref()
const loading = ref(false)
const searchinput = ref('')

// const phagedata = useRequest(() => phageService.getPhageList(pagevalue.value, pageSize.value)).data
const phagedata = ref()

const sliceurl = ref(`/slice/`)
const route = useRoute()

const sorter_dict = ref('')
const filter_dict = ref('')

onBeforeMount(async () => {
    if (route.query?.dataset) {
        datasets.value = route.query?.dataset as string
        sliceurl.value = `/${route.query?.dataset}/`
    }
    loading.value = true
    const response = await axios.get(sliceurl.value, {
        baseURL: '/api',
        timeout: 100000,
        params: {
            page: pagevalue.value,
            pagesize: pageSize.value,
            search: searchinput.value,
        },
    })
    const { data } = response
    // console.log('====================== response', response)
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
    const response = await axios.get(sliceurl.value, {
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
    const response = await axios.get(sliceurl.value, {
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
    const response = await axios.get(sliceurl.value, {
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
    const response = await axios.get(sliceurl.value, {
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
    router.push({
        path: '/database/slice/detail',
        query: { id: row.id },
    })
}
const publication = (row: any) => {
    console.log(row)
    router.push({
        path: '/database/dataset/detail',
        query: { id: row.publication_id },
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
    sliceurl.value = 'dataset/search/'
    const response = await axios.get(sliceurl.value, {
        baseURL: '/api',
        timeout: 100000,
        params: {
            page: pagevalue.value,
            pagesize: pageSize.value,
            search: searchinput.value,
        },
    })
    phagedata.value = response.data
    sliceurl.value = 'dataset/'
    loading.value = false
}
const resetsearch = async () => {
    searchinput.value = ''
    loading.value = true
    const response = await axios.get(sliceurl.value, {
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
    slice_id: 170,
    publication_title: 100,
    species: 140,
    st_platform: 100,
    disease_stage: 100,
    developmental_stage: 100,
    sex: 70,
    n_cell_types: 90,
    n_conformations: 90,
    n_cells: 90,
    actions: 140,
}

const createColumns = (): DataTableColumns<RowData> => {
    return [
        // {
        //     type: 'selection',
        // },
        // id
        {
            title() {
                return renderTooltip(h('div', null, { default: () => 'Slice ID' }), 'Slice ID')
            },
            key: 'slice_id',
            align: 'center',
            ellipsis: {
                tooltip: true,
            },
            width: col_width.slice_id,
            filterOptions: sliceidDict,
            filter: true,
        },
        // publication_title
        {
            title() {
                return renderTooltip(
                    h('div', null, { default: () => 'Publication Title' }),
                    'Publication Title'
                )
            },
            key: 'publication_title',
            align: 'center',
            ellipsis: {
                tooltip: true,
            },
            width: col_width.publication_title,
            resizable: true,
            filterOptions: publicationTitleDict,
            filter: true,
        },
        // species
        {
            title() {
                return renderTooltip(h('div', null, { default: () => 'Species' }), 'Species')
            },
            key: 'species',
            align: 'center',
            ellipsis: {
                tooltip: true,
            },
            width: col_width.species,
            render(row: any) {
                return h('div', {}, [
                    h(
                        NTag,
                        {
                            type: SpeciesColor(row.species),
                            size: 'small',
                        },
                        {
                            default: () => row.species,
                        }
                    ),
                ])
            },
            filterOptions: speciesDict,
            filter: true,
        },
        // st_platform
        {
            title() {
                return renderTooltip(
                    h('div', null, { default: () => 'ST Platform' }),
                    'st_platform'
                )
            },
            key: 'st_platform',
            align: 'center',
            ellipsis: {
                tooltip: true,
            },
            width: col_width.st_platform,
            filterOptions: stPlatformDict,
            filter: true,
            render(row: any) {
                return h('div', {}, [
                    h(
                        NTag,
                        {
                            type: STPlatformColor(row.st_platform),
                            size: 'small',
                        },
                        {
                            default: () => row.st_platform,
                        }
                    ),
                ])
            },
        },
        // disease_stage
        {
            title() {
                return renderTooltip(
                    h('div', null, { default: () => 'Disease Stage' }),
                    'disease_stage'
                )
            },
            key: 'disease_stage',
            align: 'center',
            ellipsis: {
                tooltip: true,
            },
            width: col_width.disease_stage,
            filterOptions: diseaseStageDict,
            filter: true,
            render(row: any) {
                return h('div', {}, [
                    h(
                        NTag,
                        {
                            type: DiseaseStageColor(row.disease_stage),
                            size: 'small',
                        },
                        {
                            default: () => row.disease_stage,
                        }
                    ),
                ])
            },
        },
        // developmental_stage
        {
            title() {
                return renderTooltip(
                    h('div', null, { default: () => 'Developmental Stage' }),
                    'developmental_stage'
                )
            },
            key: 'developmental_stage',
            align: 'center',
            ellipsis: {
                tooltip: true,
            },
            width: col_width.developmental_stage,
            filterOptions: devDict,
            filter: true,
        },
        // sex
        {
            title() {
                return renderTooltip(h('div', null, { default: () => 'Sex' }), 'sex')
            },
            key: 'sex',
            align: 'center',
            ellipsis: {
                tooltip: true,
            },
            width: col_width.sex,
            filterOptions: sexDict,
            filter: true,
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
                            display: 'flex',
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
                            { default: () => 'Slice Details' }
                        ),
                        h(
                            NButton,
                            {
                                strong: true,
                                size: 'small',
                                type: 'info',
                                onClick: () => publication(row),
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

const handleSorterChange = async sorter => {
    sorter_dict.value = sorter
    searchinput.value = ''
    loading.value = true
    const response = await axios.get(sliceurl.value, {
        baseURL: '/api',
        timeout: 100000,
        params: {
            page: pagevalue.value,
            pagesize: pageSize.value,
            sorter: sorter_dict.value,
            filter: filter_dict.value,
        },
    })
    const { data } = response
    phagedata.value = data
    loading.value = false
}

const handleUpdateFilter = async filters => {
    filter_dict.value = filters
    loading.value = true
    const response = await axios.get(sliceurl.value, {
        baseURL: '/api',
        timeout: 100000,
        params: {
            page: pagevalue.value,
            pagesize: pageSize.value,
            sorter: sorter_dict.value,
            filter: filter_dict.value,
        },
    })
    const { data } = response
    phagedata.value = data
    loading.value = false
}

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
