<template>
    <n-anchor show-rail affix :top="150" class="ml-15 w-55" show-background :bound="124">
        <n-anchor-link title="sidebar 1 fasta dataset Download" href="#fasta" class="text-xl" />
        <n-anchor-link title="sidebar 2 meta dataset Download" href="#meta" />
        <n-anchor-link title="sidebar 3 CCC dataset Download" href="#CCC" />
    </n-anchor>

    <div class="flex flex-col w-full h-2220 justify-start items-center">
        <div id="fasta">
            <div class="w-280 mt-20 border-b-1 border-[#34498E] pb-3">
                <div class="text-[40px] text-[#34498E] font-600">
                    sidebar 1 fasta dataset Download
                </div>
            </div>
            <div class="w-280 mt-10">
                <div class="w-280 bg-[#34498E] text-gray-50 p-4 text-[20px] font-600">
                    <div>fasta dataset Download</div>
                    <div></div>
                </div>
                <div class="w-280 border-1 border-gray-700">
                    <downloadItem
                        description="1_1_1"
                        link="http://localhost:8354/fasta/layer1/sublayer1_1/subsublayer1_1_1/1_1_1.csv"
                    ></downloadItem>
                    <downloadItem
                        description="1_1_2"
                        link="http://localhost:8354/fasta/layer1/sublayer1_1/subsublayer1_1_2/1_1_2.csv"
                    ></downloadItem>
                    <downloadItem
                        description="1_2"
                        link="http://localhost:8354/fasta/layer1/sublayer1_2/1_2.csv"
                    ></downloadItem>
                </div>
            </div>
        </div>
        <div id="meta">
            <div class="w-280 mt-20 border-b-1 border-[#34498E] pb-3">
                <div class="text-[40px] text-[#34498E] font-600">
                    sidebar 2 meta dataset Download
                </div>
            </div>
            <div class="w-280 mt-10">
                <div class="w-280 bg-[#34498E] text-gray-50 p-4 text-[20px] font-600">
                    <div>meta dataset Download</div>
                    <div></div>
                </div>
                <div class="w-280 border-1 border-gray-700">
                    <downloadItem
                        description="2_1"
                        link="http://localhost:8354/files/layer2/sublayer2_1/2_1.csv"
                    ></downloadItem>
                    <downloadItem
                        description="2_2"
                        link="http://localhost:8354/files/layer2/sublayer2_2/2_2.csv"
                    ></downloadItem>
                    <downloadItem
                        description="2_2"
                        link="http://localhost:8354/files/layer2/sublayer2_3/2_3.csv"
                    ></downloadItem>
                    <downloadItem
                        description="3_1"
                        link="http://localhost:8354/files/layer3/sublayer3_1/3_1.csv"
                    ></downloadItem>
                    <downloadItem
                        description="3_2"
                        link="http://localhost:8354/files/layer3/sublayer3_2/3_2.csv"
                    ></downloadItem>
                    <downloadItem
                        description="3_3"
                        link="http://localhost:8354/files/layer3/sublayer3_3/3_3.csv"
                    ></downloadItem>
                </div>
            </div>
        </div>
        <div id="CCC">
            <div class="w-280 mt-20 border-b-1 border-[#34498E] pb-3">
                <div class="text-[40px] text-[#34498E] font-600">
                    sidebar 3 CCC dataset Download
                </div>
            </div>
            <div class="w-280 mt-10">
                <div class="w-280 bg-[#34498E] text-gray-50 p-4 text-[20px] font-600">
                    <div>CCC dataset Download</div>
                    <div></div>
                </div>
                <div class="w-280 border-1 border-gray-700">
                    <downloadItem
                        description="CCC dataset 1"
                        link="https://phageapi.deepomics.org/fasta/phage_sequence/phage_gff3/CHVD.gff3"
                    ></downloadItem>
                    <downloadItem
                        description="CCC dataset 2"
                        link="https://phageapi.deepomics.org/fasta/phage_sequence/phage_gff3/IGVD.gff3"
                    ></downloadItem>
                    <downloadItem
                        description="CCC dataset 3"
                        link="https://phageapi.deepomics.org/fasta/phage_sequence/phage_gff3/IMG_VR.gff3"
                    ></downloadItem>
                    <downloadItem
                        description="CCC dataset 4"
                        link="https://phageapi.deepomics.org/fasta/phage_sequence/phage_gff3/GOV2.gff3"
                    ></downloadItem>
                    <downloadItem
                        description="CCC dataset 5"
                        link="https://phageapi.deepomics.org/fasta/phage_sequence/phage_gff3/STV.gff3"
                    ></downloadItem>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
// import { Download } from '@vicons/fa'
import downloadItem from './downloadItem.vue'
// import axios from 'axios'
</script>
