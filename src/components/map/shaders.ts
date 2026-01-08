export const paperVertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  
  uniform float uHover;
  uniform float uTime;
  
  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    
    vec3 pos = position;
    pos.z += uHover * 0.03;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

export const paperFragmentShader = `
  precision highp float;
  
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  
  uniform vec3 uColor;
  uniform vec3 uAccentColor;
  uniform float uHover;
  uniform float uTime;
  uniform vec2 uResolution;
  
  // Simplex noise functions for paper texture
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
  
  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                        -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
                     + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
                            dot(x12.zw,x12.zw)), 0.0);
    m = m*m;
    m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }
  
  float fbm(vec2 p) {
    float f = 0.0;
    float w = 0.5;
    for (int i = 0; i < 5; i++) {
      f += w * snoise(p);
      p *= 2.0;
      w *= 0.5;
    }
    return f;
  }
  
  void main() {
    vec2 uv = vUv;
    
    // Base aged paper color with warm sepia tones
    vec3 paperBase = vec3(0.92, 0.87, 0.78);
    vec3 paperDark = vec3(0.75, 0.68, 0.58);
    
    // Multi-layered paper texture noise
    float noise1 = fbm(uv * 15.0);
    float noise2 = fbm(uv * 30.0 + 5.0);
    float noise3 = snoise(uv * 50.0);
    
    // Combine noise layers for paper grain
    float paperNoise = noise1 * 0.3 + noise2 * 0.15 + noise3 * 0.05;
    vec3 paperColor = mix(paperDark, paperBase, 0.5 + paperNoise * 0.5);
    
    // Add age spots and stains
    float stains = fbm(uv * 5.0 + vec2(3.0, 7.0));
    stains = smoothstep(0.2, 0.8, stains);
    paperColor = mix(paperColor, paperDark * 0.9, stains * 0.15);
    
    // Land color with pencil/crayon texture
    vec3 landColor = uColor;
    
    // Add crayon texture effect
    float crayonNoise = fbm(uv * 40.0 + uTime * 0.01);
    float crayonStrokes = snoise(uv * 80.0);
    landColor = mix(landColor, uAccentColor, crayonNoise * 0.3);
    landColor += crayonStrokes * 0.05;
    
    // Edge detection for pencil line effect
    float edgeFactor = length(fwidth(vPosition.xy)) * 50.0;
    float edgeNoise = snoise(uv * 100.0) * 0.5 + 0.5;
    float pencilLine = smoothstep(0.0, 0.1, edgeFactor) * edgeNoise;
    
    // Darken edges for hand-drawn look
    vec3 pencilColor = vec3(0.2, 0.18, 0.15);
    landColor = mix(landColor, pencilColor, pencilLine * 0.4);
    
    // Apply paper texture underneath
    vec3 finalColor = mix(paperColor, landColor, 0.85);
    
    // Lighting based on normal for depth
    vec3 lightDir = normalize(vec3(0.5, 0.5, 1.0));
    float diffuse = max(dot(vNormal, lightDir), 0.0);
    finalColor *= 0.7 + diffuse * 0.4;
    
    // Hover highlight effect
    finalColor = mix(finalColor, finalColor * 1.2, uHover * 0.5);
    finalColor += vec3(0.1, 0.08, 0.05) * uHover;
    
    // Subtle vignette on edges
    vec2 vignetteUv = vUv * 2.0 - 1.0;
    float vignette = 1.0 - dot(vignetteUv, vignetteUv) * 0.2;
    finalColor *= vignette;
    
    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

export const backgroundVertexShader = `
  varying vec2 vUv;
  
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const backgroundFragmentShader = `
  precision highp float;
  
  varying vec2 vUv;
  
  uniform float uTime;
  uniform vec2 uResolution;
  
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
  
  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                        -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
                     + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
                            dot(x12.zw,x12.zw)), 0.0);
    m = m*m;
    m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }
  
  float fbm(vec2 p) {
    float f = 0.0;
    float w = 0.5;
    for (int i = 0; i < 6; i++) {
      f += w * snoise(p);
      p *= 2.0;
      w *= 0.5;
    }
    return f;
  }
  
  void main() {
    vec2 uv = vUv;
    
    // Ocean/sea color base - aged parchment blue-green
    vec3 oceanBase = vec3(0.65, 0.72, 0.75);
    vec3 oceanDeep = vec3(0.55, 0.62, 0.68);
    vec3 paperTint = vec3(0.88, 0.83, 0.75);
    
    // Large scale ocean variation
    float oceanNoise = fbm(uv * 3.0 + uTime * 0.005);
    vec3 oceanColor = mix(oceanDeep, oceanBase, oceanNoise * 0.5 + 0.5);
    
    // Add paper texture overlay
    float paperNoise1 = fbm(uv * 10.0);
    float paperNoise2 = snoise(uv * 25.0);
    float paperTexture = paperNoise1 * 0.4 + paperNoise2 * 0.1;
    
    // Blend ocean with paper tint for aged look
    vec3 color = mix(oceanColor, paperTint, 0.3 + paperTexture * 0.2);
    
    // Add subtle wave patterns
    float waves = sin(uv.x * 30.0 + uv.y * 15.0 + uTime * 0.1) * 0.5 + 0.5;
    waves *= snoise(uv * 20.0) * 0.5 + 0.5;
    color = mix(color, color * 1.05, waves * 0.1);
    
    // Age spots and stains
    float stains = fbm(uv * 4.0 + vec2(10.0, 5.0));
    stains = smoothstep(0.3, 0.7, stains);
    color = mix(color, color * 0.85, stains * 0.2);
    
    // Creases and fold marks
    float crease1 = smoothstep(0.48, 0.5, abs(uv.x - 0.5));
    float crease2 = smoothstep(0.48, 0.5, abs(uv.y - 0.5));
    color *= 1.0 - (1.0 - crease1) * 0.05;
    color *= 1.0 - (1.0 - crease2) * 0.03;
    
    // Border/edge darkening (vignette)
    vec2 vignetteUv = uv * 2.0 - 1.0;
    float vignette = 1.0 - dot(vignetteUv, vignetteUv) * 0.3;
    vignette = smoothstep(0.0, 1.0, vignette);
    color *= vignette * 0.3 + 0.7;
    
    // Torn edge effect at borders
    float edgeNoise = fbm(uv * 50.0);
    float borderDist = min(min(uv.x, 1.0 - uv.x), min(uv.y, 1.0 - uv.y));
    float tornEdge = smoothstep(0.0, 0.03 + edgeNoise * 0.02, borderDist);
    color = mix(vec3(0.6, 0.55, 0.48), color, tornEdge);
    
    gl_FragColor = vec4(color, 1.0);
  }
`;

export const decorationVertexShader = `
  varying vec2 vUv;
  
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const decorationFragmentShader = `
  precision highp float;
  
  varying vec2 vUv;
  
  uniform vec3 uColor;
  uniform float uTime;
  
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
  
  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                        -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
                     + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
                            dot(x12.zw,x12.zw)), 0.0);
    m = m*m;
    m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }
  
  void main() {
    vec2 uv = vUv;
    
    // Pencil/ink color with hand-drawn variation
    vec3 inkColor = uColor;
    
    // Add pencil stroke texture
    float strokeNoise = snoise(uv * 100.0);
    float strokePattern = snoise(uv * 50.0 + vec2(strokeNoise * 0.5));
    
    inkColor += strokePattern * 0.1;
    
    // Vary opacity for sketch effect
    float alpha = 0.8 + strokeNoise * 0.2;
    alpha *= smoothstep(0.0, 0.1, uv.x) * smoothstep(1.0, 0.9, uv.x);
    alpha *= smoothstep(0.0, 0.1, uv.y) * smoothstep(1.0, 0.9, uv.y);
    
    gl_FragColor = vec4(inkColor, alpha);
  }
`;

export const labelVertexShader = `
  varying vec2 vUv;
  
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const labelFragmentShader = `
  precision highp float;
  
  varying vec2 vUv;
  
  uniform sampler2D uTexture;
  uniform float uOpacity;
  
  void main() {
    vec4 texColor = texture2D(uTexture, vUv);
    gl_FragColor = vec4(texColor.rgb, texColor.a * uOpacity);
  }
`;
