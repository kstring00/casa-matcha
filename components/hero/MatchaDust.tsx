"use client";
import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { gsap } from "@/lib/gsap";
import { bus } from "@/lib/bus";
import { mulberry32 } from "@/lib/prng";

const COUNT = 3000;

const vertex = /* glsl */ `
  uniform float uTime;
  uniform vec2 uSize;
  uniform vec2 uPointer;
  uniform vec2 uCup;
  uniform float uBurst;
  uniform float uDpr;
  attribute float aSeed;
  attribute float aSize;
  attribute float aSpeed;
  varying float vAlpha;

  void main() {
    vec3 p = position;
    // slow upward drift with wrap + gentle sway
    float h = uSize.y + 80.0;
    p.y = mod(p.y + uTime * aSpeed + h * 0.5, h) - h * 0.5;
    p.x += sin(uTime * 0.35 + aSeed * 6.2831) * 18.0;

    // pointer push
    vec2 toP = p.xy - uPointer;
    float d = length(toP);
    float push = smoothstep(190.0, 0.0, d);
    p.xy += normalize(toP + 1e-4) * push * 70.0;

    // splash impulse from the cup, radial
    vec2 fromCup = p.xy - uCup;
    float dc = length(fromCup);
    float reach = smoothstep(uSize.y * 0.9, 0.0, dc);
    p.xy += normalize(fromCup + 1e-4) * uBurst * (60.0 + 260.0 * aSeed) * (0.4 + reach);

    // keep the cup label legible: fade dust near the label
    float label = smoothstep(uSize.y * 0.07, uSize.y * 0.2, distance(p.xy, uCup + vec2(0.0, -uSize.y * 0.09)));
    vAlpha = (0.25 + 0.55 * aSeed) * label;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aSize * uDpr * (1.0 + uBurst * 0.8);
  }
`;

const fragment = /* glsl */ `
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.08, d) * vAlpha;
    vec3 c = mix(vec3(0.62, 0.80, 0.42), vec3(0.42, 0.61, 0.25), d * 2.0);
    gl_FragColor = vec4(c * a, a);
  }
`;

function Dust({ active }: { active: boolean }) {
  const { size, gl } = useThree();
  const mat = useRef<THREE.ShaderMaterial>(null);
  const px = useRef(-9999);
  const py = useRef(-9999);
  const tx = useRef(-9999);
  const ty = useRef(-9999);
  const burst = useRef({ value: 0 });

  const { geometry } = useMemo(() => {
    const rand = mulberry32(20260926);
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(COUNT * 3);
    const seed = new Float32Array(COUNT);
    const sz = new Float32Array(COUNT);
    const spd = new Float32Array(COUNT);
    const w = 2400;
    const h = 1600;
    for (let i = 0; i < COUNT; i++) {
      pos[i * 3] = (rand() - 0.5) * w;
      pos[i * 3 + 1] = (rand() - 0.5) * h;
      pos[i * 3 + 2] = 0;
      seed[i] = rand();
      sz[i] = 2 + rand() * 9;
      spd[i] = 6 + rand() * 16;
    }
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geo.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
    geo.setAttribute("aSize", new THREE.BufferAttribute(sz, 1));
    geo.setAttribute("aSpeed", new THREE.BufferAttribute(spd, 1));
    return { geometry: geo };
  }, []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSize: { value: new THREE.Vector2(1, 1) },
      uPointer: { value: new THREE.Vector2(-9999, -9999) },
      uCup: { value: new THREE.Vector2(0, 0) },
      uBurst: { value: 0 },
      uDpr: { value: 1 },
    }),
    [],
  );

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      tx.current = e.clientX - size.width / 2;
      ty.current = size.height / 2 - e.clientY;
    };
    const onLeave = () => {
      tx.current = -9999;
      ty.current = -9999;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    const b = burst.current;
    const off = bus.on("hero:burst", ({ strength }) => {
      gsap.killTweensOf(b);
      gsap
        .timeline()
        .to(b, { value: strength, duration: 0.5, ease: "expo.out" })
        .to(b, { value: 0, duration: 2.6, ease: "power2.inOut" });
    });
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      off();
    };
  }, [size.width, size.height]);

  useEffect(() => {
    return () => {
      geometry.dispose();
      gl.forceContextLoss();
    };
  }, [geometry, gl]);

  useFrame((_, dt) => {
    const u = mat.current?.uniforms;
    if (!active || !u) return;
    u.uTime.value += Math.min(dt, 0.05);
    u.uSize.value.set(size.width, size.height);
    u.uDpr.value = gl.getPixelRatio();
    // the cup sits at the 50% / 38% focal point
    u.uCup.value.set(0, size.height * (0.5 - 0.38));
    px.current += (tx.current - px.current) * 0.12;
    py.current += (ty.current - py.current) * 0.12;
    u.uPointer.value.set(px.current, py.current);
    u.uBurst.value = burst.current.value;
  });

  return (
    <points geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={mat}
        uniforms={uniforms}
        vertexShader={vertex}
        fragmentShader={fragment}
        transparent
        depthWrite={false}
        depthTest={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/** WebGL moment #1: 3,000 points of matcha dust over the hero canvas. */
export default function MatchaDust({ active }: { active: boolean }) {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      <Canvas
        orthographic
        camera={{ position: [0, 0, 100], zoom: 1, near: 0.1, far: 1000 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance", premultipliedAlpha: true }}
        frameloop={active ? "always" : "never"}
        style={{ position: "absolute", inset: 0 }}
        eventSource={undefined}
      >
        <Dust active={active} />
      </Canvas>
    </div>
  );
}
