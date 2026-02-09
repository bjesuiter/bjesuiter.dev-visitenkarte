import * as THREE from "three";
import type { LandData } from "./lands.ts";

export interface InteractionState {
  mousePosition: THREE.Vector2;
  normalizedMouse: THREE.Vector2;
  hoveredLand: string | null;
  targetMapRotation: THREE.Vector2;
  currentMapRotation: THREE.Vector2;
}

export function createInteractionState(): InteractionState {
  return {
    mousePosition: new THREE.Vector2(),
    normalizedMouse: new THREE.Vector2(),
    hoveredLand: null,
    targetMapRotation: new THREE.Vector2(),
    currentMapRotation: new THREE.Vector2(),
  };
}

export interface LandMeshData {
  mesh: THREE.Mesh;
  land: LandData;
  targetElevation: number;
  currentElevation: number;
  targetHighlight: number;
  currentHighlight: number;
  targetTilt: THREE.Vector2;
  currentTilt: THREE.Vector2;
}

export class MapInteractionManager {
  private raycaster: THREE.Raycaster;
  private state: InteractionState;
  private landMeshes: Map<string, LandMeshData>;
  private camera: THREE.PerspectiveCamera;
  private labelElement: HTMLDivElement | null = null;
  private onLandClick: ((landId: string) => void) | null = null;
  private mapGroup: THREE.Group | null = null;

  constructor(camera: THREE.PerspectiveCamera) {
    this.raycaster = new THREE.Raycaster();
    this.state = createInteractionState();
    this.landMeshes = new Map();
    this.camera = camera;
  }

  setMapGroup(group: THREE.Group): void {
    this.mapGroup = group;
  }

  registerLandMesh(mesh: THREE.Mesh, land: LandData): void {
    this.landMeshes.set(land.id, {
      mesh,
      land,
      targetElevation: 0,
      currentElevation: 0,
      targetHighlight: 0,
      currentHighlight: 0,
      targetTilt: new THREE.Vector2(),
      currentTilt: new THREE.Vector2(),
    });
  }

  setLabelElement(element: HTMLDivElement): void {
    this.labelElement = element;
  }

  setOnLandClick(callback: (landId: string) => void): void {
    this.onLandClick = callback;
  }

  handleMouseMove(event: MouseEvent, container: HTMLElement): void {
    const rect = container.getBoundingClientRect();

    this.state.mousePosition.x = event.clientX;
    this.state.mousePosition.y = event.clientY;

    this.state.normalizedMouse.x =
      ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.state.normalizedMouse.y =
      -((event.clientY - rect.top) / rect.height) * 2 + 1;

    const maxTilt = 0.15;

    this.state.targetMapRotation.y = -this.state.normalizedMouse.x * maxTilt;
    this.state.targetMapRotation.x = this.state.normalizedMouse.y * maxTilt;
  }

  handleClick(): void {
    if (this.state.hoveredLand && this.onLandClick) {
      this.onLandClick(this.state.hoveredLand);
    }
  }

  updateRaycast(): void {
    this.raycaster.setFromCamera(this.state.normalizedMouse, this.camera);

    const meshArray = Array.from(this.landMeshes.values()).map((d) => d.mesh);
    const intersects = this.raycaster.intersectObjects(meshArray, false);

    let newHoveredLand: string | null = null;

    if (intersects.length > 0) {
      const hitMesh = intersects[0].object as THREE.Mesh;

      for (const [id, data] of this.landMeshes) {
        if (data.mesh === hitMesh) {
          newHoveredLand = id;
          break;
        }
      }
    }

    if (newHoveredLand !== this.state.hoveredLand) {
      this.state.hoveredLand = newHoveredLand;
      this.updateHoverStates();
      this.updateLabel();
    }
  }

  private updateHoverStates(): void {
    for (const [id, data] of this.landMeshes) {
      const isHovered = id === this.state.hoveredLand;
      data.targetElevation = isHovered ? 0.08 : 0;
      data.targetHighlight = isHovered ? 1 : 0;

      if (isHovered) {
        data.targetTilt.set(
          this.state.normalizedMouse.y * 0.1,
          -this.state.normalizedMouse.x * 0.1,
        );
      } else {
        data.targetTilt.set(0, 0);
      }
    }
  }

  private updateLabel(): void {
    if (!this.labelElement) return;

    if (this.state.hoveredLand) {
      const data = this.landMeshes.get(this.state.hoveredLand);
      if (data) {
        this.labelElement.textContent = data.land.name;
        this.labelElement.style.opacity = "1";
        this.labelElement.style.transform = "translateY(0)";
      }
    } else {
      this.labelElement.style.opacity = "0";
      this.labelElement.style.transform = "translateY(10px)";
    }
  }

  update(deltaTime: number): void {
    const lerpFactor = 1 - Math.pow(0.001, deltaTime);

    this.state.currentMapRotation.lerp(
      this.state.targetMapRotation,
      lerpFactor,
    );

    if (this.mapGroup) {
      this.mapGroup.rotation.x = this.state.currentMapRotation.x;
      this.mapGroup.rotation.y = this.state.currentMapRotation.y;
    }

    for (const data of this.landMeshes.values()) {
      data.currentElevation = THREE.MathUtils.lerp(
        data.currentElevation,
        data.targetElevation,
        lerpFactor,
      );

      data.currentHighlight = THREE.MathUtils.lerp(
        data.currentHighlight,
        data.targetHighlight,
        lerpFactor,
      );

      data.currentTilt.lerp(data.targetTilt, lerpFactor);

      data.mesh.position.z = data.currentElevation;

      data.mesh.rotation.x = -Math.PI * 0.05 + data.currentTilt.x;
      data.mesh.rotation.y = data.currentTilt.y;

      const material = data.mesh.material as THREE.ShaderMaterial;
      if (material.uniforms && material.uniforms.uHover) {
        material.uniforms.uHover.value = data.currentHighlight;
      }
    }
  }

  getHoveredLand(): string | null {
    return this.state.hoveredLand;
  }

  getCursorStyle(): string {
    return this.state.hoveredLand ? "pointer" : "default";
  }
}
