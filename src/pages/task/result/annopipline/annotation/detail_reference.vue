<template>
    <div class="flex flex-col mx-1/10 justify-start">
        <div class="mt-5 ml-15 mb-10">
            <div class="flex flex-row w-200">
                <div class="text-2xl font-500 mb-5">Annotated Genome Map</div>
                <div class="mt-1.5 ml-10">
                    <el-button @click="showswicth" v-show="annoshow">View in Circo</el-button>
                    <el-button @click="showswicth" v-show="!annoshow">View in Detail</el-button>
                </div>
            </div>
            <div
                style="box-shadow: 0 0 64px #cfd5db"
                class="w-310 h-200 mt-5 ml-10"
                v-show="annoshow"
            >
                <annotation />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
// @ts-nocheck
/* eslint-disable camelcase */
import axios from 'axios'

// import { dataset } from '@/utils/phage'
import annotation from '../../../../visualize/components/annotation.vue'
// import phageService from '@/api/phage'
import { usePhageStore } from '@/store/phage'
import { decrypt } from '@/utils/crypto'

const annoshow = ref(true)
const showswicth = () => {
    annoshow.value = !annoshow.value
}

const phagedata = ref({
    id: 1,
    Acession_ID: '',
    length: '',
    gc_content: '',
})

const moduelshowdict = ref({
    terminator: false,
    trna: false,
    crispr: false,
    arvf: false,
    transmembrane: false,
    anticrispr: false,
})
const proteindata = ref([] as any[])

const phageStore = usePhageStore()
const route = useRoute()
const phageid = computed(() => route.query?.phageid as string)
const taskid = computed(() => {
    return decrypt(
        route.query?.taskid as string,
        'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2'
    )
})
const phagedetailloading = ref(false)
const proteinloading = ref(false)
const taskdata = ref({
    results: {
        modulelist: [],
    },
})

onBeforeMount(async () => {
    phageStore.phageid = phageid.value
    phagedetailloading.value = true
    proteinloading.value = true
    const responsetask = await axios.get(`/tasks/detail/`, {
        baseURL: '/api',
        timeout: 100000,
        params: {
            taskid: taskid.value,
        },
    })
    taskdata.value = responsetask.data
    if (taskdata.value.results.modulelist.includes('terminator')) {
        moduelshowdict.value.terminator = true
    }
    if (taskdata.value.results.modulelist.includes('trna')) {
        moduelshowdict.value.trna = true
    }
    if (taskdata.value.results.modulelist.includes('crispr')) {
        moduelshowdict.value.crispr = true
    }
    if (taskdata.value.results.modulelist.includes('arvf')) {
        moduelshowdict.value.arvf = true
    }
    if (taskdata.value.results.modulelist.includes('transmembrane')) {
        moduelshowdict.value.transmembrane = true
    }
    if (taskdata.value.results.modulelist.includes('anticrispr')) {
        moduelshowdict.value.anticrispr = true
    }
    const response = await axios.get(`/tasks/result/phage/detail/`, {
        baseURL: '/api',
        timeout: 100000,
        params: {
            phageid: phageid.value,
            taskid: taskid.value,
        },
    })
    const { data } = response
    phagedata.value = data.results
    phagedetailloading.value = false
    phageStore.phagedataloaded = false
    const response1 = await axios.get(`/tasks/result/phagefasta/`, {
        baseURL: '/api',
        timeout: 100000,
        params: {
            phageid: phageid.value,
            taskid: taskid.value,
        },
    })
    const response2 = await axios.get(`/tasks/result/proteins/`, {
        baseURL: '/api',
        timeout: 100000,
        params: {
            phageid: phageid.value,
            taskid: taskid.value,
        },
    })

    const prodata = response2.data
    proteindata.value = prodata.results
    proteinloading.value = false
    phageStore.phagefastadata = response1.data
    phageStore.phageprotein = prodata.results
    phageStore.phagedataloaded = true
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
