import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { Sky } from "three/addons/objects/Sky.js";

export class skybox {
    //skybox
    makeSkybox(scene, renderer, gui) {
        let mesh3;

        //skybox:
        const sky = new Sky();
        sky.scale.setScalar(1000000);
        scene.add(sky);

        const skyUniforms = sky.material.uniforms;

        skyUniforms["turbidity"].value = 10;
        skyUniforms["rayleigh"].value = 2;
        skyUniforms["mieCoefficient"].value = 0.005;
        skyUniforms["mieDirectionalG"].value = 0.8;

        const parameters = {
            elevation: 2,
            azimuth: 180,
        };

        let sun = new THREE.Vector3();

        const pmremGenerator = new THREE.PMREMGenerator(renderer);
        let renderTarget;

        function updateSun() {
            const phi = THREE.MathUtils.degToRad(90 - parameters.elevation);
            const theta = THREE.MathUtils.degToRad(parameters.azimuth);

            sun.setFromSphericalCoords(1, phi, theta);

            sky.material.uniforms["sunPosition"].value.copy(sun);
            // water.material.uniforms["sunDirection"].value.copy(sun).normalize();

            //object.material.uniforms["sunDirection"].value.copy(sun).normalize();

            if (renderTarget !== undefined) renderTarget.dispose();

            renderTarget = pmremGenerator.fromScene(sky);

            scene.environment = renderTarget.texture;
        }
        updateSun();
        // end skybox

        const folderSky = gui.addFolder("Sky");
        folderSky.add(parameters, "elevation", 0, 90, 0.1).onChange(updateSun);
       
        folderSky
            .add(parameters, "azimuth", -180, 180, 0.1)
            .onChange(updateSun);
       
            //folderSky.open();

        new GLTFLoader().setPath("../modale/airport/").load(
            "scene.gltf",
            function (gltf1) {
                let mesh2 = gltf1.scene;
                mesh2.scale.multiplyScalar(10);
                mesh2.position.x = 10000;
                mesh2.position.y = 10;
                mesh2.position.z = 6000;
                mesh2.rotation.y = -1 * (Math.PI) / 2 ;
                scene.add(mesh2);
            },
            function (xhr) {
                console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
            },
        );

        new GLTFLoader().setPath("../modale/earth2/").load(
            "scene.gltf",
            function (gltf1) {
                mesh3 = gltf1.scene;
                mesh3.scale.multiplyScalar(30);
                mesh3.rotation.set(0, -70.2, 0);
                mesh3.position.set(0, -42940, 439);
                scene.add(mesh3);
            },
            function (xhr) {
                console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
            },
        );

        function animate() {
            requestAnimationFrame(animate);
        }
        setTimeout(() => {
            animate();
        }, 5000);
    }
}
