"use client";

import Link from "next/link";
import { SiteLogo } from "@/components/icons/site-logo";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

// ═══════════════════════════════════════════════════════════════
// BLACK HOLE FOOTER v5 — Cinematic composition
// Schwarzschild ray tracer, thin luminous disk, proper framing
// ═══════════════════════════════════════════════════════════════

const VS = `attribute vec2 a;void main(){gl_Position=vec4(a,0,1);}`;

const FS = `
precision highp float;
uniform float T;
uniform vec2 R;

#define PI 3.14159265
#define STEPS 140

float hash(vec2 p) {
    p = fract(p * vec2(443.8975, 441.4237));
    p += dot(p, p.yx + 19.19);
    return fract((p.x + p.y) * p.x);
}

float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x),
               mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y);
}

float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 6; i++) { v += a * noise(p); p *= 2.1; a *= 0.48; }
    return v;
}

// ── Dense star field with nebula dust ──
vec3 stars(vec3 rd) {
    vec3 col = vec3(0.0);
    vec2 suv = vec2(atan(rd.z, rd.x) / (2.0 * PI) + 0.5,
                     asin(clamp(rd.y, -1.0, 1.0)) / PI + 0.5);

    // 8 layers of stars — very dense feeling
    for (float l = 0.0; l < 8.0; l++) {
        float sc = 90.0 + l * 65.0;
        float thr = 0.97 - l * 0.004;
        vec2 g = floor(suv * sc);
        float h = hash(g + l * 53.0);
        if (h > thr) {
            vec2 c = (g + 0.5 + 0.4 * (vec2(hash(g + 1.0), hash(g + 2.0)) - 0.5)) / sc;
            float d = length(suv - c) * sc;
            float br = smoothstep(1.6 - l * 0.1, 0.0, d);
            br *= 0.45 + 0.55 * sin(T * (0.5 + h * 3.5) + h * 80.0);

            vec3 sc2 = h > 0.997 ? vec3(1.0, 0.65, 0.25) :   // Red giant
                       h > 0.993 ? vec3(0.55, 0.72, 1.0) :    // Blue hot
                       h > 0.988 ? vec3(1.0, 0.95, 0.7) :     // Yellow Sun
                       h > 0.982 ? vec3(0.9, 0.6, 0.95) :     // Purple rare
                                   vec3(0.82, 0.85, 0.93);    // White dwarf
            col += sc2 * br * 0.9;
        }
    }

    // Milky Way band — richer
    float mw = exp(-8.0 * pow(abs(rd.y + 0.05), 2.0));
    float mwNoise = fbm(suv * 12.0 + T * 0.003);
    col += vec3(0.05, 0.04, 0.07) * mw * mwNoise;
    col += vec3(0.03, 0.015, 0.04) * mw * fbm(suv * 20.0 - 5.0);

    // Subtle nebula dust clouds
    float neb1 = fbm(suv * 4.0 + vec2(T * 0.002, 0.0));
    float neb2 = fbm(suv * 3.5 + vec2(0.0, T * 0.001) + 50.0);
    col += vec3(0.02, 0.005, 0.03) * neb1 * smoothstep(0.4, 0.7, neb1);
    col += vec3(0.005, 0.01, 0.025) * neb2 * smoothstep(0.45, 0.75, neb2);

    return col;
}

// ── Accretion disk with rich detail ──
vec3 diskColor(vec3 p, float r) {
    float inner = 3.0;
    float outer = 14.0;
    if (r < inner || r > outer) return vec3(0.0);

    float ratio = 1.0 - (r - inner) / (outer - inner);
    ratio = pow(ratio, 0.75);

    // Smooth blackbody temperature gradient
    vec3 c;
    if (ratio > 0.88) c = mix(vec3(1.0, 0.92, 0.5), vec3(1.0, 0.98, 0.95), (ratio - 0.88) / 0.12);
    else if (ratio > 0.7) c = mix(vec3(1.0, 0.65, 0.15), vec3(1.0, 0.92, 0.5), (ratio - 0.7) / 0.18);
    else if (ratio > 0.45) c = mix(vec3(0.9, 0.3, 0.04), vec3(1.0, 0.65, 0.15), (ratio - 0.45) / 0.25);
    else if (ratio > 0.2) c = mix(vec3(0.55, 0.1, 0.02), vec3(0.9, 0.3, 0.04), (ratio - 0.2) / 0.25);
    else c = mix(vec3(0.15, 0.02, 0.005), vec3(0.55, 0.1, 0.02), ratio / 0.2);

    float angle = atan(p.z, p.x) + T * 0.45;

    // Rich turbulence (6 octaves)
    float turb = fbm(vec2(angle * 2.5 + T * 0.25, r * 3.0 - T * 0.3));
    float turb2 = fbm(vec2(angle * 5.0 - T * 0.4, r * 6.0 + T * 0.2));
    turb = 0.25 + 0.75 * (turb * 0.7 + turb2 * 0.3);

    // Multiple spiral arms
    float spiral = 0.6 + 0.25 * sin(angle * 3.0 - r * 4.5 + T * 1.0);
    spiral += 0.15 * sin(angle * 7.0 + r * 2.0 - T * 0.7);

    // Doppler relativistic beaming — stronger contrast
    float doppler = 0.4 + 0.6 * cos(angle - T * 0.45);
    doppler = pow(max(doppler, 0.0), 1.3);

    float brightness = ratio * ratio * turb * spiral * doppler * 5.0;

    // ISCO inner edge blaze
    float isco = exp(-(r - inner) * 1.5) * 6.0;
    c += vec3(0.6, 0.35, 0.15) * isco;

    // Hot spots (clumps in the disk)
    float hotspot = smoothstep(0.68, 0.75, fbm(vec2(angle * 4.0 + T * 0.8, r * 8.0)));
    c += vec3(0.4, 0.25, 0.1) * hotspot * ratio * 3.0;

    return c * brightness;
}

void main() {
    vec2 uv = (gl_FragCoord.xy - R * 0.5) / R.y;

    // ── Camera ──
    float camDist = 26.0;
    float camElev = 0.2;
    vec3 ro = vec3(0.0, camDist * sin(camElev), -camDist * cos(camElev));

    vec3 fwd = normalize(-ro);
    vec3 right = normalize(cross(fwd, vec3(0, 1, 0)));
    vec3 vup = cross(right, fwd);
    vec3 rd = normalize(fwd * 2.0 + right * uv.x + vup * uv.y);

    // ── Schwarzschild ray trace ──
    vec3 pos = ro;
    vec3 vel = rd;
    float h2 = dot(cross(pos, vel), cross(pos, vel));

    vec3 color = vec3(0.0);
    float prevY = pos.y;
    bool absorbed = false;
    float diskGlow = 0.0;

    for (int i = 0; i < STEPS; i++) {
        float r = length(pos);
        vec3 acc = -1.5 * h2 / (r * r * r * r * r) * pos;
        float dt = 0.1 + 0.06 * clamp(r - 2.0, 0.0, 8.0);
        vel += acc * dt;
        pos += vel * dt;
        float newR = length(pos);

        if (newR < 0.5) { absorbed = true; break; }

        // Disk crossing
        if (pos.y * prevY < 0.0 && newR > 2.8 && newR < 15.0) {
            float frac = abs(prevY) / (abs(prevY) + abs(pos.y));
            vec3 hitP = pos - vel * dt * (1.0 - frac);
            float hitR = length(hitP);
            vec3 dc = diskColor(hitP, hitR);
            if (length(dc) > 0.005) {
                float opacity = clamp(length(dc) * 0.4, 0.0, 0.92);
                color = color * (1.0 - opacity) + dc;
                diskGlow += length(dc) * 0.15;
            }
        }

        prevY = pos.y;
        if (newR > 40.0) { color += stars(normalize(pos)); break; }
    }

    if (absorbed) color = vec3(0.0);

    // ── Photon ring — double ring ──
    float sd = length(uv - vec2(0.0, 0.035));
    float pr1 = 0.037;
    float pr2 = 0.042;
    float ring1 = exp(-abs(sd - pr1) * 500.0) * 0.6 * (0.7 + 0.3 * sin(T * 1.5));
    float ring2 = exp(-abs(sd - pr2) * 300.0) * 0.25 * (0.6 + 0.4 * sin(T * 2.1 + 1.0));
    color += vec3(1.0, 0.9, 0.7) * ring1;
    color += vec3(1.0, 0.75, 0.5) * ring2;

    // ── Relativistic jets (faint blue beams from poles) ──
    float jetX = abs(uv.x);
    float jetY = uv.y - 0.035;
    float jetUp = smoothstep(0.012, 0.0, jetX) * smoothstep(0.0, 0.15, jetY) * smoothstep(0.5, 0.1, jetY);
    float jetDown = smoothstep(0.012, 0.0, jetX) * smoothstep(0.0, -0.1, -jetY) * smoothstep(-0.35, -0.08, -jetY);
    float jetTurb = 0.6 + 0.4 * sin(jetY * 80.0 + T * 3.0);
    color += vec3(0.3, 0.5, 1.0) * jetUp * 0.15 * jetTurb;
    color += vec3(0.25, 0.4, 0.9) * jetDown * 0.08 * jetTurb;

    // ── Soft bloom from disk ──
    float bloomR = length(uv - vec2(0.0, 0.035));
    float bloom = exp(-bloomR * 8.0) * diskGlow * 0.3;
    color += vec3(1.0, 0.7, 0.3) * bloom;

    // ── ACES Tone mapping ──
    color = (color * (2.51 * color + 0.03)) / (color * (2.43 * color + 0.59) + 0.14);

    // Cinematic warm color grade
    color = pow(color, vec3(0.9, 0.95, 1.08));

    // Vignette
    vec2 vu = gl_FragCoord.xy / R;
    color *= 1.0 - 0.35 * pow(length(vu - 0.5), 1.5);

    gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
}
`;

function initGL(canvas: HTMLCanvasElement) {
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false });
    if (!gl) return null;

    const mk = (t: number, s: string) => {
        const sh = gl.createShader(t)!;
        gl.shaderSource(sh, s);
        gl.compileShader(sh);
        if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
            console.error(gl.getShaderInfoLog(sh));
            return null;
        }
        return sh;
    };

    const vs = mk(gl.VERTEX_SHADER, VS);
    const fs = mk(gl.FRAGMENT_SHADER, FS);
    if (!vs || !fs) return null;

    const p = gl.createProgram()!;
    gl.attachShader(p, vs);
    gl.attachShader(p, fs);
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
        console.error(gl.getProgramInfoLog(p));
        return null;
    }
    gl.useProgram(p);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
    const a = gl.getAttribLocation(p, "a");
    gl.enableVertexAttribArray(a);
    gl.vertexAttribPointer(a, 2, gl.FLOAT, false, 0, 0);

    return { gl, uT: gl.getUniformLocation(p, "T"), uR: gl.getUniformLocation(p, "R") };
}

export function Footer() {
    const pathname = usePathname();
    const isMessagesPage = pathname?.startsWith("/mesajlar");
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const boxRef = useRef<HTMLDivElement>(null);
    const glRef = useRef<ReturnType<typeof initGL>>(null);
    const afRef = useRef(0);
    const t0 = useRef(0);

    useEffect(() => {
        const c = canvasRef.current;
        const b = boxRef.current;
        if (!c || !b) return;

        const resize = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
            const r = b.getBoundingClientRect();
            c.width = r.width * dpr;
            c.height = r.height * dpr;
            c.style.width = r.width + "px";
            c.style.height = r.height + "px";
            if (glRef.current) {
                glRef.current.gl.viewport(0, 0, c.width, c.height);
                glRef.current.gl.uniform2f(glRef.current.uR, c.width, c.height);
            }
        };

        glRef.current = initGL(c);
        if (!glRef.current) return;
        t0.current = Date.now();
        resize();

        const loop = () => {
            if (!glRef.current) return;
            const { gl, uT, uR } = glRef.current;
            gl.uniform1f(uT, (Date.now() - t0.current) * 0.001);
            gl.uniform2f(uR, c.width, c.height);
            gl.drawArrays(gl.TRIANGLES, 0, 6);
            afRef.current = requestAnimationFrame(loop);
        };

        afRef.current = requestAnimationFrame(loop);
        window.addEventListener("resize", resize);
        return () => { window.removeEventListener("resize", resize); cancelAnimationFrame(afRef.current); };
    }, []);

    if (isMessagesPage) return null;

    return (
        <footer ref={boxRef} role="contentinfo" aria-label="Site bilgileri"
            className="relative bg-black overflow-hidden min-h-[520px] md:min-h-[650px] flex flex-col justify-end">

            <canvas ref={canvasRef} className="absolute inset-0 z-0 block" />
            <div className="absolute inset-x-0 top-0 h-[60px] bg-gradient-to-b from-[#0a0a0a] to-transparent z-10 pointer-events-none" />

            <div className="container relative z-30 py-12 md:py-16">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-10 text-center md:text-left w-full max-w-4xl mx-auto">
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
