import * as THREE from "three";

export interface LandData {
  id: string;
  name: string;
  description: string;
  size: number; // 1-5 scale, bigger = more important
  position: { x: number; y: number };
  color: string;
  accentColor: string;
}

// Land definitions - sizes reflect importance (1-5 scale)
export const LANDS: LandData[] = [
  {
    id: "coding-peaks",
    name: "The Coding Peaks",
    description: "Where algorithms meet the clouds",
    size: 5,
    position: { x: -0.3, y: 0.25 },
    color: "#8B7355",
    accentColor: "#A0522D",
  },
  {
    id: "open-source-forest",
    name: "Open Source Forest",
    description: "Ancient trees of shared knowledge",
    size: 4,
    position: { x: 0.35, y: 0.15 },
    color: "#6B8E6B",
    accentColor: "#556B2F",
  },
  {
    id: "tech-archipelago",
    name: "Tech Archipelago",
    description: "Islands of innovation",
    size: 4,
    position: { x: 0.4, y: -0.3 },
    color: "#7B9BA6",
    accentColor: "#5F9EA0",
  },
  {
    id: "music-valley",
    name: "Music Valley",
    description: "Where melodies flow like rivers",
    size: 3,
    position: { x: -0.4, y: -0.2 },
    color: "#9B7BB3",
    accentColor: "#8B668B",
  },
  {
    id: "gaming-plains",
    name: "Gaming Plains",
    description: "Vast fields of digital adventure",
    size: 3,
    position: { x: 0.0, y: -0.35 },
    color: "#B8A07A",
    accentColor: "#D2B48C",
  },
  {
    id: "hardware-hills",
    name: "Hardware Hills",
    description: "Rolling hills of silicon and solder",
    size: 2,
    position: { x: -0.15, y: 0.4 },
    color: "#A08070",
    accentColor: "#BC8F8F",
  },
];

// Generate organic land shape vertices
function generateLandShape(
  size: number,
  irregularity: number = 0.3,
  segments: number = 32,
): THREE.Vector2[] {
  const points: THREE.Vector2[] = [];
  const baseRadius = 0.08 + size * 0.04;

  for (let i = 0; i < segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    // Add multiple noise frequencies for organic feel
    const noise1 = Math.sin(angle * 3) * 0.15;
    const noise2 = Math.sin(angle * 5 + 1.5) * 0.1;
    const noise3 = Math.sin(angle * 7 + 3) * 0.05;
    const randomNoise = (Math.random() - 0.5) * irregularity * 0.1;

    const radius = baseRadius * (1 + noise1 + noise2 + noise3 + randomNoise);
    points.push(
      new THREE.Vector2(Math.cos(angle) * radius, Math.sin(angle) * radius),
    );
  }

  return points;
}

// Create a land mesh with extrusion for 3D effect
export function createLandGeometry(land: LandData): THREE.ExtrudeGeometry {
  const shapePoints = generateLandShape(land.size, 0.4);
  const shape = new THREE.Shape(shapePoints);

  // Add some internal "lakes" or holes for larger lands
  if (land.size >= 4) {
    const holePoints = generateLandShape(1, 0.5, 16);
    const hole = new THREE.Path(
      holePoints.map(
        (p) => new THREE.Vector2(p.x * 0.3 + 0.02, p.y * 0.3 + 0.01),
      ),
    );
    shape.holes.push(hole);
  }

  const extrudeSettings = {
    steps: 1,
    depth: 0.02 + land.size * 0.008,
    bevelEnabled: true,
    bevelThickness: 0.005,
    bevelSize: 0.005,
    bevelOffset: 0,
    bevelSegments: 3,
  };

  return new THREE.ExtrudeGeometry(shape, extrudeSettings);
}

// Generate decorative elements data
export interface DecorationData {
  type: "mountain" | "tree" | "city" | "wave" | "monster";
  position: THREE.Vector3;
  scale: number;
  rotation: number;
}

export function generateDecorations(land: LandData): DecorationData[] {
  const decorations: DecorationData[] = [];
  const baseX = land.position.x;
  const baseY = land.position.y;
  const landRadius = 0.08 + land.size * 0.04;

  // Add trees for forest land
  if (land.id === "open-source-forest") {
    for (let i = 0; i < 8; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * landRadius * 0.6;
      decorations.push({
        type: "tree",
        position: new THREE.Vector3(
          baseX + Math.cos(angle) * dist,
          baseY + Math.sin(angle) * dist,
          0.05,
        ),
        scale: 0.3 + Math.random() * 0.4,
        rotation: Math.random() * 0.3,
      });
    }
  }

  // Add mountains for peaks
  if (land.id === "coding-peaks") {
    for (let i = 0; i < 5; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * landRadius * 0.5;
      decorations.push({
        type: "mountain",
        position: new THREE.Vector3(
          baseX + Math.cos(angle) * dist,
          baseY + Math.sin(angle) * dist,
          0.05,
        ),
        scale: 0.4 + Math.random() * 0.5,
        rotation: Math.random() * 0.2,
      });
    }
  }

  // Add city markers
  if (land.id === "tech-archipelago" || land.id === "hardware-hills") {
    for (let i = 0; i < 3; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * landRadius * 0.4;
      decorations.push({
        type: "city",
        position: new THREE.Vector3(
          baseX + Math.cos(angle) * dist,
          baseY + Math.sin(angle) * dist,
          0.05,
        ),
        scale: 0.2 + Math.random() * 0.3,
        rotation: 0,
      });
    }
  }

  return decorations;
}

// Create mountain decoration geometry
export function createMountainGeometry(): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.lineTo(0.015, 0.04);
  shape.lineTo(0.008, 0.025);
  shape.lineTo(0.02, 0.03);
  shape.lineTo(0.03, 0);
  shape.lineTo(0, 0);

  return new THREE.ShapeGeometry(shape);
}

// Create tree decoration geometry
export function createTreeGeometry(): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  // Pine tree shape
  shape.moveTo(0, 0);
  shape.lineTo(0.008, 0.015);
  shape.lineTo(0.004, 0.015);
  shape.lineTo(0.01, 0.028);
  shape.lineTo(0.005, 0.028);
  shape.lineTo(0.012, 0.04);
  shape.lineTo(-0.012, 0.04);
  shape.lineTo(-0.005, 0.028);
  shape.lineTo(-0.01, 0.028);
  shape.lineTo(-0.004, 0.015);
  shape.lineTo(-0.008, 0.015);
  shape.lineTo(0, 0);

  return new THREE.ShapeGeometry(shape);
}

// Create city marker geometry
export function createCityGeometry(): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  // Simple building cluster
  shape.moveTo(-0.01, 0);
  shape.lineTo(-0.01, 0.015);
  shape.lineTo(-0.005, 0.015);
  shape.lineTo(-0.005, 0.025);
  shape.lineTo(0, 0.025);
  shape.lineTo(0, 0.02);
  shape.lineTo(0.005, 0.02);
  shape.lineTo(0.005, 0.015);
  shape.lineTo(0.01, 0.015);
  shape.lineTo(0.01, 0);
  shape.lineTo(-0.01, 0);

  return new THREE.ShapeGeometry(shape);
}

// Create sea monster geometry
export function createSeaMonsterGeometry(): THREE.BufferGeometry {
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0.02, 0.015, 0),
    new THREE.Vector3(0.04, 0.005, 0),
    new THREE.Vector3(0.06, 0.02, 0),
    new THREE.Vector3(0.08, 0.01, 0),
  ]);

  const points = curve.getPoints(20);
  const shape = new THREE.Shape();

  shape.moveTo(points[0].x, points[0].y - 0.005);

  // Upper curve
  for (let i = 1; i < points.length; i++) {
    shape.lineTo(points[i].x, points[i].y);
  }

  // Add head
  const lastPoint = points[points.length - 1];
  shape.lineTo(lastPoint.x + 0.01, lastPoint.y + 0.005);
  shape.lineTo(lastPoint.x + 0.015, lastPoint.y);
  shape.lineTo(lastPoint.x + 0.01, lastPoint.y - 0.005);

  // Lower curve (reversed)
  for (let i = points.length - 1; i >= 0; i--) {
    shape.lineTo(points[i].x, points[i].y - 0.01);
  }

  shape.lineTo(points[0].x, points[0].y - 0.005);

  return new THREE.ShapeGeometry(shape);
}

// Create compass rose geometry
export function createCompassRoseGeometry(): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  const points = 8;
  const outerRadius = 0.06;
  const innerRadius = 0.02;

  for (let i = 0; i < points * 2; i++) {
    const angle = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2;
    const radius = i % 2 === 0 ? outerRadius : innerRadius;

    // Main cardinal points are longer
    const isCardinal = i % 4 === 0;
    const finalRadius = isCardinal ? radius * 1.3 : radius;

    const x = Math.cos(angle) * finalRadius;
    const y = Math.sin(angle) * finalRadius;

    if (i === 0) {
      shape.moveTo(x, y);
    } else {
      shape.lineTo(x, y);
    }
  }

  shape.closePath();

  return new THREE.ShapeGeometry(shape);
}

// Wave decoration for ocean areas
export function createWaveGeometry(): THREE.BufferGeometry {
  const curve = new THREE.QuadraticBezierCurve(
    new THREE.Vector2(0, 0),
    new THREE.Vector2(0.015, 0.01),
    new THREE.Vector2(0.03, 0),
  );

  const points = curve.getPoints(10);
  const vertices: number[] = [];

  for (let i = 0; i < points.length - 1; i++) {
    vertices.push(points[i].x, points[i].y, 0);
    vertices.push(points[i + 1].x, points[i + 1].y, 0);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(vertices, 3),
  );

  return geometry;
}
