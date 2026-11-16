import * as THREE from "three";

/* ============================================================
   锁暝配色 · 以绯红为骨，契金为饰，紫电为气
   ============================================================ */
const PALETTE = {
  ink: 0x060305,
  blood: 0x5c0a16,
  red: 0xc0142f,
  redLt: 0xff3a56,
  redGlow: 0xff8a9b,
  violet: 0x6a3ae0,
  violetLt: 0xa98bff,
  gold: 0xc2a061,
  goldLt: 0xf2ddab,
  mirror: 0xe9dde0,
  paper: 0xfdf4f5,
};

export interface ZaniBackgroundHandle {
  cleanup: () => void;
}

export default function initZaniBackground(
  container: HTMLElement
): ZaniBackgroundHandle {
  let width = container.clientWidth || window.innerWidth;
  let height = container.clientHeight || window.innerHeight;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  /* ============================================================
     场景 / 相机 / 渲染器
     ============================================================ */
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 500);
  camera.position.set(0, 1.5, 32);

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(dpr);
  renderer.setSize(width, height);
  renderer.setClearColor(0x000000, 0);
  container.appendChild(renderer.domElement);

  /* ============================================================
     灯光（供伞骨 / 伞柄等实体材质使用）
     ============================================================ */
  scene.add(new THREE.AmbientLight(0x2a1016, 1.4));

  const keyLight = new THREE.PointLight(PALETTE.redLt, 110, 0, 2);
  keyLight.position.set(6, 12, 14);
  scene.add(keyLight);

  const rimGold = new THREE.PointLight(PALETTE.gold, 80, 0, 2);
  rimGold.position.set(-12, 5, -8);
  scene.add(rimGold);

  const rimViolet = new THREE.PointLight(PALETTE.violet, 55, 0, 2);
  rimViolet.position.set(2, -10, -14);
  scene.add(rimViolet);

  /* ============================================================
     一、墨晕雾团（远层氛围）
     ============================================================ */
  const MIST_COUNT = 64;
  const mistPos = new Float32Array(MIST_COUNT * 3);
  const mistCol = new Float32Array(MIST_COUNT * 3);
  const mistSize = new Float32Array(MIST_COUNT);
  const mistPhase = new Float32Array(MIST_COUNT);

  const mistPalette = [
    new THREE.Color(PALETTE.blood),
    new THREE.Color(PALETTE.violet).lerp(new THREE.Color(PALETTE.ink), 0.35),
    new THREE.Color(PALETTE.red).lerp(new THREE.Color(PALETTE.ink), 0.5),
    new THREE.Color(PALETTE.blood).lerp(new THREE.Color(PALETTE.violet), 0.4),
  ];

  for (let i = 0; i < MIST_COUNT; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 16 + Math.pow(Math.random(), 0.7) * 42;
    mistPos[i * 3] = Math.cos(angle) * radius;
    mistPos[i * 3 + 1] = (Math.random() - 0.5) * 42;
    mistPos[i * 3 + 2] = Math.sin(angle) * radius * 0.85;

    const c = mistPalette[Math.floor(Math.random() * mistPalette.length)];
    mistCol[i * 3] = c.r;
    mistCol[i * 3 + 1] = c.g;
    mistCol[i * 3 + 2] = c.b;

    mistSize[i] = 10 + Math.random() * 22;
    mistPhase[i] = Math.random() * Math.PI * 2;
  }

  const mistGeo = new THREE.BufferGeometry();
  mistGeo.setAttribute("position", new THREE.BufferAttribute(mistPos, 3));
  mistGeo.setAttribute("aColor", new THREE.BufferAttribute(mistCol, 3));
  mistGeo.setAttribute("aSize", new THREE.BufferAttribute(mistSize, 1));
  mistGeo.setAttribute("aPhase", new THREE.BufferAttribute(mistPhase, 1));

  const mistMat = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uPixelRatio: { value: dpr },
    },
    vertexShader: /* glsl */ `
      uniform float uTime;
      uniform float uPixelRatio;

      attribute vec3 aColor;
      attribute float aSize;
      attribute float aPhase;

      varying vec3 vColor;
      varying float vAlpha;

      void main() {
        vColor = aColor;

        vec3 p = position;
        p.x += sin(uTime * 0.14 + aPhase) * 4.0;
        p.y += cos(uTime * 0.11 + aPhase * 1.3) * 3.2;
        p.z += sin(uTime * 0.09 + aPhase * 0.7) * 2.6;

        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        float dist = max(-mv.z, 1.0);

        gl_PointSize = aSize * uPixelRatio * (280.0 / dist);
        gl_PointSize = min(gl_PointSize, 260.0);

        vAlpha = smoothstep(150.0, 40.0, dist);

        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: /* glsl */ `
      varying vec3 vColor;
      varying float vAlpha;

      void main() {
        vec2 uv = gl_PointCoord - 0.5;
        float d = length(uv);
        if (d > 0.5) discard;

        float alpha = pow(1.0 - d * 2.0, 3.0);
        gl_FragColor = vec4(vColor, alpha * vAlpha * 0.085);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const mist = new THREE.Points(mistGeo, mistMat);
  scene.add(mist);

  /* ============================================================
     二、余烬粒子（中层）
     ============================================================ */
  const COUNT = 2400;
  const positions = new Float32Array(COUNT * 3);
  const colors = new Float32Array(COUNT * 3);
  const sizes = new Float32Array(COUNT);
  const phases = new Float32Array(COUNT);
  const speeds = new Float32Array(COUNT);

  const colorPool = [
    { c: new THREE.Color(PALETTE.red), w: 0.2 },
    {
      c: new THREE.Color(PALETTE.blood).lerp(new THREE.Color(PALETTE.red), 0.5),
      w: 0.15,
    },
    { c: new THREE.Color(PALETTE.redLt), w: 0.14 },
    { c: new THREE.Color(PALETTE.redGlow), w: 0.1 },
    { c: new THREE.Color(PALETTE.violet), w: 0.12 },
    { c: new THREE.Color(PALETTE.violetLt), w: 0.08 },
    { c: new THREE.Color(PALETTE.gold), w: 0.12 },
    { c: new THREE.Color(PALETTE.goldLt), w: 0.06 },
    { c: new THREE.Color(PALETTE.mirror), w: 0.03 },
  ];
  const totalW = colorPool.reduce((s, i) => s + i.w, 0);
  const cumulative: number[] = [];
  let acc = 0;
  colorPool.forEach((item) => {
    acc += item.w / totalW;
    cumulative.push(acc);
  });

  const tmpColor = new THREE.Color();
  function pickColor(out: THREE.Color) {
    const r = Math.random();
    for (let i = 0; i < cumulative.length; i++) {
      if (r <= cumulative[i]) {
        out.copy(colorPool[i].c);
        return;
      }
    }
    out.copy(colorPool[0].c);
  }

  for (let i = 0; i < COUNT; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 5 + Math.pow(Math.random(), 0.75) * 46;
    positions[i * 3] = Math.cos(angle) * radius;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 56;
    positions[i * 3 + 2] = Math.sin(angle) * radius * 0.85;

    pickColor(tmpColor);
    colors[i * 3] = tmpColor.r;
    colors[i * 3 + 1] = tmpColor.g;
    colors[i * 3 + 2] = tmpColor.b;

    sizes[i] = 0.35 + Math.random() * 1.45;
    phases[i] = Math.random() * Math.PI * 2;
    speeds[i] = 0.3 + Math.random() * 1.1;
  }

  const particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  particleGeo.setAttribute("aColor", new THREE.BufferAttribute(colors, 3));
  particleGeo.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
  particleGeo.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));
  particleGeo.setAttribute("aSpeed", new THREE.BufferAttribute(speeds, 1));

  const particleMat = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uPixelRatio: { value: dpr },
    },
    vertexShader: /* glsl */ `
      uniform float uTime;
      uniform float uPixelRatio;

      attribute vec3 aColor;
      attribute float aSize;
      attribute float aPhase;
      attribute float aSpeed;

      varying vec3 vColor;
      varying float vFade;

      void main() {
        vColor = aColor;

        vec3 p = position;
        float range = 56.0;
        float wrapped = mod(position.y + uTime * aSpeed + range * 0.5, range);
        p.y = wrapped - range * 0.5;

        p.x += sin(uTime * 0.5 + aPhase) * 1.4;
        p.z += cos(uTime * 0.42 + aPhase) * 1.4;

        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        float dist = max(-mv.z, 1.0);

        gl_PointSize = aSize * uPixelRatio * (220.0 / dist);
        gl_PointSize *= 0.72 + 0.28 * sin(uTime * 1.6 + aPhase);

        float yNorm = wrapped / range;
        float edgeFade =
          smoothstep(0.0, 0.10, yNorm) * smoothstep(1.0, 0.90, yNorm);

        vFade = smoothstep(140.0, 45.0, dist) * edgeFade;

        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: /* glsl */ `
      varying vec3 vColor;
      varying float vFade;

      void main() {
        vec2 uv = gl_PointCoord - 0.5;
        float d = length(uv);
        if (d > 0.5) discard;

        float core = pow(smoothstep(0.5, 0.0, d), 2.4);
        float halo = pow(smoothstep(0.5, 0.0, d), 0.7) * 0.42;

        float alpha = (core + halo) * vFade * 0.9;

        gl_FragColor = vec4(vColor, alpha);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const particles = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);

  /* ============================================================
     三、机关伞「九方故影」
     ============================================================ */
  const UMBRELLA_RADIUS = 11;
  const UMBRELLA_HEIGHT = 3.4;
  const EDGE_WAVE = 0.55;
  const RIB_COUNT = 10;
  const RADIAL_SEG = 108;
  const RING_SEG = 36;

  /* 伞面高度函数：t ∈ [0,1] 为归一化半径，a 为极角 */
  function canopyY(t: number, a: number): number {
    const base = -UMBRELLA_HEIGHT * Math.pow(t, 1.7);
    const wave = EDGE_WAVE * Math.pow(t, 2.4) * Math.cos(RIB_COUNT * a);
    return base + wave;
  }

  const umbrellaGroup = new THREE.Group();
  scene.add(umbrellaGroup);

  /* ---------- 3.1 伞面 ---------- */
  const canopyPos: number[] = [];
  const canopyUv: number[] = [];
  const canopyIdx: number[] = [];

  for (let i = 0; i <= RING_SEG; i++) {
    const t = i / RING_SEG;
    const r = t * UMBRELLA_RADIUS;
    for (let j = 0; j <= RADIAL_SEG; j++) {
      const a = (j / RADIAL_SEG) * Math.PI * 2;
      const y = canopyY(t, a);
      canopyPos.push(Math.cos(a) * r, y, Math.sin(a) * r);
      canopyUv.push(j / RADIAL_SEG, t);
    }
  }

  for (let i = 0; i < RING_SEG; i++) {
    for (let j = 0; j < RADIAL_SEG; j++) {
      const a = i * (RADIAL_SEG + 1) + j;
      const b = a + RADIAL_SEG + 1;
      canopyIdx.push(a, a + 1, b);
      canopyIdx.push(b, a + 1, b + 1);
    }
  }

  const canopyGeo = new THREE.BufferGeometry();
  canopyGeo.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(canopyPos, 3)
  );
  canopyGeo.setAttribute("uv", new THREE.Float32BufferAttribute(canopyUv, 2));
  canopyGeo.setIndex(canopyIdx);
  canopyGeo.computeVertexNormals();

  const canopyMat = new THREE.ShaderMaterial({
    uniforms: {
      uBase: { value: new THREE.Color(PALETTE.blood) },
      uMid: { value: new THREE.Color(PALETTE.red) },
      uEdge: { value: new THREE.Color(PALETTE.redLt) },
      uRib: { value: new THREE.Color(PALETTE.goldLt) },
      uTime: { value: 0 },
      uRibCount: { value: RIB_COUNT },
    },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vViewPos;

      void main() {
        vUv = uv;
        vNormal = normalize(normalMatrix * normal);
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vViewPos = -mv.xyz;
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uBase;
      uniform vec3 uMid;
      uniform vec3 uEdge;
      uniform vec3 uRib;
      uniform float uTime;
      uniform float uRibCount;

      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vViewPos;

      void main() {
        vec3 N = normalize(vNormal);
        vec3 V = normalize(vViewPos);

        float fres = pow(1.0 - abs(dot(N, V)), 2.0);
        float edge = smoothstep(0.82, 1.0, vUv.y);

        float ribCos = cos(uRibCount * 6.2831853 * vUv.x);
        float ribLine = pow(abs(ribCos), 26.0);
        ribLine *= smoothstep(0.08, 0.3, vUv.y);

        vec3 col = mix(uBase, uMid, smoothstep(0.0, 0.7, vUv.y));
        col = mix(col, uEdge, fres * 0.7 + edge * 0.55);
        col = mix(col, uRib, ribLine * 0.8);

        float pulse = 0.86 + 0.14 * sin(uTime * 1.1 - vUv.y * 5.0);
        col *= pulse;

        if (!gl_FrontFacing) {
          col *= 0.5;
          col += vec3(0.05, 0.02, 0.08);
        }

        float alpha = 0.32 + fres * 0.35 + edge * 0.42 + ribLine * 0.38;
        alpha = clamp(alpha, 0.0, 0.95);

        gl_FragColor = vec4(col, alpha);
      }
    `,
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
  });

  const canopy = new THREE.Mesh(canopyGeo, canopyMat);
  umbrellaGroup.add(canopy);

  /* ---------- 3.2 伞骨（贴合伞面、沿 0 号伞骨剖面） ---------- */
  const ribPoints: THREE.Vector3[] = [];
  const RIB_SAMPLES = 32;
  for (let i = 0; i <= RIB_SAMPLES; i++) {
    const t = i / RIB_SAMPLES;
    const r = t * UMBRELLA_RADIUS;
    const y = canopyY(t, 0) - 0.08;
    ribPoints.push(new THREE.Vector3(r, y, 0));
  }
  const ribCurve = new THREE.CatmullRomCurve3(ribPoints);
  const ribGeo = new THREE.TubeGeometry(ribCurve, 72, 0.07, 6, false);

  const ribMat = new THREE.MeshStandardMaterial({
    color: PALETTE.gold,
    emissive: new THREE.Color(PALETTE.red).multiplyScalar(0.35),
    metalness: 0.85,
    roughness: 0.28,
  });

  for (let k = 0; k < RIB_COUNT; k++) {
    const rib = new THREE.Mesh(ribGeo, ribMat);
    rib.rotation.y = (k / RIB_COUNT) * Math.PI * 2;
    umbrellaGroup.add(rib);
  }

  /* ---------- 3.3 伞珠（骨端小球） ---------- */
  const beadGeo = new THREE.SphereGeometry(0.115, 10, 10);
  const beadMat = new THREE.MeshStandardMaterial({
    color: PALETTE.goldLt,
    emissive: new THREE.Color(PALETTE.gold).multiplyScalar(0.6),
    metalness: 0.9,
    roughness: 0.2,
  });

  for (let k = 0; k < RIB_COUNT; k++) {
    const a = (k / RIB_COUNT) * Math.PI * 2;
    const r = UMBRELLA_RADIUS;
    const y = canopyY(1, a) - 0.08;
    const bead = new THREE.Mesh(beadGeo, beadMat);
    bead.position.set(Math.cos(a) * r, y, Math.sin(a) * r);
    umbrellaGroup.add(bead);
  }

  /* ---------- 3.4 伞柄（含底部弯钩） ---------- */
  const handlePoints = [
    new THREE.Vector3(0, 1.0, 0),
    new THREE.Vector3(0, -1.5, 0),
    new THREE.Vector3(0, -4.5, 0),
    new THREE.Vector3(0, -7.0, 0),
    new THREE.Vector3(0, -8.2, 0),
    new THREE.Vector3(0.35, -8.95, 0),
    new THREE.Vector3(0.95, -9.05, 0),
    new THREE.Vector3(1.42, -8.6, 0),
    new THREE.Vector3(1.55, -8.0, 0),
  ];
  const handleCurve = new THREE.CatmullRomCurve3(handlePoints);
  const handleGeo = new THREE.TubeGeometry(handleCurve, 96, 0.1, 8, false);

  const handleMat = new THREE.MeshStandardMaterial({
    color: PALETTE.blood,
    emissive: new THREE.Color(PALETTE.red).multiplyScalar(0.22),
    metalness: 0.7,
    roughness: 0.36,
  });

  const handle = new THREE.Mesh(handleGeo, handleMat);
  umbrellaGroup.add(handle);

  /* 弯钩末端小球 */
  const handleEnd = new THREE.Mesh(
    new THREE.SphereGeometry(0.13, 10, 10),
    beadMat
  );
  handleEnd.position.set(1.55, -8.0, 0);
  umbrellaGroup.add(handleEnd);

  /* ---------- 3.5 伞尖 ---------- */
  const topRod = new THREE.Mesh(
    new THREE.CylinderGeometry(0.065, 0.065, 0.95, 8),
    handleMat
  );
  topRod.position.set(0, 0.55, 0);
  umbrellaGroup.add(topRod);

  const tipCone = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.8, 14), ribMat);
  tipCone.position.set(0, 1.4, 0);
  umbrellaGroup.add(tipCone);

  const tipBall = new THREE.Mesh(
    new THREE.SphereGeometry(0.1, 10, 10),
    beadMat
  );
  tipBall.position.set(0, 1.85, 0);
  umbrellaGroup.add(tipBall);

  /* ---------- 3.6 姿态 ---------- */
  umbrellaGroup.rotation.x = 0.38;
  umbrellaGroup.rotation.z = 0.1;
  umbrellaGroup.position.y = 1.6;

  /* ============================================================
     四、伞下光斑（为悬浮伞托底，也让画面更稳）
     ============================================================ */
  const glowSize = 40;
  const glowGeo = new THREE.PlaneGeometry(glowSize, glowSize);
  const glowMat = new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: new THREE.Color(PALETTE.red) },
      uTime: { value: 0 },
    },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor;
      uniform float uTime;
      varying vec2 vUv;

      void main() {
        vec2 p = vUv - 0.5;
        float d = length(p) * 2.0;
        float a = smoothstep(1.0, 0.0, d);
        a = pow(a, 2.2) * (0.14 + 0.03 * sin(uTime * 0.8));

        gl_FragColor = vec4(uColor, a);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const glow = new THREE.Mesh(glowGeo, glowMat);
  glow.rotation.x = -Math.PI / 2;
  glow.position.y = -13;
  scene.add(glow);

  /* ============================================================
     五、鼠标视差
     ============================================================ */
  let mouseX = 0;
  let mouseY = 0;

  function onPointerMove(e: PointerEvent) {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = (e.clientY / window.innerHeight) * 2 - 1;
  }
  window.addEventListener("pointermove", onPointerMove, { passive: true });

  /* ============================================================
     六、尺寸响应
     ============================================================ */
  function onResize() {
    width = container.clientWidth || window.innerWidth;
    height = container.clientHeight || window.innerHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    const nextDpr = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(nextDpr);
    renderer.setSize(width, height);
    particleMat.uniforms.uPixelRatio.value = nextDpr;
    mistMat.uniforms.uPixelRatio.value = nextDpr;
  }
  window.addEventListener("resize", onResize);

  /* ============================================================
     七、动画循环
     ============================================================ */
  const clock = new THREE.Clock();
  let elapsed = 0;
  let rafId = 0;

  function animate() {
    rafId = requestAnimationFrame(animate);

    const delta = Math.min(clock.getDelta(), 0.05);
    elapsed += delta;

    mistMat.uniforms.uTime.value = elapsed;
    particleMat.uniforms.uTime.value = elapsed;
    canopyMat.uniforms.uTime.value = elapsed;
    glowMat.uniforms.uTime.value = elapsed;

    /* 伞：缓慢自转 + 呼吸浮沉 + 轻微摇摆 */
    umbrellaGroup.rotation.y += delta * 0.24;
    umbrellaGroup.rotation.z = 0.1 + Math.sin(elapsed * 0.42) * 0.035;
    umbrellaGroup.rotation.x = 0.38 + Math.sin(elapsed * 0.27) * 0.025;
    umbrellaGroup.position.y = 1.6 + Math.sin(elapsed * 0.6) * 0.22;

    /* 相机：鼠标视差 + 自动呼吸 */
    const autoX = Math.sin(elapsed * 0.08) * 1.2;
    const autoY = Math.cos(elapsed * 0.11) * 0.9;

    const targetX = mouseX * 2.6 + autoX;
    const targetY = -mouseY * 2.0 + autoY + 1.4;

    camera.position.x += (targetX - camera.position.x) * 0.03;
    camera.position.y += (targetY - camera.position.y) * 0.03;
    camera.position.z = 32 + Math.sin(elapsed * 0.05) * 1.0;

    camera.up.set(Math.sin(elapsed * 0.06) * 0.035, 1, 0).normalize();
    camera.lookAt(0, -0.4, 0);

    renderer.render(scene, camera);
  }
  animate();

  /* ============================================================
     八、清理
     ============================================================ */
  function cleanup() {
    cancelAnimationFrame(rafId);

    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("resize", onResize);

    const disposedGeos = new Set<THREE.BufferGeometry>();
    const disposedMats = new Set<THREE.Material>();

    scene.traverse((obj) => {
      const renderable = obj as THREE.Mesh | THREE.Points;
      const geo = renderable.geometry;
      if (geo && !disposedGeos.has(geo)) {
        geo.dispose();
        disposedGeos.add(geo);
      }

      const mat = renderable.material;
      if (mat) {
        const mats = Array.isArray(mat) ? mat : [mat];
        mats.forEach((m) => {
          if (m && !disposedMats.has(m)) {
            m.dispose();
            disposedMats.add(m);
          }
        });
      }
    });

    scene.clear();

    renderer.dispose();
    if (renderer.domElement.parentNode === container) {
      container.removeChild(renderer.domElement);
    }
  }

  return { cleanup };
}
