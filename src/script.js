import * as THREE from 'three'
import { createNoise3D } from 'simplex-noise';

window.addEventListener('DOMContentLoaded', () => {
  const app = new App('#webgl');
  app.init();
  app.render();
}, false);

class App {
  constructor(canvas) {
    this.wrapper = document.querySelector(canvas);

    this.rendererParam = {
      clearColor: 0x003366,
      width: window.innerWidth,
      height: window.innerHeight
    };

    this.cameraParam = {
      fov : 45,
      aspect : window.innerWidth / window.innerHeight,
      near : 0.1,
      far : 1000,
      x: 0.0,
      y: 0.0,
      z: 5.0,
      lookAt: new THREE.Vector3(0.0, 0.0, 0.0),
    }

    this.materialParam = {
      color: 0x00eedd
    }

    this.objectGroup = new THREE.Group();
    this.originalSizes = [];

    this.clock = new THREE.Clock();
  }

  _setRender() {
    this.renderer = new THREE.WebGLRenderer({antialias : true});
    this.renderer.setSize(this.rendererParam.width, this.rendererParam.height);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setClearColor(new THREE.Color(this.rendererParam.clearColor));
    this.wrapper.appendChild(this.renderer.domElement);
  }

  _setScene() {
    this.scene = new THREE.Scene();
  }

  _setCamera() {
    this.camera = new THREE.PerspectiveCamera(
      this.cameraParam.fov,
      this.cameraParam.aspect,
      this.cameraParam.near,
      this.cameraParam.far
    );

    this.camera.position.set(
      this.cameraParam.x,
      this.cameraParam.y,
      this.cameraParam.z,
    );

    this.camera.lookAt(this.cameraParam.lookAt);
  }

  _createObject() {
    this.geometry = new THREE.BoxGeometry(1);
    this.material = new THREE.MeshPhongMaterial({color: this.materialParam.color});
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    return this.mesh;
  }

  _addObjects() {
    this.count = 5;
    this.simplex = new createNoise3D();

    for(let x = -this.count; x < this.count; x++) {
      for(let y = -this.count; y < this.count; y++) {
        for(let z = -this.count; z < this.count; z++) {
          const object = this._createObject();
          const noise = this.simplex(x, y, z);

          object.position.x = x + noise;
          object.position.y = y + noise;
          object.position.z = z + noise;

          const scale = THREE.MathUtils.clamp(noise, 0.02, 1.0) * 1.2;

          object.scale.x = scale;
          object.scale.y = scale;
          object.scale.z = scale;

          this.originalSizes.push({
            x: scale,
            y: scale,
            z: scale
          });
          this.objectGroup.add(object);
        }
      }
    }
    this.scene.add(this.objectGroup);
  }

  _addLights() {
    this.particleLight = new THREE.Mesh(
      new THREE.SphereGeometry(0.4, 16, 16),
      new THREE.MeshPhongMaterial({color: 0xff22dd})
    );
    this.ambientLight = new THREE.AmbientLight(0x992266, 3, 100);
    this.pointLight = new THREE.PointLight(0xff22dd, 4, 50);

    this.particleLight.position.x = 0;
    this.particleLight.position.y = 0;
    this.particleLight.position.z = 0;
    this.particleLight.add(this.ambientLight);
    this.particleLight.add(this.pointLight);

    this.scene.add(this.particleLight);
  }

  init() {
    this._setScene();
    this._setRender();
    this._setCamera();
    const pointLight = new THREE.PointLight(0xff4400, 2, 300);
    this.camera.add(pointLight);
    this.scene.add(this.camera)

    this._addLights();
    this._addObjects();
    window.addEventListener("resize", this.onResize.bind(this));
  }

  render() {
    const time = this.clock.getElapsedTime();

    for (let i = 0, len = this.objectGroup.children.length; i < len; i++) {
      const object = this.objectGroup.children[i];

      let s = Math.sin(time * 1.2 + (i % 7) * 4.3) * 0.4;
      const min = 0.01;
      const max = 1.5;

      if (i % 2 == 0) {
        object.scale.x = THREE.MathUtils.clamp(this.originalSizes[i].x + s, min, max);
      } else {
        object.scale.z = THREE.MathUtils.clamp(this.originalSizes[i].z + s, min, max);
      }
    }

    const t = time * 0.2;
    this.camera.position.x = 10 * Math.cos(t);
    this.camera.position.y = 10 * Math.sin(t);
    this.camera.position.z = 10 * Math.sin(t);
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));

    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.render.bind(this));
  }

  onResize() {
    const w = window.innerWidth;
    const h = window.innerHeight;

    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(w, h);

    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  };

}
