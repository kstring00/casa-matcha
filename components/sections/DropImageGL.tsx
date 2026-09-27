"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { hashString } from "@/lib/prng";

const vertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragment = /* glsl */ `
  uniform sampler2D uMap;
  uniform float uTime;
  uniform float uHover;
  uniform vec2 uPointer;
  uniform vec2 uPlane;
  uniform vec2 uImage;
  varying vec2 vUv;

  vec2 cover(vec2 uv, vec2 plane, vec2 img) {
    float pr = plane.x / plane.y;
    float ir = img.x / img.y;
    vec2 s = pr > ir ? vec2(1.0, ir / pr) : vec2(pr / ir, 1.0);
    return (uv - 0.5) * s + 0.5;
  }

  void main() {
    vec2 uv = cover(vUv, uPlane, uImage);
    float t = uTime * 0.55;
    // slow liquid ripple, always on, stronger on hover
    vec2 ripple = vec2(
      sin(uv.y * 9.0 + t) + sin(uv.y * 17.0 - t * 1.3) * 0.5,
      cos(uv.x * 8.0 - t * 1.1) + cos(uv.x * 15.0 + t * 0.7) * 0.5
    ) * 0.0022 * (0.5 + uHover);
    // pointer wave
    float d = distance(vUv, uPointer);
    float wave = sin(d * 30.0 - uTime * 5.0) * exp(-d * 4.5) * 0.014 * uHover;
    uv += ripple + normalize(vUv - uPointer + 1e-4) * wave;

    // matcha chromatic edge
    vec2 dir = vUv - 0.5;
    float edge = smoothstep(0.12, 0.72, length(dir));
    vec2 off = dir * edge * 0.014 * uHover;
    float r = texture2D(uMap, uv + off).r;
    float g = texture2D(uMap, uv).g;
    float b = texture2D(uMap, uv - off).b;
    vec3 col = vec3(r, g, b);
    vec3 matcha = vec3(0.416, 0.604, 0.247);
    col = mix(col, col * 0.7 + matcha * 0.45, edge * uHover * 0.5);
    gl_FragColor = vec4(col, 1.0);
  }
`;

function Plane({ src, width, height }: { src: string; width: number; height: number }) {
  const tex = useTexture(src, (t) => {
    t.colorSpace = THREE.NoColorSpace;
    t.minFilter = THREE.LinearFilter;
    t.generateMipmaps = false;
    t.needsUpdate = true;
  });
  const { viewport } = useThree();
  const mat = useRef<THREE.ShaderMaterial>(null);
  const hover = useRef(0);
  const hoverTarget = useRef(0);
  const px = useRef(0.5);
  const py = useRef(0.5);
  const tx = useRef(0.5);
  const ty = useRef(0.5);

  const uniforms = useMemo(() => {
    return {
      uMap: { value: tex },
      uTime: { value: (hashString(src) % 1000) / 100 },
      uHover: { value: 0 },
      uPointer: { value: new THREE.Vector2(0.5, 0.5) },
      uPlane: { value: new THREE.Vector2(1, 1) },
      uImage: { value: new THREE.Vector2(width, height) },
    };
  }, [tex, src, width, height]);

  useFrame((_, dt) => {
    const u = mat.current?.uniforms;
    if (!u) return;
    const k = Math.min(1, dt * 5);
    hover.current += (hoverTarget.current - hover.current) * k;
    px.current += (tx.current - px.current) * k;
    py.current += (ty.current - py.current) * k;
    u.uTime.value += dt;
    u.uHover.value = hover.current;
    u.uPointer.value.set(px.current, py.current);
    u.uPlane.value.set(viewport.width, viewport.height);
  });

  const onMove = (e: ThreeEvent<PointerEvent>) => {
    if (e.uv) {
      tx.current = e.uv.x;
      ty.current = e.uv.y;
    }
  };

  return (
    <mesh
      scale={[viewport.width, viewport.height, 1]}
      onPointerEnter={() => (hoverTarget.current = 1)}
      onPointerLeave={() => (hoverTarget.current = 0)}
      onPointerMove={onMove}
    >
      <planeGeometry args={[1, 1]} />
      <shaderMaterial ref={mat} uniforms={uniforms} vertexShader={vertex} fragmentShader={fragment} />
    </mesh>
  );
}

function Disposer() {
  const { gl } = useThree();
  useEffect(() => () => gl.forceContextLoss(), [gl]);
  return null;
}

/** WebGL moment #2: liquid ripple + matcha chromatic edge on a drop image. */
export default function DropImageGL({ src, width, height }: { src: string; width: number; height: number }) {
  const wrap = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: "20% 40%" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={wrap} className="absolute inset-0" aria-hidden="true">
      <Canvas
        dpr={[1, 1.5]}
        orthographic
        camera={{ position: [0, 0, 10], zoom: 1 }}
        gl={{ antialias: false, alpha: false, powerPreference: "low-power" }}
        frameloop={visible ? "always" : "never"}
        style={{ position: "absolute", inset: 0 }}
      >
        <Disposer />
        <Plane src={src} width={width} height={height} />
      </Canvas>
    </div>
  );
}
