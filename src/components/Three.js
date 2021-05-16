
import styled from 'styled-components'
import React, { useEffect, useRef } from 'react'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import anime from 'animejs/lib/anime.es.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import modelPath from '../assets/model/Star.gltf';

const Three = ({ page }) => {
    const container = useRef()
    useEffect(() => {
        console.log(page.current.offsetHeight);
    }, [])
    useEffect(() => {
        class Sketch {
            constructor(options) {
                this.time = 0
                this.container = options.dom
                this.divContainer = options.page

                this.timeline = null
                this.percentage = 0
                this.scene = new THREE.Scene();

                this.ambientLight = new THREE.AmbientLight(0xffffff, 1.3)
                this.directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
                this.directionalLight.castShadow = true
                this.directionalLight.shadow.mapSize.set(1024, 1024)
                this.directionalLight.shadow.camera.far = 15
                this.directionalLight.shadow.camera.left = - 7
                this.directionalLight.shadow.camera.top = 7
                this.directionalLight.shadow.camera.right = 7
                this.directionalLight.shadow.camera.bottom = - 7
                this.directionalLight.position.set(5, 5, 5)
                this.scene.add(this.directionalLight)
                this.scene.add(this.ambientLight)
                this.width = this.container.offsetWidth
                this.height = this.container.offsetHeight

                this.maxHeight = (this.divContainer.clientHeight || this.divContainer.offsetHeight) - window.innerHeight


                this.camera = new THREE.PerspectiveCamera(20, this.width / this.height, 0.01, 10);
                this.camera.position.z = 1;

                this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
                this.renderer.setSize(this.width, this.height);
                this.container.appendChild(this.renderer.domElement)

                this.controls = new OrbitControls(this.camera, this.renderer.domElement);
                this.resize()
                this.setupResize()
                this.addCube()

                // this.addDonut()

                this.divContainer.addEventListener('wheel', this.onWheel.bind(this), { passive: false });

                this.render()

            }

            addCube() {
                this.star = new THREE.Mesh(new THREE.BoxBufferGeometry(0.1, 0.1, 0.1), new THREE.MeshNormalMaterial());
                // this.mesh.position.y = 0
                // this.mesh.rotation.y = -0.2
                // this.mesh.rotation.x = 0.2
                // this.mesh.position.z = 0
                // this.scene.add(this.mesh);

                const gltfLoader = new GLTFLoader()
                gltfLoader.loadAsync(modelPath).then((result) => {
                    this.star = result.scene.children[0].children[0].children[0]
                    this.scene.add(this.star)
                    this.star.scale.set(0.15, 0.15, 0.15)
                    this.initTimeline()
                })


                // }

                // gltfLoader.load(

                //     modelPath,
                //     async (gltf) => {
                //         this.star = await gltf.scene.children[0].children[0].children[0]
                //         this.star.scale.set(0.2, 0.2, 0.2)
                //         console.log(this);
                //         // console.log(gltf);
                //         this.scene.add(this.star)
                //     }
                // )

            }

            render() {

                this.time += 5

                // this.mesh.rotation.x = this.time / 4000;
                // this.mesh.rotation.y = this.time / 2000;

                this.renderer.render(this.scene, this.camera);

                this.percentage = this.lerp(this.percentage, document.documentElement.scrollTop, 0.1);
                if (this.star && this.timeline) {
                    this.star.rotation.x = this.time / 5000;
                    // this.mesh.rotation.y = this.time / 2000;
                    this.timeline.seek(this.percentage * 4500 / this.maxHeight)
                }
                window.requestAnimationFrame(this.render.bind(this))

            }

            onWheel(e) {
                e.stopImmediatePropagation();
                // e.preventDefault();
                e.stopPropagation();

                // this.percentage = document.documentElement.scrollTop / this.maxHeight

            }
            lerp(percentage, scrollTop, t) {
                return ((1 - t) * percentage + t * scrollTop);
            }
            setupResize() {
                window.addEventListener('resize', this.resize.bind(this))
            }
            resize() {

                this.width = this.container.offsetWidth;
                this.height = this.container.offsetHeight;
                this.renderer.setSize(this.width, this.height);
                this.camera.aspect = this.width / this.height;
                this.maxHeight = (this.divContainer.clientHeight || this.divContainer.offsetHeight) - window.innerHeight

                this.camera.updateProjectionMatrix();
            }

            initTimeline() {
                this.timeline = anime.timeline({
                    autoplay: false,
                    duration: 4500,
                    easing: 'easeOutSine'
                });

                this.timeline.add({
                    targets: this.star.position,
                    x: 0.1,
                    y: 0.00,
                    z: 0.5,
                    duration: 2250,
                    // we need to update the camera projection matrix, otherwise we won't see anything happens
                    update: this.camera.updateProjectionMatrix()
                })
                this.timeline.add({
                    targets: this.star.position,
                    x: 0,
                    y: 0.00,
                    z: 0.9,
                    duration: 2250,
                    // we need to update the camera projection matrix, otherwise we won't see anything happens
                    update: this.camera.updateProjectionMatrix()
                })


                const value = new THREE.Color(0xF)
                const initial = new THREE.Color(0xFFFCFC)
                this.timeline.add({
                    targets: initial,
                    r: [initial.r, value.r],
                    g: [initial.g, value.g],
                    b: [initial.b, value.b],
                    duration: 4500,
                    update: () => {
                        this.renderer.setClearColor(initial);
                    }
                }, 0);
            }


        }

        new Sketch({
            dom: container.current,
            page: page.current
        })
    }, [])
    return (
        <Wrapper ref={container} >

        </Wrapper>
    )
}
const Wrapper = styled.div`
  
    height: 100vh;
    width: 100vw;
    position: fixed;
    z-index: -1;
    top: 0;
    left: 0;

`

export default Three
