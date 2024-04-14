mt-10 mr-10 w-40 mt-10 mr-10 w-40
<template>
    <div class="mx-30 my-10 h-full pb-10 flex flex-col justify-start">
        <div class="flex felx-row justify-start mt-8">
            <h1 class="text-5xl m-4 font-700">Database Overview</h1>

            <div class="flex flex-row ml-1 my-6">
                <el-button round color="#34498E" class="ml-5" @click="godatalist">
                    Total Data
                </el-button>
                <el-button round color="#34498E" class="ml-5" @click="godatahelper">
                    Database Helper
                </el-button>
            </div>
        </div>
        <!-- part Overview -->
        <div class="mb-4 mt-12 p-1">
            <div class="flex flex-row">
                <div class="w-40 ml-3">
                    <n-statistic>
                        <n-number-animation
                            ref="numberAnimationInstRef"
                            :from="0"
                            :to="18"
                            :duration="1000"
                            show-separator
                        />
                        <template #label>
                            <!-- select count(distinct slice_id) from crustdb_main;  -->
                            <h1 class="text-[#212529] text-lg font-700 ml-1">Total Slices</h1>
                        </template>
                    </n-statistic>
                </div>
                <div class="w-45">
                    <n-statistic>
                        <n-number-animation
                            ref="numberAnimationInstRef"
                            :from="0"
                            :to="131"
                            :duration="1000"
                            show-separator
                        />
                        <template #label>
                            <!-- select count(distinct cell_type) from crustdb_main;  -->
                            <h1 class="text-[#212529] text-lg font-700">Total Cell Types</h1>
                        </template>
                    </n-statistic>
                </div>
                <div class="w-62">
                    <n-statistic>
                        <n-number-animation
                            ref="numberAnimationInstRef"
                            :from="0"
                            :to="1378472"
                            show-separator
                        />
                        <template #label>
                            <!-- select sum(cell_num) from crustdb_main;  -->
                            <h1 class="text-[#212529] text-lg font-700">Total Cells</h1>
                        </template>
                    </n-statistic>
                </div>
                <div class="w-80">
                    <n-statistic>
                        <n-number-animation
                            ref="numberAnimationInstRef"
                            :from="0"
                            :to="401"
                            show-separator
                        />
                        <template #label>
                            <!-- select sum(conformation_num) from crustdb_main;
                            Or
                            select count(*) from details; -->
                            <h1 class="text-[#212529] text-lg font-700">
                                Total Cytocraft Conformation
                            </h1>
                        </template>
                    </n-statistic>
                </div>
                <div class="w-85">
                    <n-statistic>
                        <n-number-animation
                            ref="numberAnimationInstRef"
                            :from="0"
                            :to="25136"
                            show-separator
                        />
                        <template #label>
                            <!-- select max(gene_num) from crustdb_main;  -->
                            <h1 class="text-[#212529] text-lg font-700">
                                Max Gene Number in Conformation
                            </h1>
                        </template>
                    </n-statistic>
                </div>
            </div>
        </div>
        <!-- part Platform -->
        <div class="mt-12 m-3">
            <div class="border-t-2"></div>
            <h1 class="text-4xl mt-8 ml-6 font-500">Platform</h1>
            <div class="flex flex-row justify-start w-370 flex-wrap items-start ml-10 mt-6 mb-6">
                <img class="mt-10 mr-10 w-80 h-62" src="../../../public/png/stereo-seq.png" />
                <img class="mt-10 mr-10 w-80 h-62" src="../../../public/png/cosmx.png" />
                <img class="mt-10 mr-10 w-80 h-62" src="../../../public/png/merfish.png" />
            </div>
            <div class="flex flex-row justify-start w-370 flex-wrap items-start ml-10 mt-6 mb-6">
                <n-button
                    class="mt-1 mr-10 w-80 text-[#34498e] text-xl h-11"
                    tertiary
                    @click="viewSTPlatform('Stereo-seq')"
                >
                    Stereo-seq
                </n-button>
                <n-button
                    class="mt-1 mr-10 w-80 text-[#34498e] text-xl h-11"
                    tertiary
                    @click="viewSTPlatform('CosMx')"
                >
                    CosMx
                </n-button>
                <n-button
                    class="mt-1 mr-10 w-80 text-[#34498e] text-xl h-11"
                    tertiary
                    @click="viewSTPlatform('MERFISH')"
                >
                    MERFISH
                </n-button>
            </div>
        </div>
        <!-- part Species -->
        <div class="mt-12 m-3">
            <div class="border-t-2"></div>
            <h1 class="text-4xl mt-8 ml-6 font-500">Species</h1>
            <div class="flex flex-row justify-start w-370 flex-wrap items-start ml-10 mt-6">
                <img class="mt-10 mr-10 w-80 h-62" src="../../../public/png/stereo-seq.png" />
                <img class="mt-10 mr-10 w-80 h-62" src="../../../public/png/stereo-seq.png" />
                <img class="mt-10 mr-10 w-80 h-62" src="../../../public/png/stereo-seq.png" />
                <img class="mt-10 mr-10 w-80 h-62" src="../../../public/png/stereo-seq.png" />
            </div>
            <div class="flex flex-row justify-start w-370 flex-wrap items-start ml-10 mt-6">
                <n-button
                    class="mt-1 mr-10 w-80 text-[#34498e] text-xl h-11"
                    tertiary
                    @click="viewSpecies('human')"
                >
                    Human
                </n-button>
                <n-button
                    class="mt-1 mr-10 w-80 text-[#34498e] text-xl h-11"
                    tertiary
                    @click="viewSpecies('mice')"
                >
                    Mice
                </n-button>
                <n-button
                    class="mt-1 mr-10 w-80 text-[#34498e] text-xl h-11"
                    tertiary
                    @click="viewSpecies('axolotls')"
                >
                    Axolotls
                </n-button>
                <n-button
                    class="mt-1 mr-10 w-80 text-[#34498e] text-xl h-11"
                    tertiary
                    @click="viewSpecies('monkey')"
                >
                    Monkey
                </n-button>
            </div>
        </div>
        <!-- part VIs -->
        <div class="mt-20 m-3">
            <div class="border-t-2"></div>
            <div class="flex felx-row justify-start">
                <h1 class="text-3xl mt-8 ml-6 font-600">Database overview visualization</h1>
                <n-button round type="default" class="mt-9 ml-8" size="small" v-show="false">
                    <template #icon>
                        <n-icon>
                            <downicon />
                        </n-icon>
                    </template>
                    Download all charts
                </n-button>
            </div>
            <div>
                <div>
                    <h1 class="text-3xl mt-9 ml-7 font-500 text-[#3262a8]">Bar Plot</h1>
                </div>
                <div class="flex flex-row justify-between mt-6 ml-8 w-285">
                    <n-form-item label="Please choose plot type" class="w-75">
                        <n-select
                            v-model:value="barchartvalue1"
                            :options="barchartoptions1"
                            @update:value="barcharthandleUpdateValue1"
                        ></n-select>
                    </n-form-item>
                    <n-form-item label="Please choose plot type" class="w-75">
                        <n-select
                            v-model:value="barchartvalue2"
                            :options="barchartoptions2"
                            @update:value="barcharthandleUpdateValue2"
                        ></n-select>
                    </n-form-item>
                </div>
                <div class="flex flex-row">
                    <div
                        class="w-200 h-140 mb-10 mt-5 p-5 ml-8"
                        style="box-shadow: 0 0 64px #cfd5db"
                    >
                        <div id="myEcharts" class="w-190 h-130" ref="echartbarDom1"></div>
                    </div>
                    <div
                        class="w-200 h-140 mb-10 mt-5 ml-10 p-5"
                        style="box-shadow: 0 0 64px #cfd5db"
                    >
                        <div id="myEcharts" class="w-190 h-130" ref="echartbarDom2"></div>
                    </div>
                </div>
            </div>
            <div class="mt-10">
                <div>
                    <h1 class="text-3xl mt-9 ml-7 font-500 text-[#3262a8]">Pie Chart</h1>
                </div>
                <div class="w-285 flex flex-row justify-between mt-6 ml-8">
                    <n-form-item label="Please choose chart type" class="w-75">
                        <n-select
                            v-model:value="piechartvalue1"
                            :options="piechartoptions1"
                            @update:value="piecharthandleUpdateValue1"
                        ></n-select>
                    </n-form-item>
                    <n-form-item label="Please choose chart type" class="w-75">
                        <n-select
                            v-model:value="piechartvalue2"
                            :options="piechartoptions2"
                            @update:value="piecharthandleUpdateValue2"
                        ></n-select>
                    </n-form-item>
                </div>

                <div class="flex flex-row">
                    <div
                        class="w-200 h-120 mb-10 mt-5 p-5 ml-8"
                        style="box-shadow: 0 0 64px #cfd5db"
                    >
                        <div id="mypieEcharts1" class="w-190 h-110" ref="echartpieDom1"></div>
                    </div>
                    <div
                        class="w-200 h-120 mb-10 mt-5 ml-10 p-5"
                        style="box-shadow: 0 0 64px #cfd5db"
                    >
                        <div id="mypieEcharts2" class="w-190 h-110" ref="echartpieDom2"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { CloudDownloadOutline as downicon } from '@vicons/ionicons5'
import * as echarts from 'echarts'

import {
    STPlatformBarOptions,
    TestSTPlatformBarOptions,
    SpeciesBarOptions,
    STPlatformPieOptions,
    TestSTPlatformPieOptions,
    SpeciesPieOptions,
} from '@/utils/overview'

const router = useRouter()
const godatalist = () => router.push({ path: '/database/crustdb_main' })

const viewSTPlatform = (node: string) => {
    let dataset = ''
    if (node === 'Stereo-seq') {
        dataset = 'crustdb_stereo'
    } else if (node === 'CosMx') {
        dataset = 'crustdb_cosmx'
    } else if (node === 'MERFISH') {
        dataset = 'crustdb_merfish'
    }
    router.push({
        path: `/database/crustdb_main`,
        query: {
            dataset,
        },
    })
}

const viewSpecies = (node: string) => {
    let dataset = ''
    if (node === 'human') {
        dataset = 'crustdb_human'
    } else if (node === 'mice') {
        dataset = 'crustdb_mice'
    } else if (node === 'axolotls') {
        dataset = 'crustdb_axolotls'
    }
    // else if (node === 'monkey') {
    //     dataset = 'crustdb_axolotls'
    // }
    router.push({
        path: `/database/crustdb_main`,
        query: {
            dataset,
        },
    })
}

const barchartvalue1 = ref('ST Platform Distribution')
const barchartvalue2 = ref('Species Distribution')
const piechartvalue1 = ref('ST Platform Distribution')
const piechartvalue2 = ref('Species Distribution')

const barchartoptions1 = [
    {
        label: 'ST Platform Distribution',
        value: 'ST Platform Distribution',
    },
    {
        label: '(test) ST Platform Distribution',
        value: '(test) ST Platform Distribution',
    },
]
const barchartoptions2 = [
    {
        label: 'Species Distribution',
        value: 'Species Distribution',
    },
]
const piechartoptions1 = [
    {
        label: 'ST Platform Distribution',
        value: 'ST Platform Distribution',
    },
    {
        label: '(test) ST Platform Distribution',
        value: '(test) ST Platform Distribution',
    },
]
const piechartoptions2 = [
    {
        label: 'Species Distribution',
        value: 'Species Distribution',
    },
]
const echartbarDom1 = ref<HTMLElement | null>(null)
const echartbarDom2 = ref<HTMLElement | null>(null)
const echartpieDom1 = ref<HTMLElement | null>(null)
const echartpieDom2 = ref<HTMLElement | null>(null)

onMounted(() => {
    const mybarEcharts1 = echarts.init(echartbarDom1.value as HTMLElement)
    mybarEcharts1.setOption(STPlatformBarOptions)
    const mybarEcharts2 = echarts.init(echartbarDom2.value as HTMLElement)
    mybarEcharts2.setOption(SpeciesBarOptions)
    const mypieEcharts1 = echarts.init(echartpieDom1.value as HTMLElement)
    mypieEcharts1.setOption(STPlatformPieOptions)
    const mypieEcharts2 = echarts.init(echartpieDom2.value as HTMLElement)
    mypieEcharts2.setOption(SpeciesPieOptions)
})

const barcharthandleUpdateValue1 = (value: string) => {
    barchartvalue1.value = value
    if (value === 'ST Platform Distribution') {
        const mybarEcharts1 = echarts.init(echartbarDom1.value as HTMLElement)
        mybarEcharts1.setOption(STPlatformBarOptions)
    } else if (value === '(test) ST Platform Distribution') {
        const mybarEcharts1 = echarts.init(echartbarDom1.value as HTMLElement)
        mybarEcharts1.setOption(TestSTPlatformBarOptions)
    }
}
const barcharthandleUpdateValue2 = (value: string) => {
    barchartvalue2.value = value
    if (value === 'Species Distribution') {
        const mybarEcharts2 = echarts.init(echartbarDom2.value as HTMLElement)
        mybarEcharts2.setOption(SpeciesBarOptions)
    }
}
const piecharthandleUpdateValue1 = (value: string) => {
    piechartvalue1.value = value
    if (value === 'ST Platform Distribution') {
        const mypieEcharts1 = echarts.init(echartpieDom1.value as HTMLElement)
        mypieEcharts1.setOption(STPlatformPieOptions)
    } else if (value === '(test) ST Platform Distribution') {
        const mypieEcharts1 = echarts.init(echartpieDom1.value as HTMLElement)
        mypieEcharts1.setOption(TestSTPlatformPieOptions)
    }
}
const piecharthandleUpdateValue2 = (value: string) => {
    piechartvalue2.value = value
    if (value === 'Species Distribution') {
        const mypieEcharts2 = echarts.init(echartpieDom2.value as HTMLElement)
        mypieEcharts2.setOption(SpeciesPieOptions)
    }
}

const godatahelper = () => {
    router.push({
        path: '/tutorial',
        query: { type: 'database_intro' },
    })
}
</script>

<style lang="scss" scoped>
:deep(.n-statistic .n-statistic-value .n-statistic-value__content) {
    font-size: 42px;
    color: #34498e;
    font-weight: bold;
}
</style>
