<template>
    <div class="flex flex-col w-full">
        <el-scrollbar class="w-full" ref="scrollbarRef">
            <div class="flex flex-col h-400">
                <div class="font-600 ml-20 mt-16 flex flex-row border-b-2 w-9/10 pb-5">
                    <div class="text-4xl text-[#253959]">Single Celltype Mode</div>
                    <el-button
                        round
                        size="large"
                        color="#EE7E7D"
                        class="text-white hover:text-white focus:text-white active:text-white ml-70"
                        @click="submitdemo"
                    >
                        Run Demo
                    </el-button>
                    <el-button
                        round
                        size="large"
                        color="#EE7E7D"
                        class="ml-5 text-white hover:text-white focus:text-white active:text-white"
                        @click="godemo"
                    >
                        View Demo Result
                    </el-button>
                    <el-button round size="large" color="#34498E" @click="gosubmithelper">
                        Submission Helper
                    </el-button>
                    <el-button round size="large" color="#34498E" class="ml-5">
                        <a
                            href="https://github.com/deepomicslab/PhageScope/issues"
                            target="_blank"
                            class="btn"
                        >
                            Report bug
                        </a>
                    </el-button>
                </div>
                <div class="text-lg font-500 ml-20 mt-3 w-9/10 flex flex-row">
                    <el-icon class="text-lg mt-1 mr-2 text-[#34498E]">
                        <InfoFilled />
                    </el-icon>
                    It takes a few minutes to
                    <p class="text-[#EE7E7D] mx-2" @click="godemo">RUN DEMO.</p>
                    Click
                    <p class="text-[#EE7E7D] mx-2">VIEW DEMO RESULT</p>
                    to see the precomputed demo results immediately.
                </div>
                <div class="font-600 text-3xl ml-20 mt-10">
                    1. Specify Celltype
                    <n-form-item class="w-75">
                        <n-select
                            v-model:value="thisspeciesoption"
                            :options="speciesoptions"
                            placeholder="Search Species"
                        />
                    </n-form-item>
                </div>
                <div class="font-600 text-3xl ml-20 mt-10">
                    2. Input CSV File
                    <n-button
                        text
                        href="https://cygraph.deepomics.org/demo_input/craft_single_celltype/Mice_endo/SS200000108BR_A3A4_scgem.Endothelial_cell.csv"
                        tag="a"
                        target="_blank"
                        type="primary"
                        class="text-lg"
                    >
                        See Input Example of Single Celltype Mode (Species Mice)
                    </n-button>
                </div>
                <div class="ml-25 mt-5 flex flex-row mb-5">
                    <div class="font-500 text-2xl">Select an input type:</div>

                    <div class="ml-5">
                        <n-radio-group v-model:value="inputtype">
                            <n-radio-button value="upload">UPLOAD FILE</n-radio-button>
                            <n-radio-button value="paste">PASTE CSV FILE</n-radio-button>
                        </n-radio-group>
                    </div>
                </div>

                <div class="flex flex-row justify-center">
                    <div
                        class="rounded w-190 h-90 mt-5 rounded-2xl"
                        style="box-shadow: 0 0 64px #cfd5db"
                        v-if="inputtype === 'upload'"
                    >
                        <n-upload
                            v-model:file-list="fileList"
                            directory-dnd
                            :default-upload="false"
                            accept=".csv"
                            @update:file-list="handleFileListChange"
                            @remove="remove"
                            show-remove-button
                        >
                            <n-upload-dragger>
                                <div class="flex flex-col justify-center items-center">
                                    <div class="text-[90px] mt-10" style="color: #028090">
                                        <i-fa-cloud-upload />
                                    </div>
                                    <p class="text-h5 mt-3 font-light" style="color: #028090">
                                        Click or drag a file to this area to upload your file
                                    </p>

                                    <p
                                        class="text-sp mt-3 mb-3 text-opacity-100"
                                        style="color: #f07167"
                                    >
                                        CSV file size should be less than 100MB
                                    </p>
                                    <p class="text-sp mb-3 text-opacity-100" style="color: #f07167">
                                        <!-- Supported formats: .fasta / .fa -->
                                        Supported formats: .csv
                                    </p>
                                </div>
                            </n-upload-dragger>
                        </n-upload>
                    </div>

                    <div
                        class="rounded w-240 h-100 mt-5 rounded-2xl flex-col flex justify-center items-center"
                        style="box-shadow: 0 0 64px #cfd5db"
                        v-if="inputtype === 'paste'"
                    >
                        <div class="text-lg mb-6 w-190">Paste a CSV file.</div>
                        <div class="w-190 mt-1 flex flex-row text-lg">
                            <n-input
                                round
                                placeholder="cell,x,y,geneID,MIDCount"
                                type="textarea"
                                clearable
                                :rows="10"
                                v-model:value="pastefile"
                            ></n-input>
                        </div>
                        <div class="mt-4">
                            <el-switch
                                active-text="Use Example"
                                size="large"
                                class="mr-7"
                                v-model="exampleSwicth"
                                @change="examplechange"
                            />
                            <!-- <n-button-group>
                                <n-button round size="large" class="w-50">Paste</n-button>
                                <n-button round size="large" class="w-50">Copy</n-button>
                            </n-button-group> -->
                        </div>
                    </div>
                </div>
                <div class="mt-20 flex flex-row justify-center">
                    <el-button
                        size="large"
                        color="#34498E"
                        :width="70"
                        class="text-white hover:text-white focus:text-white active:text-white text-2xl"
                        @click="submit"
                    >
                        Submit
                    </el-button>
                </div>
            </div>
        </el-scrollbar>
    </div>
</template>
<script setup lang="ts">
import type { UploadFileInfo } from 'naive-ui'
import { InfoFilled } from '@element-plus/icons-vue'
import axios from 'axios'
// import { FormInst } from 'naive-ui'
import { useUserIdGenerator } from '@/utils/userIdGenerator'
import { encrypt } from '@/utils/crypto'

const fileList = ref<UploadFileInfo[]>([])
const submitfile = ref<File>()
const inputtype = ref('upload')
const pastefile = ref('')
const userid = ref('')

// const choosecelltypedialogVisible = ref(false)
const speciesoptions = [
    {
        label: 'Mice',
        value: 'Mice',
    },
    {
        label: 'Mouse',
        value: 'Mouse',
        disabled: true,
    },
    {
        label: 'Human',
        value: 'Human',
        disabled: true,
    },
    {
        label: 'Axolotls',
        value: 'Axolotls',
        disabled: true,
    },
    {
        label: 'Axolotl',
        value: 'Axolotl',
        disabled: true,
    },
    {
        label: 'Monkey',
        value: 'Monkey',
        disabled: true,
    },
]
const thisspeciesoption = ref('')

// watch(thisspeciesoption, () => {
//     console.log(thisspeciesoption.value)
// })

const exampleSwicth = ref(false)

const examplechange = async () => {
    // console.log('exampleSwicth.value', exampleSwicth.value)
    if (exampleSwicth.value) {
        const fileURL = new URL(
            // '../../../../../public/dataExample/data_demo/sequence.fasta',
            '../../../../../public/demo_input/craft_single_celltype/Mice_endo/SS200000108BR_A3A4_scgem.Endothelial_cell.partial.csv',
            // '../../../../../public/demo_input/craft_single_celltype/Mice_endo/test.csv',
            // 'https://phagescope.deepomics.org/dataExample/data_demo/sequence.fasta',
            import.meta.url
        )
        // fetch(fileURL).catch(err => console.log('Request Failed', err))
        const response = await fetch(fileURL)
        const content = await response.text()
        // console.log(content)
        pastefile.value = content
    } else {
        pastefile.value = ''
    }
}
/* eslint-disable */
const handleFileListChange = (data: UploadFileInfo[]) => {
    if (data[0].name.match(/(.csv)$/g) === null) {
        window.$message.error('Uploaded file must be in CSV format.', {
            closable: true,
            duration: 5000,
        })
        data.pop()
    } else if (data[0].file?.size === 0 || data[0].file?.size === undefined) {
        window.$message.error('Uploaded file cannot be empty.', { closable: true, duration: 5000 })
        data.pop()
    } else if (data[0].file.size / 1024 / 1024 > 100) {
        window.$message.error('Uploaded file cannot exceed 100MB.', {
            closable: true,
            duration: 5000,
        })
        data.pop()
    } else if (data.length > 1) {
        window.$message.error('Cannot upload more than one files.', {
            closable: true,
            duration: 5000,
        })
        data.pop()
    } else if (data.length === 1) {
        submitfile.value = data[0].file
        fileList.value[0] = data[0]
    }
}
const remove = () => {
    submitfile.value = undefined
    fileList.value.pop()
}

// const choosecelltype = () => {
//     choosecelltypedialogVisible.value = true
// }

const router = useRouter()

const godemo = () => {
    // -99 is the demo_user. Se details in crustdb_api/01_database_add_data.py
    router.push({
        path: '/task/result/conformation/single_celltype_mode', query: {
            taskid: encrypt(
                '-99', 'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2')
        }
    })
}

const submit = async () => {
    const submitdata = new FormData()
    const precheck = ref(false)

    if (thisspeciesoption.value === '') {
        window.$message.error('Please specify species', {
            closable: true,
            duration: 5000,
        })
        precheck.value = false
    }
    // console.log('inputtype.value', inputtype.value)
    submitdata.append('species', thisspeciesoption.value)
    submitdata.append('analysistype', 'Single Celltype Mode')
    submitdata.append('userid', userid.value)
    submitdata.append('inputtype', inputtype.value)

    if (inputtype.value === 'upload') {
        if (typeof submitfile.value === 'undefined') {
            window.$message.error('Please upload CSV file', {
                closable: true,
                duration: 5000,
            })
            precheck.value = false
        } else {
            // console.log('inputtype.value', inputtype.value)
            // console.log('submitfile.value', submitfile.value)
            submitdata.append('CSV', submitfile.value as File)
            precheck.value = true
        }
    } else if (inputtype.value === 'paste') {
        if (pastefile.value.length > 0) {
            // console.log('inputtype.value', inputtype.value)
            submitdata.append('CSVfile', pastefile.value)
            precheck.value = true
        } else {
            window.$message.error('Please input data in CSV format', {
                closable: true,
                duration: 5000,
            })
            precheck.value = false
        }
    }

    if (precheck.value) {

        // for (var pair of submitdata.entries()) {
        //     console.log(pair[0] + ', ' + pair[1]);
        // }
        try {
            const response = await axios.post(`/analyze/craft_single_celltype/`, submitdata, {
                baseURL: '/api',
                timeout: 100000,
                headers: { 'Content-Type': 'multipart/form-data' },
                maxBodyLength: Infinity,
                maxContentLength: Infinity,
            })
            const { data } = response

            if (data.status === 'Create Success') {
                window.$message.success(data.message, {
                    closable: true,
                    duration: 5000,
                })
                router.push({
                    path: '/workspace/',
                })
            } else {
                window.$message.error(data.message, {
                    closable: true,
                    duration: 5000,
                })
            }
        } catch (err) {
            console.log(err)
        }
    }
}
const submitdemo = async () => {
    const submitdata = new FormData()
    // submitdata.append('modulelist', JSON.stringify(modulelist.value))
    // submitdata.append('rundemo', 'true')
    const precheck = ref(true)

    if (precheck.value) {
        // submitdata.append('analysistype', 'Lifestyle Prediction')
        submitdata.append('analysistype', 'Single Celltype Mode')
        submitdata.append('userid', userid.value)
        //submitdata.append('user', 'demo')
        submitdata.append('inputtype', 'rundemo')
        submitdata.append('species', 'Mice') // customised at this time
        // const response = await axios.post(`/analyze/pipline/`, submitdata, {
        const response = await axios.post(`/analyze/craft_single_celltype/`, submitdata, {
            baseURL: '/api',
            timeout: 10000,
        })
        const { data } = response
        // console.log(data)
        if (data.status === 'Create Success') {
            window.$message.success(data.message, {
                closable: true,
                duration: 5000,
            })
            router.push({
                path: '/workspace/',
            })
        } else {
            window.$message.error(data.message, {
                closable: true,
                duration: 5000,
            })
        }
    }
}
onBeforeMount(() => {
    const { userId, getUserIdFromCookie } = useUserIdGenerator()
    getUserIdFromCookie()
    userid.value = userId.value as string
})

const gosubmithelper = () => {
    router.push({ path: '/tutorial', query: { type: 'analysis' } })
}
</script>

<style lang="scss" scoped>
:deep(.el-tree-node__content) {
    height: 48px !important;
}
</style>
