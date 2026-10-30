"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef, useState, type RefObject } from "react";
import * as THREE from "three";

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    vUv = vec2(position.x / 4.28 + 0.5, position.y / 2.7 + 0.5);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vView = -mv.xyz;
    gl_Position = projectionMatrix * mv;
  }
`;

const fragmentShader = /* glsl */ `
  uniform sampler2D uFace;
  uniform float uTime;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    vec3 base = texture2D(uFace, vUv).rgb;
    vec3 n = normalize(vNormal);
    vec3 view = normalize(vView);
    float rim = pow(1.0 - max(dot(n, view), 0.0), 3.0);
    float sweep = exp(-pow((vUv.x + vUv.y * 0.4 - 0.65 - sin(uTime * 0.3) * 0.65) * 5.0, 2.0));
    float sheen = pow(max(dot(reflect(-normalize(vec3(-0.6, 1.0, 1.5)), n), view), 0.0), 12.0);
    vec3 color = base + vec3(0.045, 0.043, 0.035) * sweep * (0.3 + sheen);
    color += vec3(0.12, 0.52, 0.82) * rim * 0.24;
    gl_FragColor = vec4(color, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

function Card({ pointer }: { pointer: RefObject<THREE.Vector2> }) {
  const group = useRef<THREE.Group>(null);
  const elapsed = useRef(0);
  const material = useRef<THREE.ShaderMaterial>(null);
  const face = useTexture("/images/client-logo.png", (texture) => {
    texture.colorSpace = THREE.SRGBColorSpace;
  });
  const uniforms = useMemo(() => ({ uFace: { value: face }, uTime: { value: 0 } }), [face]);
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    const x = 2.14, y = 1.35, r = 0.16;
    s.moveTo(-x + r, -y);
    s.lineTo(x - r, -y);
    s.quadraticCurveTo(x, -y, x, -y + r);
    s.lineTo(x, y - r);
    s.quadraticCurveTo(x, y, x - r, y);
    s.lineTo(-x + r, y);
    s.quadraticCurveTo(-x, y, -x, y - r);
    s.lineTo(-x, -y + r);
    s.quadraticCurveTo(-x, -y, -x + r, -y);
    return s;
  }, []);

  useFrame((_, delta) => {
    if (!group.current || !material.current) return;
    const dt = Math.min(delta, 0.05);
    elapsed.current += dt;
    const t = elapsed.current;
    material.current.uniforms.uTime.value = t;
    const smoothing = 1 - Math.exp(-5 * dt);
    const { x, y } = pointer.current;
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, 0.12 + Math.sin(t * 0.45) * 0.05 - y * 0.38, smoothing);
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, -0.28 + Math.sin(t * 0.3) * 0.12 + x * 0.65, smoothing);
    group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, -0.18 + Math.sin(t * 0.35) * 0.025 - x * 0.07, smoothing);
    group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, x * 0.16, smoothing);
    group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, Math.sin(t * 0.65) * 0.09 + y * 0.12, smoothing);
  });

  return (
    <group ref={group} scale={0.88} rotation={[0.12, -0.28, -0.18]}>
      <mesh position={[0, 0, -0.025]}>
        <extrudeGeometry args={[shape, { depth: 0.05, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 0.012, bevelThickness: 0.012, curveSegments: 16 }]} />
        <shaderMaterial ref={material} attach="material-0" vertexShader={vertexShader} fragmentShader={fragmentShader} uniforms={uniforms} />
        <meshStandardMaterial attach="material-1" color="#b5a66c" metalness={0.75} roughness={0.3} />
      </mesh>
    </group>
  );
}

export default function HeroOrbit({ quality = "high" }: { quality?: "high" | "medium" }) {
  const wrap = useRef<HTMLDivElement>(null);
  const pointer = useRef(new THREE.Vector2());
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const element = wrap.current;
    const hero = element?.closest(".hero, .j-hero");
    if (!element || !hero) return;

    // Listen on the Hero so the text overlay does not block the card interaction.
    const reset = () => pointer.current.set(0, 0);
    const move = (event: Event) => {
      const e = event as PointerEvent;
      if (e.pointerType === "touch" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        reset();
        return;
      }
      const rect = element.getBoundingClientRect();
      if (!rect.width || !rect.height || e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) {
        reset();
        return;
      }
      pointer.current.set(
        THREE.MathUtils.clamp(((e.clientX - rect.left) / rect.width) * 2 - 1, -1, 1),
        THREE.MathUtils.clamp(1 - ((e.clientY - rect.top) / rect.height) * 2, -1, 1),
      );
    };
    hero.addEventListener("pointermove", move, { passive: true });
    hero.addEventListener("pointerleave", reset);
    hero.addEventListener("pointercancel", reset);
    window.addEventListener("blur", reset);
    return () => {
      hero.removeEventListener("pointermove", move);
      hero.removeEventListener("pointerleave", reset);
      hero.removeEventListener("pointercancel", reset);
      window.removeEventListener("blur", reset);
    };
  }, []);

  useEffect(() => {
    if (!wrap.current) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: "180px" });
    observer.observe(wrap.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={wrap} className="orbit-canvas" aria-hidden="true">
      <Canvas dpr={quality === "high" ? [1, 1.5] : [1, 1.2]} camera={{ position: [0, 0, 7.8], fov: 38 }} frameloop={visible ? "always" : "never"} gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}>
        <ambientLight intensity={1.5} />
        <directionalLight position={[-3, 5, 4]} intensity={3} />
        <Suspense fallback={null}><Card pointer={pointer} /></Suspense>
      </Canvas>
    </div>
  );
}



