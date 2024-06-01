<template>
    <div id="viz_mst" :height="height" :width="width"></div>
</template>

<script setup lang="ts" type="module">
import * as d3 from 'd3'
import * as THREE from 'three'
import { useCrustDBStore } from '@/store/crustdb'

const crustdbStore = useCrustDBStore()

const width = ref(1200)
const height = ref(800)

const nodesCoord = computed(() => {
    return crustdbStore.nodesCoord
})
// const nodesIndex = computed(() => {
//     console.log('nodesIndex', nodesIndex.value)
//     return crustdbStore.nodesIndex
// })
const edgeList = computed(() => {
    // console.log('edgeList', edgeList.value)
    return crustdbStore.edgeList
})

const processVis = () => {
    // console.log('nodesCoord.value', nodesCoord.value)
    // console.log('mst edgeList.value', edgeList.value)
    if (nodesCoord.value) {
        d3.select('#viz_mst').selectAll('*').remove()

        const renderer = new THREE.WebGLRenderer({
            antialias: true,
        })
        const w = width.value
        const h = height.value
        renderer.setSize(w, h)
        // console.log("document.getElementById('viz_mst')", document.getElementById('viz_mst'))
        document.getElementById('viz_mst').appendChild(renderer.domElement)
        renderer.setClearColor(new THREE.Color(0xeeeeee))

        const camera = new THREE.PerspectiveCamera(40, w / h, 1, 10000)
        camera.position.z = 200
        camera.position.x = 200
        camera.position.y = 200

        const scene = new THREE.Scene()

        const scatterPlot = new THREE.Object3D()
        scene.add(scatterPlot)

        scatterPlot.rotation.y = 0

        const unfiltered = []

        const format = d3.format('+.3f')

        // console.log('nodesCoord.value.x', nodesCoord.value.x)
        for (let i = 0; i < nodesCoord.value.x.length; i += 1) {
            unfiltered[i] = {
                x: nodesCoord.value.x[i],
                y: nodesCoord.value.y[i],
                z: nodesCoord.value.z[i],
            }
        }
        const xExent = d3.extent(unfiltered, function (d) {
            return d.x
        })
        // console.log('xExent', xExent)
        const yExent = d3.extent(unfiltered, function (d) {
            return d.y
        })
        const zExent = d3.extent(unfiltered, function (d) {
            return d.z
        })

        const xScale = d3.scaleLinear().domain(xExent).range([0, 100])
        // console.log('xScale', xScale)
        const yScale = d3.scaleLinear().domain(yExent).range([0, 100])
        const zScale = d3.scaleLinear().domain(zExent).range([0, 100])

        const mat = new THREE.PointsMaterial({
            vertexColors: true,
            size: 10,
        })
        const pointCount = unfiltered.length

        const pointGeo = new THREE.BufferGeometry()
        const point = new Float32Array(pointCount * 3)
        for (let i = 0; i < pointCount; i += 1) {
            const x = format(xScale(unfiltered[i].x))
            const y = format(yScale(unfiltered[i].y))
            const z = format(zScale(unfiltered[i].z))

            point[i * 3 + 0] = x
            point[i * 3 + 1] = y
            point[i * 3 + 2] = z
        }
        // console.log('point', point)

        pointGeo.setAttribute('position', new THREE.Float32BufferAttribute(point, 3))

        const points = new THREE.Points(pointGeo, mat)
        scatterPlot.add(points)

        const lineMaterial = new THREE.LineBasicMaterial({ color: 0xff6019 })
        const lines = []
        edgeList.value.forEach(function (e) {
            // console.log(e['0'], e['1'])
            // console.log(point[e['0'] * 3], point[e['0'] * 3 + 1], point[e['0'] * 3 + 2])
            lines.push([
                new THREE.Vector3(point[e['0'] * 3], point[e['0'] * 3 + 1], point[e['0'] * 3 + 2]),
                new THREE.Vector3(point[e['1'] * 3], point[e['1'] * 3 + 1], point[e['1'] * 3 + 2]),
            ])
        })

        lines.forEach(function (d) {
            scatterPlot.add(
                new THREE.Line(new THREE.BufferGeometry().setFromPoints(d), lineMaterial)
            )
        })

        // function createTextCanvas(text, color, font, size) {
        //     size = size || 16
        //     const canvas = document.createElement('canvas')
        //     const ctx = canvas.getContext('2d')
        //     const fontStr = `${size}px ${font || 'Arial'}`
        //     ctx.font = fontStr
        //     const w = ctx.measureText(text).width
        //     const h = Math.ceil(size)
        //     canvas.width = w
        //     canvas.height = h
        //     ctx.font = fontStr
        //     ctx.fillStyle = color || 'black'
        //     ctx.fillText(text, 0, Math.ceil(size * 0.8))
        //     return canvas
        // }

        // function createText2D(text, color, font, size, segW, segH) {
        //     const canvas = createTextCanvas(text, color, font, size)
        //     const plane = new THREE.PlaneGeometry(canvas.width, canvas.height, segW, segH)
        //     const tex = new THREE.Texture(canvas)
        //     tex.needsUpdate = true
        //     const planeMat = new THREE.MeshBasicMaterial({
        //         map: tex,
        //         color: 0xffffff,
        //         transparent: true,
        //     })
        //     const mesh = new THREE.Mesh(plane, planeMat)
        //     mesh.scale.set(0.5, 0.5, 0.5)
        //     mesh.doubleSided = true
        //     return mesh
        // }

        // const titleX = createText2D('X')
        // titleX.position.x = xScale(vpts.xMax) + 12
        // titleX.position.y = 5
        // scatterPlot.add(titleX)

        renderer.render(scene, camera)
        let paused = false
        // const last = new Date().getTime();
        let down = false
        let sx = 0
        let sy = 0
        window.onmousedown = function (ev) {
            down = true
            sx = ev.clientX
            sy = ev.clientY
        }
        window.onmouseup = function () {
            down = false
        }
        window.onmousemove = function (ev) {
            if (down) {
                const dx = ev.clientX - sx
                const dy = ev.clientY - sy
                scatterPlot.rotation.y += dx * 0.01
                camera.position.y += dy
                sx += dx
                sy += dy
            }
        }
        let animating = false
        window.ondblclick = function () {
            animating = !animating
        }

        const animate = function () {
            if (!paused) {
                renderer.clear()
                camera.lookAt(scene.position)
                renderer.render(scene, camera)
            }
            window.requestAnimationFrame(animate, renderer.domElement)
            // console.log("document.getElementById('viz_mst').", document.getElementById('viz_mst'))
        }
        animate()
        onmessage = function (ev) {
            paused = ev.data === 'pause'
        }
    }
}

watch(nodesCoord, () => {
    processVis()
})
</script>
