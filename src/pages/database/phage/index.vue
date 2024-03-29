<template>
    <div class="flex flex-col py-5 px-20">
        <div class="flex flex-row ml-1 my-7">
            <div class="text-4xl font-600">Phage Information</div>
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
                        Sequence Filter
                    </el-button>

                    <el-dropdown class="mx-4">
                        <el-button>
                            <template #icon>
                                <n-icon>
                                    <downicon />
                                </n-icon>
                            </template>
                            Download Sequence
                            <el-icon class="el-icon--right"><arrow-down /></el-icon>
                        </el-button>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item @click="downloadall" v-if="false">
                                    All Data
                                </el-dropdown-item>
                                <el-dropdown-item @click="downloadselected">
                                    Selected Data
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>

                    <el-select
                        v-model="showredundancy"
                        placeholder="Select show redundancy"
                        class="mb-1"
                        @change="redundchange"
                    >
                        <template #prefix>
                            <el-icon>
                                <Switch />
                            </el-icon>
                        </template>
                        <el-option
                            v-for="item in redundancyoptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </div>
            </div>

            <div class="flex flex-row justify-start">
                <div class="mt-2 text-lg">
                    <el-tooltip
                        effect="dark"
                        content="Fuzzy Search on Phage ID, Taxonomy, Host, Lifestyle, Completeness, Clusters and Subclusters columns"
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
        <div class="flex flex-row justify-between">
            <el-menu
                :default-active="datasets"
                class="el-menu-demo h-14 mt-2 w-77/100"
                mode="horizontal"
                @select="handleSelectSet"
            >
                <el-menu-item index="phage" class="text-lg">All</el-menu-item>
                <!-- <el-menu-item index="phage_NCBI">NCBI</el-menu-item> -->
                <el-menu-item index="phage_RefSeq" class="text-lg">RefSeq</el-menu-item>
                <el-menu-item index="phage_Genbank" class="text-lg">Genbank</el-menu-item>
                <el-menu-item index="phage_EMBL" class="text-lg">EMBL</el-menu-item>
                <el-menu-item index="phage_DDBJ" class="text-lg">DDBJ</el-menu-item>
                <el-menu-item index="phage_PhagesDB" class="text-lg">PhagesDB</el-menu-item>
                <el-menu-item index="phage_GVD" class="text-lg">GVD</el-menu-item>
                <el-menu-item index="phage_GPD" class="text-lg">GPD</el-menu-item>
                <el-menu-item index="phage_MGV" class="text-lg">MGV</el-menu-item>
                <el-menu-item index="phage_TemPhD" class="text-lg">TemPhD</el-menu-item>
                <el-menu-item index="phage_CHVD" class="text-lg">CHVD</el-menu-item>
                <el-menu-item index="phage_IGVD" class="text-lg">IGVD</el-menu-item>
                <el-menu-item index="phage_IMG_VR" class="text-lg">IMG VR</el-menu-item>
                <el-menu-item index="phage_GOV2" class="text-lg">GOV2</el-menu-item>
                <el-menu-item index="phage_STV" class="text-lg">STV</el-menu-item>
            </el-menu>
            <div class="flex flex-row mt-7 text-[16px] font-400">
                <div># Phage Sequences</div>
                <div class="ml-5">{{ seqnum }}</div>
            </div>
        </div>

        <!-- main table -->
        <div v-loading="loading" class="h-420">
            <n-data-table
                :columns="columns"
                :data="phageList"
                :row-key="rowKey"
                :scroll-x="1900"
                :max-height="1600"
                @update:checked-row-keys="handleCheck"
                @update:filters="handleUpdateFilter"
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

    <el-dialog
        v-model="downloaddialogVisible"
        title="Select download data type"
        width="30%"
        align-center
    >
        <div>
            <el-checkbox-group v-model="checkList" :max="1">
                <el-checkbox label="Download FASTA Data" />
                <!-- <el-checkbox label="Download GBK Data" /> -->
                <el-checkbox label="Download GFF3 Data" />
                <el-checkbox label="Download Meta Data" />
            </el-checkbox-group>
        </div>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="downloaddialogVisible = false">Cancel</el-button>
                <el-button type="primary" @click="downloadrequest">Download</el-button>
            </span>
        </template>
    </el-dialog>
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
import { NButton, NTag, NEllipsis, NTooltip } from 'naive-ui'
import {
    FunnelOutline,
    ChevronBack,
    ChevronForward,
    CloudDownloadOutline as downicon,
} from '@vicons/ionicons5'
import { Search, RefreshRight, ArrowDown, InfoFilled, Switch } from '@element-plus/icons-vue'
import _ from 'lodash'
import axios from 'axios'
import filterview from '../filter/index.vue'
import { datasetDict, datasetList } from '@/utils/phage'

const showredundancy = ref('Show Redundancy')
const pagevalue = ref(1)
const pageSize = ref(30)
const datasets = ref('phage')
const seqnum = ref('873,718')
const loading = ref(false)
const searchinput = ref('')

// const phagedata = useRequest(() => phageService.getPhageList(pagevalue.value, pageSize.value)).data
const phagedata = ref()

const phageurl = ref(`/phage/`)
const route = useRoute()
const redundancyoptions = [
    {
        value: 'Show Redundancy',
        label: 'Show Redundancy',
    },
    {
        value: 'Hide Redundancy',
        label: 'Hide Redundancy',
    },
]

onBeforeMount(async () => {
    if (route.query?.dataset) {
        datasets.value = route.query?.dataset as string
        phageurl.value = `/${route.query?.dataset}/`
    }
    loading.value = true
    const response = await axios.get(phageurl.value, {
        baseURL: '/api',
        timeout: 100000,
        params: {
            page: pagevalue.value,
            pagesize: pageSize.value,
            search: searchinput.value,
        },
    })
    const { data } = response
    phagedata.value = data
    loading.value = false
})

const phageList = computed(() => {
    return _.map(phagedata.value?.results, (row: any) => {
        // eslint-disable-next-line
        row.gc_content = Number(parseFloat(row.gc_content).toFixed(2))
        return row
    })
})

const count = computed(() => phagedata.value?.count)

const nextPage = async () => {
    loading.value = true
    const response = await axios.get(phageurl.value, {
        baseURL: '/api',
        timeout: 100000,
        params: {
            page: pagevalue.value + 1,
            pagesize: pageSize.value,
            search: searchinput.value,
        },
    })
    const { data } = response
    phagedata.value = data
    loading.value = false
}

const prevPage = async () => {
    loading.value = true
    const response = await axios.get(phageurl.value, {
        baseURL: '/api',
        timeout: 100000,
        params: {
            page: pagevalue.value - 1,
            pagesize: pageSize.value,
            search: searchinput.value,
        },
    })
    const { data } = response
    phagedata.value = data
    loading.value = false
}
const pagechange = async () => {
    loading.value = true
    const response = await axios.get(phageurl.value, {
        baseURL: '/api',
        timeout: 100000,
        params: {
            page: pagevalue.value,
            pagesize: pageSize.value,
            search: searchinput.value,
        },
    })
    const { data } = response
    phagedata.value = data
    loading.value = false
}
const pagesizechange = async () => {
    loading.value = true
    const response = await axios.get(phageurl.value, {
        baseURL: '/api',
        timeout: 100000,
        params: {
            page: pagevalue.value,
            pagesize: pageSize.value,
            search: searchinput.value,
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
    router.push({ path: '/database/phage/detail', query: { phageid: row.id } })
}

const downloaddialogVisible = ref(false)
const downloadtype = ref('')
const checkList = ref([] as any[])
const checkedRowKeysRef = ref<DataTableRowKey[]>([])
function handleCheck(rowKeys: DataTableRowKey[]) {
    checkedRowKeysRef.value = rowKeys
}

const downloadrequest = async () => {
    if (checkList.value.length === 0) {
        window.$message.warning('Please select download data type', {
            closable: true,
            duration: 5000,
        })
    } else if (downloadtype.value === 'selected') {
        if (checkList.value.includes('Download FASTA Data')) {
            window.open(`/api/phage/fasta/?phageids=${checkedRowKeysRef.value}`, '_blank')
        }
        if (checkList.value.includes('Download GFF3 Data')) {
            console.log('88888')
            window.open(`/api/phage/gff/?phageids=${checkedRowKeysRef.value}`, '_blank')
        }
        if (checkList.value.includes('Download GBK Data')) {
            window.open(`/api/phage/gbk/?phageids=${checkedRowKeysRef.value}`, '_blank')
        }
        if (checkList.value.includes('Download Meta Data')) {
            window.open(`/api/phage/meta/?phageids=${checkedRowKeysRef.value}`, '_blank')
        }
    } else if (downloadtype.value === 'single') {
        if (checkList.value.includes('Download Meta Data')) {
            window.open(`/api/phage/meta/?phageid=${checkedRowKeysRef.value[0]}`, '_blank')
        }
        if (checkList.value.includes('Download FASTA Data')) {
            window.open(`/api/phage/fasta/?phageid=${checkedRowKeysRef.value[0]}`, '_blank')
        }
        if (checkList.value.includes('Download GFF3 Data')) {
            window.open(`/api/phage/gff/?phageid=${checkedRowKeysRef.value[0]}`, '_blank')
        }
        if (checkList.value.includes('Download GBK Data')) {
            window.open(`/api/phage/gbk/?phageid=${checkedRowKeysRef.value[0]}`, '_blank')
        }
    } else {
        if (checkList.value.includes('Download Meta Data')) {
            window.open(`/api/phage/meta/`, '_blank')
        }
        if (checkList.value.includes('Download FASTA Data')) {
            window.open(`/api/phage/fasta/`, '_blank')
        }
        if (checkList.value.includes('Download GFF3 Data')) {
            window.open(`/api/phage/gff/`, '_blank')
        }
        if (checkList.value.includes('Download GBK Data')) {
            window.open(`/api/phage/gbk/`, '_blank')
        }
    }
}
const downloadselected = () => {
    if (checkedRowKeysRef.value.length === 0) {
        window.$message.warning('Please select data', {
            closable: true,
            duration: 5000,
        })
    } else {
        downloaddialogVisible.value = true
        downloadtype.value = 'selected'
    }
}
const downloadall = () => {
    downloaddialogVisible.value = true
    downloadtype.value = 'all'
}
const download = (row: any) => {
    downloadtype.value = 'single'
    downloaddialogVisible.value = true
    checkedRowKeysRef.value = [row.id]
}

type RowData = {
    id: number
    Acession_ID: string
    Data_Sets: string
    length: string
    gc_content: any
    host: string
    completeness: string
    taxonomy: string
    cluster: string
    subcluster: string
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
const complete = (comp: any) => {
    if (comp === 'Medium-quality') {
        return 'info'
    }
    if (comp === 'High-quality') {
        return 'success'
    }
    if (comp === 'Low-quality') {
        return 'warning'
    }
    if (comp === 'Complete') {
        return 'success'
    }
    return 'warning'
}
const lifestyleColor = (style: any) => {
    if (style === 'virulent') {
        return 'error'
    }
    return 'info'
}

const filtersearch = async () => {
    loading.value = true
    phageurl.value = 'phage/search/'
    const response = await axios.get(phageurl.value, {
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
    phageurl.value = '/phage/'
    searchinput.value = ''
    loading.value = true
    const response = await axios.get(phageurl.value, {
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

const createColumns = (): DataTableColumns<RowData> => {
    return [
        {
            type: 'selection',
        },
        {
            title() {
                return renderTooltip(h('div', null, { default: () => 'Phage ID' }), 'phage ID')
            },
            key: 'Acession_ID',
            align: 'center',
            fixed: 'left',
            width: 125,
            render(row: any) {
                return h('div', null, [
                    h(
                        NButton,
                        {
                            type: 'info',
                            text: true,
                            size: 'small',
                            style: { width: '100px' },
                            onClick: () => {
                                window.open(`${row.reference}`)
                            },
                        },
                        [
                            h(NEllipsis, null, {
                                default: () => {
                                    return row.Acession_ID
                                },
                            }),
                        ]
                    ),
                ])
            },
        },
        {
            title() {
                return renderTooltip(
                    h('div', null, { default: () => 'Data Source' }),
                    'phage source dataset'
                )
            },
            key: 'Data_Sets',
            align: 'center',
            width: 110,
            filterOptions: datasetDict,
            filter(value: any, row: any) {
                return row.Data_Sets === value
            },
            render(row: any) {
                return h('div', { style: { width: '100px' } }, [
                    h(
                        NTag,
                        {
                            type: 'info',
                            size: 'small',
                            round: true,
                        },
                        {
                            default: () => {
                                return datasetList[row.Data_Sets - 1]
                            },
                        }
                    ),
                ])
            },
        },
        {
            title() {
                return renderTooltip(
                    h('div', null, { default: () => 'Taxonomy' }),
                    'phage taxonomy'
                )
            },
            key: 'taxonomy',
            align: 'center',
            ellipsis: {
                tooltip: true,
            },
            width: 95,
        },

        {
            title() {
                return renderTooltip(
                    h('div', null, { default: () => 'Host' }),
                    'phage host taxonomy'
                )
            },
            key: 'host',
            align: 'center',
            width: 180,
            ellipsis: {
                tooltip: true,
            },
            render(row: any) {
                return h('div', {}, [
                    h(
                        NButton,
                        {
                            type: 'info',
                            text: true,
                            size: 'small',
                            onClick: () => {
                                router.push({
                                    path: `/database/host/list`,
                                    query: {
                                        rank: 'host',
                                        node: row.host,
                                    },
                                })
                            },
                        },
                        {
                            default: () => {
                                return row.host
                            },
                        }
                    ),
                ])
            },
        },
        {
            title() {
                return renderTooltip(
                    h('div', null, { default: () => 'Lifestyle' }),
                    'phage lifestyle'
                )
            },
            key: 'lifestyle',
            align: 'center',
            width: 100,
            ellipsis: {
                tooltip: true,
            },
            filterOptions: [
                {
                    label: 'Virulent',
                    value: 'virulent',
                },
                {
                    label: 'Temperate',
                    value: 'temperate',
                },
            ],
            filter(value: any, row: any) {
                return row.lifestyle === value
            },
            render(row: any) {
                return h('div', {}, [
                    h(
                        NTag,
                        {
                            type: lifestyleColor(row.lifestyle),
                            size: 'small',
                        },
                        {
                            default: () => row.lifestyle,
                        }
                    ),
                ])
            },
        },
        {
            title() {
                return renderTooltip(
                    h('div', null, { default: () => 'Completeness' }),
                    'genome completeness'
                )
            },
            key: 'completeness',
            align: 'center',
            width: 140,
            filterOptions: [
                {
                    label: 'Medium-quality',
                    value: 'Medium-quality',
                },
                {
                    label: 'High-quality',
                    value: 'High-quality',
                },
                {
                    label: 'Low-quality',
                    value: 'Low-quality',
                },
                {
                    label: 'Complete',
                    value: 'Complete',
                },
                {
                    label: 'Not-determined',
                    value: 'Not-determined',
                },
            ],
            filter(value: any, row: any) {
                return row.completeness === value
            },
            render(row: any) {
                return h('div', {}, [
                    h(
                        NTag,
                        {
                            type: complete(row.completeness),
                            size: 'small',
                        },
                        {
                            default: () => row.completeness,
                        }
                    ),
                ])
            },
        },
        {
            title() {
                return renderTooltip(
                    h('div', null, { default: () => 'Genome Length (bp)' }),
                    'phage genome length'
                )
            },
            key: 'length',
            sorter: 'default',
            align: 'center',
            width: 90,
        },
        {
            title() {
                return renderTooltip(
                    h('div', null, { default: () => 'GC Content (%)' }),
                    'phage GC content'
                )
            },
            key: 'gc_content',
            sorter: 'default',
            align: 'center',
            width: 90,
        },
        {
            title() {
                return renderTooltip(h('div', null, { default: () => 'Clusters' }), 'cluster ID')
            },
            key: 'cluster',
            align: 'center',
            ellipsis: {
                tooltip: true,
            },
            width: 110,
            // render(row: any) {
            //     return h('div', {}, [
            //         h(
            //             NButton,
            //             {
            //                 type: 'info',
            //                 text: true,
            //                 size: 'small',
            //                 onClick: async () => {
            //                     const response = await axios.get(`/cluster/detail`, {
            //                         baseURL: '/api',
            //                         timeout: 10000,
            //                         params: {
            //                             clusterid: row.cluster,
            //                         },
            //                     })
            //                     const { id } = response.data
            //                     router.push({
            //                         path: '/database/cluster/detail',
            //                         query: { clusterid: id },
            //                     })
            //                 },
            //             },
            //             {
            //                 default: () => {
            //                     return row.cluster
            //                 },
            //             }
            //         ),
            //     ])
            // },
        },
        {
            title() {
                return renderTooltip(
                    h('div', null, { default: () => 'Subclusters' }),
                    'subcluster ID'
                )
            },
            key: 'subcluster',
            align: 'center',
            ellipsis: {
                tooltip: true,
            },
            width: 110,
        },
        {
            title: 'Action',
            key: 'actions',
            align: 'center',
            width: 150,
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
                            { default: () => 'Detail' }
                        ),
                        h(
                            NButton,
                            {
                                strong: true,
                                size: 'small',
                                type: 'primary',
                                onClick: () => download(row),
                            },
                            {
                                default: () => 'Download',
                            }
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
    phageurl.value = `/${value}/`

    loading.value = true
    const response = await axios.get(phageurl.value, {
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

const godatahelper = () => {
    router.push({
        path: '/tutorial',
        query: { type: 'database_intro' },
    })
}

const redundchange = async () => {
    loading.value = true
    const response = await axios.get(phageurl.value, {
        baseURL: '/api',
        timeout: 100000,
        params: {
            page: pagevalue.value,
            pagesize: pageSize.value,
        },
    })
    if (showredundancy.value === 'Show Redundancy') {
        seqnum.value = '873,718'
    } else {
        seqnum.value = '767,797'
    }
    const { data } = response
    phagedata.value = data
    loading.value = false
}
</script>
