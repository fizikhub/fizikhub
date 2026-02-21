"use client";

import Link from "next/link";
import { SiteLogo } from "@/components/icons/site-logo";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

// ═══════════════════════════════════════════════════════════════════
// GARGANTUA FOOTER — WebGL GLSL shader-based black hole
// GPU ray-traced gravitational lensing, rotating accretion disk
// ═══════════════════════════════════════════════════════════════════

const VERT_SHADER = `
attribute vec2 aPos;
void main() {
    gl_Position = vec4(aPos, 0.0, 1.0);
}`;

const FRAG_SHADER = `
precision highp float;

uniform float uTime;
uniform vec2 uRes;

// ── Hash for procedural stars ──
float hash(vec2 p) {
    p = fract(p * vec2(443.897, 441.423));
    p += dot(p, p.yx + 19.19);
    return fract((p.x + p.y) * p.x);
}

float hash1(float n) {
    return fract(sin(n) * 43758.5453123);
}

// ── Noise ──
float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 4; i++) {
        v += a * noise(p);
        p *= 2.1;
        a *= 0.5;
    }
    return v;
}

// ── Procedural star field ──
vec3 stars(vec2 uv) {
    vec3 col = vec3(0.0);

    for (float layer = 0.0; layer < 5.0; layer++) {
        float scale = 80.0 + layer * 60.0;
        float threshold = 0.965 - layer * 0.008;
        float sizeMax = 0.04 - layer * 0.005;

        vec2 grid = floor(uv * scale);
        float h = hash(grid + layer * 137.0);

        if (h > threshold) {
            vec2 center = (grid + 0.5 + 0.4 * (vec2(hash(grid + 1.0), hash(grid + 2.0)) - 0.5)) / scale;
            float d = length(uv - center) * scale;
            float brightness = smoothstep(sizeMax * scale, 0.0, d);

            // Twinkle
            float twinkle = 0.6 + 0.4 * sin(uTime * (1.0 + h * 4.0) + h * 100.0);
            brightness *= twinkle;

            // Star color
            vec3 sc;
            if (h > 0.995) sc = vec3(1.0, 0.75, 0.4);       // Orange giant
            else if (h > 0.988) sc = vec3(0.65, 0.8, 1.0);   // Blue
            else if (h > 0.98) sc = vec3(1.0, 0.95, 0.7);    // Yellow
            else sc = vec3(0.85, 0.88, 0.95);                 // White

            col += sc * brightness;
        }
    }
    return col;
}

// ── Accretion disk color ──
vec3 diskColor(float r, float angle, float t) {
    float innerR = 0.09;
    float outerR = 0.45;

    if (r < innerR || r > outerR) return vec3(0.0);

    float ratio = (r - innerR) / (outerR - innerR);

    // Heat gradient: inner white → yellow → orange → red → dim
    vec3 hot = vec3(1.0, 0.97, 0.92);
    vec3 warm = vec3(1.0, 0.7, 0.2);
    vec3 mid = vec3(1.0, 0.35, 0.05);
    vec3 cool = vec3(0.6, 0.1, 0.02);
    vec3 dim = vec3(0.15, 0.02, 0.005);

    vec3 c;
    if (ratio < 0.1) c = mix(hot, warm, ratio / 0.1);
    else if (ratio < 0.3) c = mix(warm, mid, (ratio - 0.1) / 0.2);
    else if (ratio < 0.6) c = mix(mid, cool, (ratio - 0.3) / 0.3);
    else c = mix(cool, dim, (ratio - 0.6) / 0.4);

    // Turbulence
    float turb = fbm(vec2(angle * 3.0 + t * 1.5, r * 20.0 - t * 0.8));
    turb = 0.4 + 0.6 * turb;

    // Spiral structure
    float spiral = 0.7 + 0.3 * sin(angle * 4.0 - r * 30.0 + t * 2.0);

    // Doppler beaming: approaching side brighter
    float doppler = 0.6 + 0.4 * cos(angle - t * 0.6 + 1.5);

    // Brightness falloff
    float brightness = (1.0 - ratio) * (1.0 - ratio);
    brightness *= turb * spiral * doppler;

    // Inner edge glow
    float innerGlow = smoothstep(innerR + 0.02, innerR, r) * 2.0;
    c += vec3(0.3, 0.15, 0.05) * innerGlow;

    return c * brightness * 3.0;
}

void main() {
    vec2 uv = gl_FragCoord.xy / uRes;
    float aspect = uRes.x / uRes.y;
    vec2 p = (gl_FragCoord.xy - uRes * 0.5) / uRes.y; // normalized coords

    // Black hole center
    vec2 bhCenter = vec2(0.0, 0.12);
    vec2 delta = p - bhCenter;
    float dist = length(delta);

    float eventHorizon = 0.065;
    float photonSphere = eventHorizon * 1.5;

    // ── Gravitational lensing ──
    vec2 lensedUV = uv;
    float lensMag = 1.0;

    if (dist > eventHorizon * 0.95) {
        // Deflection angle: simplified Schwarzschild
        float rs = eventHorizon; // Schwarzschild radius
        float deflection = rs / (dist * dist) * 0.8;

        // Apply lensing to UV
        vec2 radial = normalize(delta);
        vec2 tangent = vec2(-radial.y, radial.x);

        lensedUV += tangent * deflection * 0.15;
        lensedUV += radial * deflection * 0.05;

        // Magnification near photon sphere
        if (dist < photonSphere * 2.0) {
            lensMag = 1.0 + 0.5 * smoothstep(photonSphere * 2.0, photonSphere, dist);
        }
    }

    // ── Background: Stars with lensing applied ──
    vec3 color = stars(lensedUV) * lensMag;

    // ── Accretion disk ──
    // The disk is in the equatorial plane — project to 3D
    // We see it at an angle, so it appears as an ellipse
    float diskAngle = atan(delta.y, delta.x) + uTime * 0.4; // ROTATION
    float diskR = dist;

    // Disk visibility: thin slab in y (flattened for perspective)
    float diskPlaneY = delta.y / max(dist, 0.001);
    float diskThickness = 0.12 * smoothstep(eventHorizon, eventHorizon * 4.0, dist);

    // Front half of disk (below center line in screen space)
    float absDiskY = abs(diskPlaneY);
    if (absDiskY < diskThickness && dist > eventHorizon * 1.3 && dist < 0.5) {
        float edgeFade = smoothstep(diskThickness, diskThickness * 0.3, absDiskY);
        vec3 dc = diskColor(dist, diskAngle, uTime);
        color += dc * edgeFade;
    }

    // ── Lensed disk above black hole (back of disk bent over the top) ──
    float topArcDist = length(delta - vec2(0.0, 0.0));
    float topAngle = atan(delta.y - 0.0, delta.x) + uTime * 0.4;
    if (delta.y > 0.0 && dist > eventHorizon * 1.2 && dist < eventHorizon * 3.0) {
        float lensedDiskR = dist * 1.3;
        vec3 ldc = diskColor(lensedDiskR, topAngle + 3.14159, uTime);
        float lensStrength = smoothstep(eventHorizon * 3.0, eventHorizon * 1.2, dist);
        lensStrength *= smoothstep(0.0, 0.03, delta.y);
        color += ldc * lensStrength * 0.5;
    }

    // ── Event horizon: pitch black ──
    if (dist < eventHorizon) {
        color = vec3(0.0);
    }

    // Soft edge transition
    float edgeSoft = smoothstep(eventHorizon * 0.92, eventHorizon * 1.05, dist);
    color *= edgeSoft;

    // ── Photon ring ──
    float ringWidth = 0.004;
    float ringDist = abs(dist - photonSphere);
    float ring = smoothstep(ringWidth, 0.0, ringDist);
    ring *= 0.5 + 0.2 * sin(uTime * 1.5);
    color += vec3(1.0, 0.88, 0.65) * ring * 0.7;

    // ── Inner photon ring (tighter, brighter) ──
    float innerRingDist = abs(dist - eventHorizon * 1.12);
    float innerRing = smoothstep(0.002, 0.0, innerRingDist);
    innerRing *= 0.4 + 0.1 * sin(uTime * 2.3 + 1.0);
    color += vec3(1.0, 0.92, 0.78) * innerRing * 0.5;

    // ── Ambient glow ──
    float glow = exp(-dist * 5.0) * 0.03;
    color += vec3(1.0, 0.6, 0.2) * glow;

    // Tone mapping (prevent blowout)
    color = color / (1.0 + color);

    // Subtle vignette
    float vig = 1.0 - 0.3 * length(uv - 0.5);
    color *= vig;

    gl_FragColor = vec4(color, 1.0);
}
`;

function initWebGL(canvas: HTMLCanvasElement) {
    const gl = canvas.getContext("webgl", {
        antialias: true,
        alpha: false,
        preserveDrawingBuffer: false,
    });
    if (!gl) return null;

    // Compile shaders
    const vs = gl.createShader(gl.VERTEX_SHADER)!;
    gl.shaderSource(vs, VERT_SHADER);
    gl.compileShader(vs);
    if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) {
        console.error("VS:", gl.getShaderInfoLog(vs));
        return null;
    }

    const fs = gl.createShader(gl.FRAGMENT_SHADER)!;
    gl.shaderSource(fs, FRAG_SHADER);
    gl.compileShader(fs);
    if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
        console.error("FS:", gl.getShaderInfoLog(fs));
        return null;
    }

    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
        console.error("Link:", gl.getProgramInfoLog(prog));
        return null;
    }

    gl.useProgram(prog);

    // Full-screen quad
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        -1, -1, 1, -1, -1, 1,
        -1, 1, 1, -1, 1, 1
    ]), gl.STATIC_DRAW);

    const aPos = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    return {
        gl,
        prog,
        uTime: gl.getUniformLocation(prog, "uTime"),
        uRes: gl.getUniformLocation(prog, "uRes"),
    };
}

export function Footer() {
    const pathname = usePathname();
    const isMessagesPage = pathname?.startsWith("/mesajlar");
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const glRef = useRef<ReturnType<typeof initWebGL>>(null);
    const animRef = useRef<number>(0);
    const startTimeRef = useRef(Date.now());

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const resize = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 2); // Cap at 2x for perf
            const rect = container.getBoundingClientRect();
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            canvas.style.width = rect.width + "px";
            canvas.style.height = rect.height + "px";

            if (glRef.current) {
                const { gl, uRes } = glRef.current;
                gl.viewport(0, 0, canvas.width, canvas.height);
                gl.uniform2f(uRes, canvas.width, canvas.height);
            }
        };

        glRef.current = initWebGL(canvas);
        if (!glRef.current) return;

        resize();
        startTimeRef.current = Date.now();

        const render = () => {
            if (!glRef.current) return;
            const { gl, uTime, uRes } = glRef.current;

            const t = (Date.now() - startTimeRef.current) * 0.001;
            gl.uniform1f(uTime, t);
            gl.uniform2f(uRes, canvas.width, canvas.height);
            gl.drawArrays(gl.TRIANGLES, 0, 6);

            animRef.current = requestAnimationFrame(render);
        };

        animRef.current = requestAnimationFrame(render);
        window.addEventListener("resize", resize);

        return () => {
            window.removeEventListener("resize", resize);
            cancelAnimationFrame(animRef.current);
        };
    }, []);

    if (isMessagesPage) return null;

    return (
        <footer
            ref={containerRef}
            role="contentinfo"
            aria-label="Site bilgileri"
            className="relative bg-black overflow-hidden min-h-[520px] md:min-h-[620px] flex flex-col justify-end"
        >
            {/* WebGL Canvas */}
            <canvas ref={canvasRef} className="absolute inset-0 z-0 block" />

            {/* Top fade */}
            <div className="absolute inset-x-0 top-0 h-[80px] bg-gradient-to-b from-[#0a0a0a] to-transparent z-10 pointer-events-none" />

            {/* ═══════════════ CONTENT ═══════════════ */}
            <div className="container relative z-30 py-12 md:py-16">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-10 text-center md:text-left w-full max-w-4xl mx-auto">
                    {/* 1. Keşif Modülü */}
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                            <div className="w-1 h-4 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
                            <h4 className="text-xs font-bold text-blue-100 uppercase tracking-widest">Keşif Modülü</h4>
                        </div>
                        <nav aria-label="Keşif bağlantıları" className="flex flex-col gap-2">
                            <Link href="/kesfet" className="text-sm text-zinc-400 hover:text-yellow-400 transition-all duration-300 hover:translate-x-1">Keşfet</Link>
                            <Link href="/testler" className="text-sm text-zinc-400 hover:text-yellow-400 transition-all duration-300 hover:translate-x-1">Testler</Link>
                            <Link href="/sozluk" className="text-sm text-zinc-400 hover:text-yellow-400 transition-all duration-300 hover:translate-x-1">Sözlük</Link>
                        </nav>
                    </div>

                    {/* 2. Topluluk */}
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                            <div className="w-1 h-4 bg-purple-500 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.6)]" />
                            <h4 className="text-xs font-bold text-purple-100 uppercase tracking-widest">Topluluk</h4>
                        </div>
                        <nav className="flex flex-col gap-2">
                            <Link href="/forum" className="text-sm text-zinc-400 hover:text-yellow-400 transition-all duration-300 hover:translate-x-1">Forum</Link>
                            <Link href="/siralamalar" className="text-sm text-zinc-400 hover:text-yellow-400 transition-all duration-300 hover:translate-x-1">Sıralamalar</Link>
                            <Link href="/yazar" className="text-sm text-zinc-400 hover:text-yellow-400 transition-all duration-300 hover:translate-x-1">Yazarlar</Link>
                        </nav>
                    </div>

                    {/* 3. Kurumsal */}
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                            <div className="w-1 h-4 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                            <h4 className="text-xs font-bold text-green-100 uppercase tracking-widest">Kurumsal</h4>
                        </div>
                        <nav className="flex flex-col gap-2">
                            <Link href="/hakkimizda" className="text-sm text-zinc-400 hover:text-yellow-400 transition-all duration-300 hover:translate-x-1">Hakkımızda</Link>
                            <Link href="/iletisim" className="text-sm text-zinc-400 hover:text-yellow-400 transition-all duration-300 hover:translate-x-1">İletişim</Link>
                            <Link href="/blog" className="text-sm text-zinc-400 hover:text-yellow-400 transition-all duration-300 hover:translate-x-1">Blog</Link>
                        </nav>
                    </div>

                    {/* 4. Protokoller */}
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                            <div className="w-1 h-4 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
                            <h4 className="text-xs font-bold text-red-100 uppercase tracking-widest">Protokoller</h4>
                        </div>
                        <nav className="flex flex-col gap-2">
                            <Link href="/gizlilik-politikasi" className="text-sm text-zinc-400 hover:text-yellow-400 transition-all duration-300 hover:translate-x-1">Gizlilik</Link>
                            <Link href="/kullanim-sartlari" className="text-sm text-zinc-400 hover:text-yellow-400 transition-all duration-300 hover:translate-x-1">Şartlar</Link>
                            <Link href="/kvkk" className="text-sm text-zinc-400 hover:text-yellow-400 transition-all duration-300 hover:translate-x-1">KVKK</Link>
                        </nav>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="relative z-40 w-full border-t border-white/5 bg-black/70 backdrop-blur-sm pb-10 pt-6">
                <div className="container flex flex-col items-center justify-center gap-3 text-center">
                    <SiteLogo className="h-9 w-9 text-yellow-400 opacity-90" />
                    <p className="text-xs font-mono text-zinc-500">&copy; 2025 FİZİKHUB.</p>
                    <span className="text-orange-500/80 font-bold text-[10px] tracking-[0.2em] font-mono">İZİNSİZ KOPYALAYANI KARA DELİĞE ATARIZ.</span>
                </div>
            </div>
        </footer>
    );
}
