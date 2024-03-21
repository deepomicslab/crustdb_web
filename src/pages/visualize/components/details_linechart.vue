<template>
    <el-scrollbar class="h-165 flex flex-row items-center" v-loading="loadchart">
        <svg id="Legend_area" :height="height" :width="width"></svg>
    </el-scrollbar>
</template>

<script setup lang="ts">
// @ts-nocheck
import * as d3 from 'd3'
import { useCrustDBStore } from '@/store/crustdb'

const crustDBStore = useCrustDBStore()

const loadchart = ref(true)
// const height = ref(800)
// const lineHeight = ref(180)
const width = ref(1200)
const height = ref(800)

const detailsDistanceList = computed(() => {
    // return phageStore.phagedataloaded
    return crustDBStore.detailsDistanceList
})
watch(detailsDistanceList, () => {
    if (detailsDistanceList.value) {
        d3.select('#Legend_area').selectAll('*').remove()

        const marginTop = 20
        const marginRight = 30
        const marginBottom = 30
        const marginLeft = 40

        const data = [
            { date: 5, close: 55 },
            { date: 15, close: 384 },
            { date: 25, close: 54 },
            { date: 35, close: 25 },
            { date: 45, close: 65 },
        ]

        // Declare the x (horizontal position) scale.
        const x = d3.scaleUtc(
            d3.extent(data, d => d.date),
            [marginLeft, width - marginRight]
        )

        // Declare the y (vertical position) scale.
        const y = d3.scaleLinear(
            [0, d3.max(data, d => d.close)],
            [height - marginBottom, marginTop]
        )

        // Declare the line generator.
        const line = d3
            .line()
            .x(d => x(d.date))
            .y(d => y(d.close))
        console.log(line)

        // Create the SVG container.
        const svg = d3
            .select('#Legend_area')
            .attr('x', 10)
            .attr('y', 0)
            .attr('width', width)
            .attr('height', height)
            .attr('viewBox', [0, 0, width, height])
            .attr('style', 'max-width: 100%; height: auto; height: intrinsic;')

        // Append a path for the line.
        svg.append('path')
            .attr('fill', 'none')
            .attr('stroke', 'steelblue')
            .attr('stroke-width', 1.5)
        // .attr('d', line(data))

        loadchart.value = false
    }
})
</script>
