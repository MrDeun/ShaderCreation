import './style.css'

import { ArcRotateCamera } from '@babylonjs/core/Cameras/arcRotateCamera'
import { Engine } from '@babylonjs/core/Engines/engine'
import { SceneLoader } from '@babylonjs/core/Loading/sceneLoader'
import { ImageProcessingConfiguration } from '@babylonjs/core/Materials/imageProcessingConfiguration'
import { Vector3 } from '@babylonjs/core/Maths/math.vector'
import { Scene } from '@babylonjs/core/scene'
import { createEnvironment } from './helpers'

import '@babylonjs/loaders/glTF/2.0' // needed for gltf 2
import { Color3, HemisphericLight, Material, MeshBuilder, PointLight, ShaderMaterial, StandardMaterial } from '@babylonjs/core'

// Engine
const canvas = document.getElementById('app') as HTMLCanvasElement
const engine = new Engine(canvas, true, {}, true)
const handleResize = () => engine.resize()
window.addEventListener('resize', handleResize, { passive: true })

// Scene
const scene = new Scene(engine)
scene.imageProcessingConfiguration.toneMappingEnabled = true
scene.imageProcessingConfiguration.toneMappingType = ImageProcessingConfiguration.TONEMAPPING_ACES

// Environment

const light = new HemisphericLight('ambient', new Vector3(0.0, 0.0, 0.0), scene)

// Camera
const startAlpha = (Math.PI / 4) * 3 // rotate so we see the cube
const startBeta = Math.PI / 3 // look from above
const camera = new ArcRotateCamera('arcRotateCamera', startAlpha, startBeta, 10, Vector3.Zero(), scene)
scene.switchActiveCamera(camera)

// Load GLTF Model
//const container = await SceneLoader.LoadAssetContainerAsync('/models/', 'babylon-cube.glb', scene)
const sphere = MeshBuilder.CreateSphere('sphere', {}, scene)
const shader_material = new ShaderMaterial('shader', scene, 'vertex.glsl', {})
const material = new StandardMaterial('material', scene)
material.diffuseColor = new Color3(1.0, 1.0, 1.0)
sphere.material = material

// Calculate world size
const worldExtent = scene.getWorldExtends()
const worldSize = worldExtent.max.subtract(worldExtent.min)
const worldCenter = worldExtent.max.add(worldExtent.min).scale(0.5)

// position camera at center
camera.setTarget(worldCenter)
camera.radius = worldSize.length() * 1.5

// Start Render Loop
engine.runRenderLoop(() => scene.render())
