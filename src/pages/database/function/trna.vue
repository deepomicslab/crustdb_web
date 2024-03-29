<template>
    <div class="h-680 flex flex-col py-5 px-20">
        <div class="flex flex-row ml-1 my-7">
            <div class="text-4xl font-600">tRNA & tmRNA Gene Information</div>
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
    <el-dialog v-model="trnaVisible" title="tRNA Detail" width="80%">
        <el-descriptions class="text-lg" :column="2" size="large" border>
            <el-descriptions-item>
                <template #label>
                    <div class="cell-item">tRNA ID</div>
                </template>
                {{ trnaInfo.trna_id }}
            </el-descriptions-item>
            <el-descriptions-item>
                <template #label>
                    <div class="cell-item">tRNA Type</div>
                </template>
                {{ trnaInfo.trnatype }}
            </el-descriptions-item>
            <el-descriptions-item>
                <template #label>
                    <div class="cell-item">Length</div>
                </template>
                {{ trnaInfo.length }}
            </el-descriptions-item>
            <el-descriptions-item>
                <template #label>
                    <div class="cell-item">Strand</div>
                </template>
                {{ trnaInfo.strand }}
            </el-descriptions-item>
            <el-descriptions-item>
                <template #label>
                    <div class="cell-item">Start</div>
                </template>
                {{ trnaInfo.start }}
            </el-descriptions-item>
            <el-descriptions-item>
                <template #label>
                    <div class="cell-item">End</div>
                </template>
                {{ trnaInfo.end }}
            </el-descriptions-item>
            <el-descriptions-item>
                <template #label>
                    <div class="cell-item">Permutation</div>
                </template>
                {{ trnaInfo.permutation }}
            </el-descriptions-item>
        </el-descriptions>
        <div>
            <el-input
                v-model="trnaInfo.seq"
                :rows="10"
                type="textarea"
                class="font-mono mt-5 tracking-wide text-lg"
            />
        </div>

        <template #footer>
            <div class="dialog-footer">
                <el-button @click="trnaVisible = false" type="primary">Confirm</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
/* eslint-disable camelcase */
import type { DataTableColumns } from 'naive-ui'
import { h } from 'vue'
import { NButton, NTooltip } from 'naive-ui'
import axios from 'axios'
import { FunnelOutline, ChevronBack, ChevronForward } from '@vicons/ionicons5'
// import { Search, RefreshRight } from '@element-plus/icons-vue'

const trnaVisible = ref(false)
const pagevalue = ref(1)
const pageSize = ref(30)

const loading = ref(false)
// const downloaddialogVisible = ref(false)

// const phagedata = useRequest(() => phageService.getPhageList(pagevalue.value, pageSize.value)).data

const trnadata = ref()

onBeforeMount(async () => {
    loading.value = true
    loading.value = true
    const response = await axios.get(`/trna/`, {
        baseURL: '/api',
        timeout: 100000,
    })
    trnadata.value = response.data
    loading.value = false
})

const phageList = computed(() => {
    return trnadata.value?.results
})

const count = computed(() => trnadata.value?.count)
const nextPage = async () => {
    loading.value = true
    const response = await axios.get(`/trna/`, {
        baseURL: '/api',
        timeout: 100000,
        params: {
            page: pagevalue.value + 1,
            pagesize: pageSize.value,
        },
    })
    const { data } = response
    trnadata.value = data
    loading.value = false
}
const prevPage = async () => {
    loading.value = true
    const response = await axios.get(`/trna/`, {
        baseURL: '/api',
        timeout: 100000,
        params: {
            page: pagevalue.value - 1,
            pagesize: pageSize.value,
        },
    })
    const { data } = response
    trnadata.value = data
    loading.value = false
}

const pagechange = async () => {
    loading.value = true
    const response = await axios.get(`/trna/`, {
        baseURL: '/api',
        timeout: 100000,
        params: {
            page: pagevalue.value,
            pagesize: pageSize.value,
        },
    })
    const { data } = response
    trnadata.value = data
    loading.value = false
}
const pagesizechange = async () => {
    loading.value = true
    const response = await axios.get(`/trna/`, {
        baseURL: '/api',
        timeout: 100000,
        params: {
            page: pagevalue.value,
            pagesize: pageSize.value,
        },
    })
    const { data } = response
    trnadata.value = data
    loading.value = false
}

const router = useRouter()

const renderTooltip = (trigger: any, content: any) => {
    return h(NTooltip, null, {
        trigger: () => trigger,
        default: () => content,
    })
}

const trnaInfo = ref({
    trna_id: '',
    trnatype: '',
    length: '',
    start: '',
    end: '',
    strand: '',
    permutation: '',
    seq: '',
})
type trnaRowData = {
    id: number
    trna_id: string
    trnatype: string
    length: string
    start: string
    end: string
    strand: string
    permutation: string
}
const createColumns = (): DataTableColumns<trnaRowData> => [
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
        key: 'phage_accid',
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
                        color: '#34498e',
                        onClick: async () => {
                            const response = await axios.get(`/phage/detail`, {
                                baseURL: '/api',
                                timeout: 10000,
                                params: {
                                    accid: row.phage_accid,
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
                            return row.phage_accid
                        },
                    }
                ),
            ])
        },
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'tRNA ID' }), 'tRNA ID')
        },
        key: 'trna_id',
        align: 'center',
    },
    {
        title() {
            return renderTooltip(
                h('div', null, { default: () => 'tRNA Type' }),
                'tRNA binding amino acid'
            )
        },
        key: 'trnatype',
        align: 'center',
        render(row: any) {
            return h(
                'div',
                {
                    style: {},
                },
                [row.trnatype.replace(/\?/g, '')]
            )
        },
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'Length' }), 'length of t(m)RNA')
        },
        key: 'length',
        align: 'center',
        sorter: 'default',
    },
    {
        title() {
            return renderTooltip(
                h('div', null, { default: () => 'Start Point' }),
                't(m)RNA start site on the genome'
            )
        },
        key: 'start',
        align: 'center',
        sorter: 'default',
    },
    {
        title() {
            return renderTooltip(
                h('div', null, { default: () => 'End Point' }),
                't(m)RNA stop site on the genome'
            )
        },
        key: 'end',
        align: 'center',
        sorter: 'default',
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'Strand' }), 'strand sense')
        },
        key: 'strand',
        align: 'center',
    },
    {
        title() {
            return renderTooltip(
                h('div', null, { default: () => 'Permutation' }),
                'permuted information'
            )
        },
        key: 'permutation',
        align: 'center',
        width: '250px',
        ellipsis: {
            tooltip: true,
        },
    },
    {
        title: 'Actions',
        key: 'actions',
        width: 280,
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
                                const copyrow = { ...row }
                                trnaInfo.value = { ...row }
                                trnaInfo.value.seq = copyrow.seq.replace(/(.{50})/g, '$1\n')
                                trnaVisible.value = true
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
                            type: 'warning',
                            onClick: () => {
                                const copyrow = { ...row }
                                trnaInfo.value = { ...row }
                                trnaInfo.value.seq = copyrow.seq.replace(/(.{50})/g, '$1\n')
                                const content = `>${trnaInfo.value.trna_id}\n${trnaInfo.value.seq}`
                                const element = document.createElement('a')
                                const file = new Blob([content], { type: 'text/plain' })
                                element.href = URL.createObjectURL(file)
                                element.download = `${trnaInfo.value.trna_id}.fasta`
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
const gofilter = () => {
    router.push({ path: '/database/filter' })
}
</script>
