"use client";

import { useEffect, useRef, type RefObject } from "react";

export type ChapterMotion = { progress: number; render?: () => void };

const vertexSource = `
  attribute vec2 aPosition;
  varying vec2 vUv;
  void main() {
    vUv = aPosition * 0.5 + 0.5;
    gl_Position = vec4(aPosition, 0.0, 1.0);
  }
`;

const fragmentSource = `
  precision mediump float;
  varying vec2 vUv;
  uniform float uProgress;
  uniform float uDark;
  uniform float uAspect;

  void main() {
    float p = clamp(uProgress, 0.0, 1.0);
    // Light is driven only by the entrance: no perpetual shimmer after settling.
    float energy = sin(p * 3.14159265);
    float angle = mix(-0.9, 0.35, p);
    vec2 uv = vUv - 0.5;
    uv.x *= uAspect;
    float diagonal = dot(uv, vec2(cos(angle), sin(angle)));
    float sweep = exp(-pow((diagonal - mix(-0.8, 0.8, p)) * 9.0, 2.0));
    float broad = exp(-pow((diagonal - mix(-0.65, 0.65, p)) * 2.5, 2.0));
    float edgeDistance = min(min(vUv.x, 1.0-vUv.x), min(vUv.y, 1.0-vUv.y));
    float rim = 1.0 - smoothstep(0.0, 0.014, edgeDistance);
    float grain = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898,78.233))) * 43758.5453);
    vec3 light = mix(vec3(1.0, 0.93, 0.63), vec3(1.0, 0.99, 0.94), sweep);
    float alpha = energy * (sweep * mix(0.24, 0.42, uDark) + broad * 0.055 + rim * 0.27);
    alpha *= 0.96 + grain * 0.04;
    gl_FragColor = vec4(light, alpha);
  }
`;

/** A transparent, event-rendered WebGL surface over the accessible HTML card. */
export function ChapterShader({ motion, index, dark = false, onReady }: {
  motion: RefObject<ChapterMotion[]>;
  index: number;
  dark?: boolean;
  onReady: (index: number, render: () => void) => () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { alpha: true, premultipliedAlpha: false, antialias: false, powerPreference: "low-power" });
    if (!gl) return;
    const state = motion.current[index];
    const shaders: WebGLShader[] = [];
    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      shaders.push(shader);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
    };
    const vertex = compile(gl.VERTEX_SHADER, vertexSource);
    const fragment = compile(gl.FRAGMENT_SHADER, fragmentSource);
    const program = gl.createProgram();
    const buffer = gl.createBuffer();
    const dispose = () => {
      if (buffer) gl.deleteBuffer(buffer);
      if (program) gl.deleteProgram(program);
      shaders.forEach(shader => gl.deleteShader(shader));
    };
    if (!vertex || !fragment || !program || !buffer) { dispose(); return; }
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) { dispose(); return; }
    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, -1,1, 1,-1, 1,1]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, "aPosition");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    const progress = gl.getUniformLocation(program, "uProgress");
    const aspect = gl.getUniformLocation(program, "uAspect");
    gl.uniform1f(gl.getUniformLocation(program, "uDark"), dark ? 1 : 0);
    let lost = false;
    const render = () => {
      if (lost) return;
      gl.uniform1f(progress, state.progress);
      gl.uniform1f(aspect, canvas.width / Math.max(canvas.height, 1));
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.max(1, Math.round(canvas.clientWidth * dpr));
      canvas.height = Math.max(1, Math.round(canvas.clientHeight * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
      render();
    };
    const onLost = () => { lost = true; canvas.style.visibility = "hidden"; };
    canvas.addEventListener("webglcontextlost", onLost);
    const unregister = onReady(index, render);
    canvas.dataset.shader = "ready";
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();
    return () => {
      unregister();
      observer.disconnect();
      canvas.removeEventListener("webglcontextlost", onLost);
      dispose();

    };
  }, [motion, index, dark, onReady]);

  return <canvas ref={canvasRef} className="j-chapter-shader" aria-hidden="true" />;
}


