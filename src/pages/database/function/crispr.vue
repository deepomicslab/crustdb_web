<template>
    <div class="h-680 flex flex-col py-5 px-20">
        <div class="flex flex-row ml-1 my-7">
            <div class="text-4xl font-600">CRISPR Arrays Information</div>
            <el-button round color="#34498E" class="ml-5 mt-2" @click="godatahelper">
                Database Helper
            </el-button>
        </div>
        <div class="flex flex-row justify-between mb-4">
            <div class="mt-1.5 ml-1 felx flex-row justify-start items-center">
                <el-button class="mb-1" @click="gofilter">
                    <n-icon class="mr-2"><FunnelOutline /></n-icon>
                    Sequence Filter
                </el-button>
            </div>
        </div>

        <div v-loading="loading" class="h-420">
            <n-data-table :columns="columns" :data="phageList" :max-height="1600" />
        </div>
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
                            <n-icon><ChevronBack /></n-icon>
                        </template>
                    </n-button>
                </template>
                <template #next>
                    <n-button @click="nextPage" size="small">
                        <template #icon>
                            <n-icon><ChevronForward /></n-icon>
                        </template>
                    </n-button>
                </template>
            </n-pagination>
        </div>
    </div>
    <el-dialog v-model="crisprVisible" title="CRISPR Arrays" width="80%">
        <el-descriptions class="w-330 text-lg" :column="2" size="large" border>
            <el-descriptions-item>
                <template #label>
                    <div class="cell-item">ID</div>
                </template>
                {{ crisprInfo.id }}
            </el-descriptions-item>
            <el-descriptions-item>
                <template #label>
                    <div class="cell-item">Strain</div>
                </template>
                {{ crisprInfo.Strain }}
            </el-descriptions-item>
            <el-descriptions-item>
                <template #label>
                    <div class="cell-item">Phage ID</div>
                </template>
                {{ crisprInfo.Phage_id }}
            </el-descriptions-item>
            <el-descriptions-item>
                <template #label>
                    <div class="cell-item">Sequence Basename</div>
                </template>
                {{ crisprInfo.Sequence_basename }}
            </el-descriptions-item>
            <el-descriptions-item>
                <template #label>
                    <div class="cell-item">Duplicated Spacers</div>
                </template>
                {{ crisprInfo.Duplicated_Spacers }}
            </el-descriptions-item>
            <el-descriptions-item>
                <template #label>
                    <div class="cell-item">CRISPR ID</div>
                </template>
                {{ crisprInfo.CRISPR_Id }}
            </el-descriptions-item>
            <el-descriptions-item>
                <template #label>
                    <div class="cell-item">CRISPR Start</div>
                </template>
                {{ crisprInfo.CRISPR_Start }}
            </el-descriptions-item>
            <el-descriptions-item>
                <template #label>
                    <div class="cell-item">CRISPR End</div>
                </template>
                {{ crisprInfo.CRISPR_End }}
            </el-descriptions-item>
            <el-descriptions-item>
                <template #label>
                    <div class="cell-item">CRISPR Length</div>
                </template>
                {{ crisprInfo.CRISPR_Length }}
            </el-descriptions-item>
            <el-descriptions-item>
                <template #label>
                    <div class="cell-item">Potential Orientation AT</div>
                </template>
                {{ crisprInfo.Potential_Orientation_AT }}
            </el-descriptions-item>
            <el-descriptions-item>
                <template #label>
                    <div class="cell-item">CRISPRDirection</div>
                </template>
                {{ crisprInfo.CRISPRDirection }}
            </el-descriptions-item>
            <el-descriptions-item>
                <template #label>
                    <div class="cell-item">Consensus Repeat</div>
                </template>
                {{ crisprInfo.Consensus_Repeat }}
            </el-descriptions-item>
            <el-descriptions-item>
                <template #label>
                    <div class="cell-item">Repeat ID CRISPRdb</div>
                </template>
                {{ crisprInfo.Repeat_ID_CRISPRdb }}
            </el-descriptions-item>
            <el-descriptions-item>
                <template #label>
                    <div class="cell-item">Nb CRISPRs with same Repeat</div>
                </template>
                {{ crisprInfo.Nb_CRISPRs_with_same_Repeat_CRISPRdb }}
            </el-descriptions-item>
            <el-descriptions-item>
                <template #label>
                    <div class="cell-item">Repeat Length</div>
                </template>
                {{ crisprInfo.Repeat_Length }}
            </el-descriptions-item>
            <el-descriptions-item>
                <template #label>
                    <div class="cell-item">Spacers Nb</div>
                </template>
                {{ crisprInfo.Spacers_Nb }}
            </el-descriptions-item>
            <el-descriptions-item>
                <template #label>
                    <div class="cell-item">Mean size Spacers</div>
                </template>
                {{ crisprInfo.Mean_size_Spacers }}
            </el-descriptions-item>
            <el-descriptions-item>
                <template #label>
                    <div class="cell-item">Standard Deviation Spacers</div>
                </template>
                {{ crisprInfo.Standard_Deviation_Spacers }}
            </el-descriptions-item>
            <el-descriptions-item>
                <template #label>
                    <div class="cell-item">Nb Repeats matching Consensus</div>
                </template>
                {{ crisprInfo.Nb_Repeats_matching_Consensus }}
            </el-descriptions-item>
            <el-descriptions-item>
                <template #label>
                    <div class="cell-item">Ratio Repeats match TotalRepeat</div>
                </template>
                {{ crisprInfo.Ratio_Repeats_match_TotalRepeat }}
            </el-descriptions-item>
            <el-descriptions-item>
                <template #label>
                    <div class="cell-item">Consensus Repeat length</div>
                </template>
                {{ crisprInfo.Conservation_Repeats_identity }}
            </el-descriptions-item>
            <el-descriptions-item>
                <template #label>
                    <div class="cell-item">Evidence Level</div>
                </template>
                {{ crisprInfo.Evidence_Level }}
            </el-descriptions-item>
        </el-descriptions>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="downloadsequence" type="primary">Download Sequence</el-button>
                <el-button @click="crisprVisible = false">Cancel</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
/* eslint-disable camelcase */
import type { DataTableColumns } from 'naive-ui'
import { h } from 'vue'
import { NButton, NTag, NTooltip } from 'naive-ui'
import axios from 'axios'
import { FunnelOutline, ChevronBack, ChevronForward } from '@vicons/ionicons5'
import _ from 'lodash'

const crisprVisible = ref(false)
const pagevalue = ref(1)
const pageSize = ref(30)

const loading = ref(false)

const crisprdata = ref()

onBeforeMount(async () => {
    loading.value = true
    loading.value = true
    const response = await axios.get(`/crispr/`, {
        baseURL: '/api',
        timeout: 100000,
    })
    crisprdata.value = response.data
    loading.value = false
})

const phageList = computed(() => {
    return _.map(crisprdata.value?.results, (row: any) => {
        // eslint-disable-next-line
        row.CRISPR_Start=Number(row.CRISPR_Start)
        // eslint-disable-next-line
        row.CRISPR_End = Number(row.CRISPR_End)
        // eslint-disable-next-line
        row.CRISPR_Length = Number(row.CRISPR_Length)
        return row
    })
})

const count = computed(() => crisprdata.value?.count)
const nextPage = async () => {
    loading.value = true
    const response = await axios.get(`/crispr/`, {
        baseURL: '/api',
        timeout: 100000,
        params: {
            page: pagevalue.value + 1,
            pagesize: pageSize.value,
        },
    })
    const { data } = response
    crisprdata.value = data
    loading.value = false
}
const prevPage = async () => {
    loading.value = true
    const response = await axios.get(`/crispr/`, {
        baseURL: '/api',
        timeout: 100000,
        params: {
            page: pagevalue.value - 1,
            pagesize: pageSize.value,
        },
    })
    const { data } = response
    crisprdata.value = data
    loading.value = false
}

const pagechange = async () => {
    loading.value = true
    const response = await axios.get(`/crispr/`, {
        baseURL: '/api',
        timeout: 100000,
        params: {
            page: pagevalue.value,
            pagesize: pageSize.value,
        },
    })
    const { data } = response
    crisprdata.value = data
    loading.value = false
}
const pagesizechange = async () => {
    loading.value = true
    const response = await axios.get(`/crispr/`, {
        baseURL: '/api',
        timeout: 100000,
        params: {
            page: pagevalue.value,
            pagesize: pageSize.value,
        },
    })
    const { data } = response
    crisprdata.value = data
    loading.value = false
}

const router = useRouter()
const gofilter = () => {
    router.push({ path: '/database/filter' })
}
const renderTooltip = (trigger: any, content: any) => {
    return h(NTooltip, null, {
        trigger: () => trigger,
        default: () => content,
    })
}
const crisprInfo = ref({
    id: '',
    Strain: '',
    Phage_id: '',
    Sequence_basename: '',
    Duplicated_Spacers: '',
    CRISPR_Id: '',
    CRISPR_Start: '',
    CRISPR_End: '',
    CRISPR_Length: '',
    Potential_Orientation_AT: '',
    CRISPRDirection: '',
    Consensus_Repeat: '',
    Repeat_ID_CRISPRdb: '',
    Nb_CRISPRs_with_same_Repeat_CRISPRdb: '',
    Repeat_Length: '',
    Spacers_Nb: '',
    Mean_size_Spacers: '',
    Standard_Deviation_Spacers: '',
    Nb_Repeats_matching_Consensus: '',
    Ratio_Repeats_match_TotalRepeat: '',
    Conservation_Repeats_identity: '',
    EBcons_Repeats: '',
    Conservation_Spacers_identity: '',
    EBcons_Spacers: '',
    Repeat_Length_plus_mean_size_Spacers: '',
    Ratio_Repeat_mean_Spacers_Length: '',
    CRISPR_found_in_DB_if_sequence_IDs_are_similar: '',
    Evidence_Level: '',
})
const complete = (comp: any) => {
    if (comp === '2') {
        return 'info'
    }
    if (comp === '4') {
        return 'success'
    }
    if (comp === '1') {
        return 'warning'
    }
    if (comp === '3') {
        return 'success'
    }
    return 'warning'
}
type crisprRowData = {
    ID: number
    Phage_id: string
    Duplicated_Spacers: string
    CRISPR_Id: string
    CRISPR_Start: string
    CRISPR_End: string
    CRISPR_Length: string
}
const createColumns = (): DataTableColumns<crisprRowData> => [
    {
        title: 'ID',
        key: 'id',
        align: 'center',
        sorter: 'default',
        defaultSortOrder: 'ascend',
        fixed: 'left',
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'Phage ID' }), 'phage ID')
        },
        key: 'Phage_id',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        render(row: any) {
            return h('div', { style: { width: '130px' } }, [
                h(
                    NButton,
                    {
                        type: 'info',
                        text: true,
                        size: 'small',
                        onClick: async () => {
                            const response = await axios.get(`/phage/detail`, {
                                baseURL: '/api',
                                timeout: 10000,
                                params: {
                                    accid: row.Phage_id,
                                },
                            })
                            const phageid = response.data.id
                            router.push({
                                path: '/database/phage/detail',
                                query: { phageid },
                            })
                        },
                    },
                    {
                        default: () => {
                            return row.Phage_id
                        },
                    }
                ),
            ])
        },
    },
    // {
    //     title: 'Duplicated Spacers',
    //     key: 'Duplicated_Spacers',
    //     align: 'center',
    //     sorter: 'default',
    // },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'CRISPR ID' }), 'CRISPR ID')
        },
        key: 'CRISPR_Id',
        align: 'center',
        sorter: 'default',
        ellipsis: {
            tooltip: true,
        },
    },
    {
        title() {
            return renderTooltip(
                h('div', null, { default: () => 'CRISPR Start' }),
                'CRISPR start site on the genome'
            )
        },
        key: 'CRISPR_Start',
        align: 'center',
        sorter: 'default',
    },
    {
        title() {
            return renderTooltip(
                h('div', null, { default: () => 'CRISPR End' }),
                'CRISPR stop site on the genome'
            )
        },
        key: 'CRISPR_End',
        align: 'center',
        sorter: 'default',
    },
    {
        title() {
            return renderTooltip(
                h('div', null, { default: () => 'CRISPR Length' }),
                'length of CRISPR array'
            )
        },
        key: 'CRISPR_Length',
        align: 'center',
        sorter: 'default',
    },
    {
        title() {
            return renderTooltip(
                h('div', null, { default: () => 'Potential Orientation' }),
                'potential orientation of the CRISPR array'
            )
        },
        key: 'Potential_Orientation_AT',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
    },
    {
        title() {
            return renderTooltip(
                h('div', null, { default: () => 'Repeat Length' }),
                'length of the repeat'
            )
        },
        key: 'Repeat_Length',
        align: 'center',
    },
    {
        title() {
            return renderTooltip(
                h('div', null, { default: () => 'Spacers Nb' }),
                'number of the spacers'
            )
        },
        key: 'Spacers_Nb',
        align: 'center',
    },
    {
        title() {
            return renderTooltip(
                h('div', null, { default: () => 'Mean size Spacers' }),
                'averaged size of the spacers'
            )
        },
        key: 'Mean_size_Spacers',
        align: 'center',
    },
    {
        title() {
            return renderTooltip(
                h('div', null, { default: () => 'Evidence Level' }),
                'evidence level'
            )
        },
        key: 'Evidence_Level',
        align: 'center',
        filterOptions: [
            {
                label: '1',
                value: '1',
            },
            {
                label: '2',
                value: '2',
            },
            {
                label: '3',
                value: '3',
            },
            {
                label: '4',
                value: '4',
            },
        ],
        filter(value: any, row: any) {
            return row.Evidence_Level === value
        },
        render(row: any) {
            return h('div', { style: { width: '100px' } }, [
                h(
                    NTag,
                    {
                        type: complete(row.Evidence_Level),
                        size: 'small',
                    },
                    {
                        default: () => row.Evidence_Level,
                    }
                ),
            ])
        },
    },
    {
        title: 'Actions',
        key: 'actions',
        width: 250,
        align: 'center',
        render(row: any) {
            return h(
                'div',
                {
                    style: {
                        display: 'flex',
                        justifyContent: 'space-around',
                    },
                },
                [
                    h(
                        NButton,
                        {
                            strong: true,
                            tertiary: true,
                            size: 'small',
                            type: 'info',
                            onClick: () => {
                                // const copyrow = { ...row }
                                crisprInfo.value = { ...row }
                                crisprVisible.value = true
                            },
                        },
                        { default: () => 'Detail' }
                    ),
                    h(
                        NButton,
                        {
                            strong: true,
                            tertiary: true,
                            size: 'small',
                            type: 'info',
                            onClick: () => {
                                const element = document.createElement('a')
                                const content = `>${row.CRISPR_Id}\n${row.Consensus_Repeat}`
                                const file = new Blob([content], { type: 'text/plain' })
                                element.href = URL.createObjectURL(file)
                                element.download = `${row.CRISPR_Id}.fasta`
                                document.body.appendChild(element) // Required for this to work in FireFox
                                element.click()
                            },
                        },
                        { default: () => 'Download' }
                    ),
                ]
            )
        },
    },
]
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
const godatahelper = () => {
    router.push({
        path: '/tutorial',
        query: { type: 'database_intro' },
    })
}

const downloadsequence = () => {
    const element = document.createElement('a')
    const content = `>${crisprInfo.value.CRISPR_Id}\n${crisprInfo.value.Consensus_Repeat}`
    const file = new Blob([content], { type: 'text/plain' })
    element.href = URL.createObjectURL(file)
    element.download = `${crisprInfo.value.CRISPR_Id}.fasta`
    document.body.appendChild(element) // Required for this to work in FireFox
    element.click()
}
</script>
