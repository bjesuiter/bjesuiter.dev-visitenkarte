import * as THREE from "three";
import {
  LANDS,
  createLandGeometry,
  generateDecorations,
  createMountainGeometry,
  createTreeGeometry,
  createCityGeometry,
  createSeaMonsterGeometry,
  createCompassRoseGeometry,
  createWaveGeometry,
} from "./lands.ts";
import {
  paperVertexShader,
  paperFragmentShader,
  backgroundVertexShader,
  backgroundFragmentShader,
  decorationVertexShader,
  decorationFragmentShader,
} from "./shaders.ts";
import { MapInteractionManager } from "./interactions.ts";

export class FantasyMapCanvas {
  private container: HTMLElement;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private interactionManager: MapInteractionManager;
  private clock: THREE.Clock;
  private animationId: number | null = null;
  private uniforms: {
    uTime: { value: number };
    uResolution: { value: THREE.Vector2 };
  };
  private landMaterials: THREE.ShaderMaterial[] = [];
  private mapGroup: THREE.Group;

  constructor(container: HTMLElement, labelElement: HTMLDivElement) {
    this.container = container;
    this.clock = new THREE.Clock();

    this.uniforms = {
      uTime: { value: 0 },
      uResolution: {
        value: new THREE.Vector2(window.innerWidth, window.innerHeight),
      },
    };

    this.scene = new THREE.Scene();
    this.mapGroup = new THREE.Group();
    this.scene.add(this.mapGroup);

    const aspect = container.clientWidth / container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 100);
    this.camera.position.set(0, 0, 1.5);
    this.camera.lookAt(0, 0, 0);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
    });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x8b9da6);
    container.appendChild(this.renderer.domElement);

    this.interactionManager = new MapInteractionManager(this.camera);
    this.interactionManager.setMapGroup(this.mapGroup);
    this.interactionManager.setLabelElement(labelElement);
    this.interactionManager.setOnLandClick((landId) => {
      console.log(`Clicked on land: ${landId}`);
      const land = LANDS.find((l) => l.id === landId);
      if (land) {
        console.log(`Land name: ${land.name}`);
        console.log(`Description: ${land.description}`);
      }
    });

    this.createBackground();
    this.createLands();
    this.createDecorations();
    this.createCompassRose();
    this.createSeaMonsters();
    this.createWaves();
    this.createMapTitle();

    this.setupEventListeners();
    this.animate();
  }

  private createBackground(): void {
    const bgGeometry = new THREE.PlaneGeometry(4, 3);
    const bgMaterial = new THREE.ShaderMaterial({
      vertexShader: backgroundVertexShader,
      fragmentShader: backgroundFragmentShader,
      uniforms: {
        uTime: this.uniforms.uTime,
        uResolution: this.uniforms.uResolution,
      },
    });

    const background = new THREE.Mesh(bgGeometry, bgMaterial);
    background.position.z = -0.1;
    this.scene.add(background);
  }

  private createLands(): void {
    for (const land of LANDS) {
      const geometry = createLandGeometry(land);

      const material = new THREE.ShaderMaterial({
        vertexShader: paperVertexShader,
        fragmentShader: paperFragmentShader,
        uniforms: {
          uColor: { value: new THREE.Color(land.color) },
          uAccentColor: { value: new THREE.Color(land.accentColor) },
          uHover: { value: 0 },
          uTime: this.uniforms.uTime,
          uResolution: this.uniforms.uResolution,
        },
        side: THREE.DoubleSide,
      });

      this.landMaterials.push(material);

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(land.position.x, land.position.y, 0);

      mesh.rotation.x = -Math.PI * 0.05;

      this.mapGroup.add(mesh);
      this.interactionManager.registerLandMesh(mesh, land);
    }
  }

  private createDecorations(): void {
    const inkColor = new THREE.Color(0x3a3228);

    const mountainGeometry = createMountainGeometry();
    const treeGeometry = createTreeGeometry();
    const cityGeometry = createCityGeometry();

    for (const land of LANDS) {
      const decorations = generateDecorations(land);

      for (const deco of decorations) {
        let geometry: THREE.BufferGeometry;

        switch (deco.type) {
          case "mountain":
            geometry = mountainGeometry.clone();
            break;
          case "tree":
            geometry = treeGeometry.clone();
            break;
          case "city":
            geometry = cityGeometry.clone();
            break;
          default:
            continue;
        }

        const material = new THREE.ShaderMaterial({
          vertexShader: decorationVertexShader,
          fragmentShader: decorationFragmentShader,
          uniforms: {
            uColor: { value: inkColor },
            uTime: this.uniforms.uTime,
          },
          transparent: true,
          side: THREE.DoubleSide,
        });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.copy(deco.position);
        mesh.scale.setScalar(deco.scale);
        mesh.rotation.z = deco.rotation;

        this.mapGroup.add(mesh);
      }
    }
  }

  private createCompassRose(): void {
    const geometry = createCompassRoseGeometry();
    const material = new THREE.ShaderMaterial({
      vertexShader: decorationVertexShader,
      fragmentShader: decorationFragmentShader,
      uniforms: {
        uColor: { value: new THREE.Color(0x4a4238) },
        uTime: this.uniforms.uTime,
      },
      transparent: true,
      side: THREE.DoubleSide,
    });

    const compassRose = new THREE.Mesh(geometry, material);
    compassRose.position.set(0.55, -0.45, 0.01);
    compassRose.scale.setScalar(0.8);
    this.mapGroup.add(compassRose);

    const innerGeometry = createCompassRoseGeometry();
    const innerMaterial = new THREE.ShaderMaterial({
      vertexShader: decorationVertexShader,
      fragmentShader: decorationFragmentShader,
      uniforms: {
        uColor: { value: new THREE.Color(0x8b7355) },
        uTime: this.uniforms.uTime,
      },
      transparent: true,
      side: THREE.DoubleSide,
    });

    const innerCompass = new THREE.Mesh(innerGeometry, innerMaterial);
    innerCompass.position.set(0.55, -0.45, 0.015);
    innerCompass.scale.setScalar(0.4);
    innerCompass.rotation.z = Math.PI / 8;
    this.mapGroup.add(innerCompass);
  }

  private createSeaMonsters(): void {
    const monsterGeometry = createSeaMonsterGeometry();

    const monsterPositions = [
      { x: -0.6, y: -0.35, scale: 0.7, rotation: 0.3 },
      { x: 0.65, y: 0.35, scale: 0.5, rotation: -0.5 },
      { x: -0.55, y: 0.45, scale: 0.6, rotation: 0.8 },
    ];

    for (const pos of monsterPositions) {
      const material = new THREE.ShaderMaterial({
        vertexShader: decorationVertexShader,
        fragmentShader: decorationFragmentShader,
        uniforms: {
          uColor: { value: new THREE.Color(0x5a5248) },
          uTime: this.uniforms.uTime,
        },
        transparent: true,
        side: THREE.DoubleSide,
      });

      const monster = new THREE.Mesh(monsterGeometry.clone(), material);
      monster.position.set(pos.x, pos.y, 0.01);
      monster.scale.setScalar(pos.scale);
      monster.rotation.z = pos.rotation;
      this.mapGroup.add(monster);
    }
  }

  private createWaves(): void {
    const waveGeometry = createWaveGeometry();

    const wavePositions: Array<{ x: number; y: number; rotation: number }> = [];

    for (let i = 0; i < 30; i++) {
      let x = (Math.random() - 0.5) * 1.4;
      let y = (Math.random() - 0.5) * 1.0;

      let tooCloseToLand = false;
      for (const land of LANDS) {
        const dist = Math.sqrt(
          Math.pow(x - land.position.x, 2) + Math.pow(y - land.position.y, 2),
        );
        const landRadius = 0.08 + land.size * 0.05;
        if (dist < landRadius) {
          tooCloseToLand = true;
          break;
        }
      }

      if (!tooCloseToLand) {
        wavePositions.push({
          x,
          y,
          rotation: Math.random() * Math.PI * 2,
        });
      }
    }

    for (const pos of wavePositions) {
      const material = new THREE.LineBasicMaterial({
        color: 0x7a8a96,
        transparent: true,
        opacity: 0.4,
      });

      const wave = new THREE.Line(waveGeometry.clone(), material);
      wave.position.set(pos.x, pos.y, 0.005);
      wave.rotation.z = pos.rotation;
      wave.scale.setScalar(0.5 + Math.random() * 0.5);
      this.mapGroup.add(wave);
    }
  }

  private createMapTitle(): void {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;
    canvas.width = 512;
    canvas.height = 128;

    ctx.fillStyle = "transparent";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = "bold 48px Georgia, serif";
    ctx.fillStyle = "#3a3228";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.shadowColor = "rgba(0, 0, 0, 0.2)";
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;

    ctx.fillText("The Realm of BJesuiter", canvas.width / 2, canvas.height / 2);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;

    const geometry = new THREE.PlaneGeometry(0.8, 0.2);
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      side: THREE.DoubleSide,
    });

    const titleMesh = new THREE.Mesh(geometry, material);
    titleMesh.position.set(0, 0.55, 0.02);
    this.mapGroup.add(titleMesh);
  }

  private setupEventListeners(): void {
    window.addEventListener("resize", this.onResize.bind(this));

    this.container.addEventListener("mousemove", (event) => {
      this.interactionManager.handleMouseMove(event, this.container);
      this.container.style.cursor = this.interactionManager.getCursorStyle();
    });

    this.container.addEventListener("click", () => {
      this.interactionManager.handleClick();
    });
  }

  private onResize(): void {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
    this.uniforms.uResolution.value.set(width, height);
  }

  private animate(): void {
    this.animationId = requestAnimationFrame(this.animate.bind(this));

    const deltaTime = this.clock.getDelta();
    this.uniforms.uTime.value += deltaTime;

    this.interactionManager.updateRaycast();
    this.interactionManager.update(deltaTime);

    this.renderer.render(this.scene, this.camera);
  }

  dispose(): void {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
    }

    window.removeEventListener("resize", this.onResize.bind(this));

    this.scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.geometry.dispose();
        if (Array.isArray(object.material)) {
          object.material.forEach((m) => {
            m.dispose();
          });
        } else {
          object.material.dispose();
        }
      }
    });

    this.renderer.dispose();
    this.container.removeChild(this.renderer.domElement);
  }
}
