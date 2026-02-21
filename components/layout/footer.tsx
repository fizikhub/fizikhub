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
#define STEPS 128

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
    for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.0; a *= 0.5; }
    return v;
}

// ── Star field on unit sphere ──
vec3 stars(vec3 rd) {
    vec3 col = vec3(0.0);
    vec2 suv = vec2(atan(rd.z, rd.x) / (2.0 * PI) + 0.5,
                     asin(clamp(rd.y, -1.0, 1.0)) / PI + 0.5);

    for (float l = 0.0; l < 7.0; l++) {
        float sc = 100.0 + l * 70.0;
        float thr = 0.975 - l * 0.004;
        vec2 g = floor(suv * sc);
        float h = hash(g + l * 53.0);
        if (h > thr) {
            vec2 c = (g + 0.5 + 0.4 * (vec2(hash(g + 1.0), hash(g + 2.0)) - 0.5)) / sc;
            float d = length(suv - c) * sc;
            float br = smoothstep(1.5 - l * 0.1, 0.0, d);
            br *= 0.5 + 0.5 * sin(T * (0.6 + h * 3.0) + h * 90.0);
            vec3 sc2 = h > 0.997 ? vec3(1.0, 0.7, 0.3) :
                       h > 0.992 ? vec3(0.6, 0.75, 1.0) :
                       h > 0.984 ? vec3(1.0, 0.93, 0.65) :
                                   vec3(0.8, 0.83, 0.9);
            col += sc2 * br * 0.8;
        }
    }
    // Milky way
    float mw = exp(-10.0 * pow(abs(rd.y + 0.05), 2.0));
    col += vec3(0.04, 0.035, 0.06) * mw * fbm(suv * 10.0 + T * 0.005);
    return col;
}

// ── Accretion disk color ──
vec3 diskColor(vec3 p, float r) {
    float rs = 1.0;
    float inner = rs * 3.0;
    float outer = rs * 14.0;
    if (r < inner || r > outer) return vec3(0.0);

    float ratio = 1.0 - (r - inner) / (outer - inner);
    ratio = pow(ratio, 0.8);

    // Temperature coloring
    vec3 c;
    if (ratio > 0.85) c = vec3(1.0, 0.97, 0.94);       // White hot
    else if (ratio > 0.65) c = vec3(1.0, 0.82, 0.45);   // Yellow
    else if (ratio > 0.4) c = vec3(1.0, 0.5, 0.08);     // Orange
    else if (ratio > 0.2) c = vec3(0.75, 0.18, 0.03);   // Red
    else c = vec3(0.3, 0.05, 0.01);                       // Dim red

    float angle = atan(p.z, p.x) + T * 0.5;

    // Turbulence
    float turb = fbm(vec2(angle * 2.0 + T * 0.3, r * 2.5));
    turb = 0.3 + 0.7 * turb;

    // Spiral arms
    float spiral = 0.65 + 0.35 * sin(angle * 3.0 - r * 4.0 + T * 1.2);

    // Doppler beaming
    float doppler = 0.5 + 0.5 * cos(angle - T * 0.5);

    float brightness = ratio * ratio * turb * spiral * doppler * 4.0;

    // Inner edge ISCO glow
    float isco = exp(-(r - inner) * 2.0) * 5.0;
    c += vec3(0.5, 0.3, 0.15) * isco;

    return c * brightness;
}

void main() {
    vec2 uv = (gl_FragCoord.xy - R * 0.5) / R.y;

    // ── Camera: pulled back, low angle for cinematic thin-disk view ──
    float camDist = 28.0;
    float camElev = 0.18;  // ~10 degrees — nearly edge-on
    vec3 ro = vec3(0.0, camDist * sin(camElev), -camDist * cos(camElev));

    vec3 fwd = normalize(-ro);
    vec3 right = normalize(cross(fwd, vec3(0, 1, 0)));
    vec3 vup = cross(right, fwd);
    vec3 rd = normalize(fwd * 2.2 + right * uv.x + vup * uv.y);

    // ── Schwarzschild ray trace ──
    vec3 pos = ro;
    vec3 vel = rd;
    float h2 = dot(cross(pos, vel), cross(pos, vel));

    vec3 color = vec3(0.0);
    float prevY = pos.y;
    bool absorbed = false;

    for (int i = 0; i < STEPS; i++) {
        float r = length(pos);

        // GR geodesic acceleration
        vec3 acc = -1.5 * h2 / (r * r * r * r * r) * pos;

        float dt = 0.1 + 0.06 * clamp(r - 2.0, 0.0, 8.0);
        vel += acc * dt;
        pos += vel * dt;

        float newR = length(pos);

        // Event horizon
        if (newR < 0.5) {
            absorbed = true;
            break;
        }

        // Disk plane crossing (y sign change)
        if (pos.y * prevY < 0.0 && newR > 2.8 && newR < 15.0) {
            float frac = abs(prevY) / (abs(prevY) + abs(pos.y));
            vec3 hitP = pos - vel * dt * (1.0 - frac);
            float hitR = length(hitP);

            vec3 dc = diskColor(hitP, hitR);
            if (length(dc) > 0.005) {
                float opacity = clamp(length(dc) * 0.35, 0.0, 0.9);
                color = color * (1.0 - opacity) + dc;
            }
        }

        prevY = pos.y;

        // Escape
        if (newR > 40.0) {
            color += stars(normalize(pos));
            break;
        }
    }

    if (absorbed) {
        color = vec3(0.0);
    }

    // Photon ring
    float sd = length(uv - vec2(0.0, 0.03));
    float pr = 0.038;
    float rd2 = abs(sd - pr);
    float ring = exp(-rd2 * 350.0) * 0.5 * (0.7 + 0.3 * sin(T * 1.5));
    color += vec3(1.0, 0.88, 0.65) * ring;

    // Tone mapping
    color = color / (color + 0.7);
    color = pow(color, vec3(0.92, 0.97, 1.05));

    // Vignette
    vec2 vu = gl_FragCoord.xy / R;
    color *= 1.0 - 0.3 * length(vu - 0.5);

    gl_FragColor = vec4(color, 1.0);
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
