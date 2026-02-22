"use client";

import Link from "next/link";
import { DankLogo } from "@/components/brand/dank-logo";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

// ═══════════════════════════════════════════════════════════════
// BLACK HOLE FOOTER v6 — Cinematic Interstellar-quality
// Enhanced Schwarzschild ray tracer with prominent accretion disk,
// brighter photon ring, stronger Doppler beaming, event horizon glow
// ═══════════════════════════════════════════════════════════════

const VS = `attribute vec2 a;void main(){gl_Position=vec4(a,0,1);}`;

const FS = `
precision highp float;
uniform float T;
uniform vec2 R;

#define PI 3.14159265
#define STEPS 160

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
    for (int i = 0; i < 7; i++) { v += a * noise(p); p *= 2.1; a *= 0.47; }
    return v;
}

// ── Dense star field with nebula dust ──
vec3 stars(vec3 rd) {
    vec3 col = vec3(0.0);
    vec2 suv = vec2(atan(rd.z, rd.x) / (2.0 * PI) + 0.5,
                     asin(clamp(rd.y, -1.0, 1.0)) / PI + 0.5);

    // 10 layers of stars for dense Milky Way
    for (float l = 0.0; l < 10.0; l++) {
        float sc = 80.0 + l * 70.0;
        float thr = 0.968 - l * 0.003;
        vec2 g = floor(suv * sc);
        float h = hash(g + l * 53.0);
        if (h > thr) {
            vec2 c = (g + 0.5 + 0.4 * (vec2(hash(g + 1.0), hash(g + 2.0)) - 0.5)) / sc;
            float d = length(suv - c) * sc;
            float br = smoothstep(1.8 - l * 0.08, 0.0, d);
            br *= 0.5 + 0.5 * sin(T * (0.4 + h * 3.0) + h * 80.0);

            vec3 sc2 = h > 0.997 ? vec3(1.0, 0.55, 0.2) :
                       h > 0.993 ? vec3(0.5, 0.7, 1.0) :
                       h > 0.988 ? vec3(1.0, 0.95, 0.7) :
                       h > 0.982 ? vec3(0.9, 0.55, 0.95) :
                                   vec3(0.85, 0.88, 0.95);
            col += sc2 * br * 1.0;
        }
    }

    // Milky Way band
    float mw = exp(-6.0 * pow(abs(rd.y + 0.05), 2.0));
    float mwNoise = fbm(suv * 14.0 + T * 0.002);
    col += vec3(0.06, 0.045, 0.08) * mw * mwNoise;
    col += vec3(0.04, 0.02, 0.05) * mw * fbm(suv * 22.0 - 5.0);

    // Nebula dust clouds
    float neb1 = fbm(suv * 4.0 + vec2(T * 0.002, 0.0));
    float neb2 = fbm(suv * 3.5 + vec2(0.0, T * 0.001) + 50.0);
    col += vec3(0.025, 0.005, 0.035) * neb1 * smoothstep(0.4, 0.7, neb1);
    col += vec3(0.005, 0.012, 0.03) * neb2 * smoothstep(0.45, 0.75, neb2);

    return col;
}

// ── Accretion disk — Interstellar style ──
vec3 diskColor(vec3 p, float r) {
    float inner = 3.0;
    float outer = 12.0;
    if (r < inner || r > outer) return vec3(0.0);

    float ratio = 1.0 - (r - inner) / (outer - inner);
    ratio = pow(ratio, 0.65);

    // Blackbody temperature gradient — hot white core to deep red/orange outer
    vec3 c;
    if (ratio > 0.92) c = mix(vec3(1.0, 0.95, 0.85), vec3(1.0, 1.0, 0.98), (ratio - 0.92) / 0.08);
    else if (ratio > 0.75) c = mix(vec3(1.0, 0.72, 0.25), vec3(1.0, 0.95, 0.85), (ratio - 0.75) / 0.17);
    else if (ratio > 0.5) c = mix(vec3(1.0, 0.42, 0.08), vec3(1.0, 0.72, 0.25), (ratio - 0.5) / 0.25);
    else if (ratio > 0.25) c = mix(vec3(0.7, 0.18, 0.03), vec3(1.0, 0.42, 0.08), (ratio - 0.25) / 0.25);
    else c = mix(vec3(0.2, 0.04, 0.01), vec3(0.7, 0.18, 0.03), ratio / 0.25);

    float angle = atan(p.z, p.x) + T * 0.35;

    // Rich turbulence (7 octaves)
    float turb = fbm(vec2(angle * 3.0 + T * 0.2, r * 3.5 - T * 0.25));
    float turb2 = fbm(vec2(angle * 6.0 - T * 0.35, r * 7.0 + T * 0.15));
    float turb3 = fbm(vec2(angle * 1.5 + T * 0.1, r * 1.8));
    turb = 0.2 + 0.8 * (turb * 0.5 + turb2 * 0.3 + turb3 * 0.2);

    // Multiple spiral arms — more defined
    float spiral = 0.55 + 0.3 * sin(angle * 3.0 - r * 5.0 + T * 0.8);
    spiral += 0.15 * sin(angle * 7.0 + r * 2.5 - T * 0.6);
    spiral += 0.08 * sin(angle * 13.0 - r * 8.0 + T * 1.2);

    // Doppler relativistic beaming — STRONG asymmetry
    float doppler = 0.25 + 0.75 * cos(angle - T * 0.35);
    doppler = pow(max(doppler, 0.0), 1.8);

    float brightness = ratio * ratio * turb * spiral * doppler * 7.0;

    // ISCO inner edge blaze — super hot
    float isco = exp(-(r - inner) * 2.0) * 8.0;
    c += vec3(0.8, 0.5, 0.2) * isco;

    // Hot spots
    float hotspot = smoothstep(0.7, 0.78, fbm(vec2(angle * 4.0 + T * 0.7, r * 9.0)));
    c += vec3(0.5, 0.3, 0.12) * hotspot * ratio * 4.0;

    // Gravitational redshift at inner edge
    float redshift = smoothstep(inner + 2.0, inner, r);
    c = mix(c, c * vec3(1.2, 0.7, 0.4), redshift * 0.5);

    return c * brightness;
}

void main() {
    vec2 uv = (gl_FragCoord.xy - R * 0.5) / R.y;

    // ── Camera — slightly elevated for better tilt ──
    float camDist = 24.0;
    float camElev = 0.22;
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
    float totalDiskLight = 0.0;

    for (int i = 0; i < STEPS; i++) {
        float r = length(pos);
        vec3 acc = -1.5 * h2 / (r * r * r * r * r) * pos;
        float dt = 0.08 + 0.05 * clamp(r - 2.0, 0.0, 8.0);
        vel += acc * dt;
        pos += vel * dt;
        float newR = length(pos);

        if (newR < 0.5) { absorbed = true; break; }

        // Disk crossing — collect light from both faces
        if (pos.y * prevY < 0.0 && newR > 2.8 && newR < 13.0) {
            float frac = abs(prevY) / (abs(prevY) + abs(pos.y));
            vec3 hitP = pos - vel * dt * (1.0 - frac);
            float hitR = length(hitP);
            vec3 dc = diskColor(hitP, hitR);
            if (length(dc) > 0.003) {
                float opacity = clamp(length(dc) * 0.45, 0.0, 0.95);
                color = color * (1.0 - opacity) + dc;
                diskGlow += length(dc) * 0.2;
                totalDiskLight += length(dc);
            }
        }

        prevY = pos.y;
        if (newR > 40.0) { color += stars(normalize(pos)); break; }
    }

    if (absorbed) {
        // Event horizon — faint dark purple/blue rim glow
        color = vec3(0.0);
    }

    // ── Photon ring — TRIPLE RING for realism ──
    float sd = length(uv - vec2(0.0, 0.035));
    float pr1 = 0.036;
    float pr2 = 0.041;
    float pr3 = 0.033;
    float ring1 = exp(-abs(sd - pr1) * 600.0) * 0.8 * (0.75 + 0.25 * sin(T * 1.2));
    float ring2 = exp(-abs(sd - pr2) * 350.0) * 0.35 * (0.65 + 0.35 * sin(T * 1.8 + 1.0));
    float ring3 = exp(-abs(sd - pr3) * 800.0) * 0.5 * (0.7 + 0.3 * sin(T * 2.5 + 2.0));
    color += vec3(1.0, 0.95, 0.8) * ring1;
    color += vec3(1.0, 0.8, 0.55) * ring2;
    color += vec3(1.0, 0.98, 0.92) * ring3;

    // ── Event horizon rim glow — dark blue/purple ──
    float ehR = 0.025;
    float ehGlow = exp(-abs(sd - ehR) * 200.0) * 0.2;
    float ehGlow2 = exp(-abs(sd - ehR) * 80.0) * 0.08;
    color += vec3(0.15, 0.1, 0.35) * ehGlow;
    color += vec3(0.08, 0.05, 0.2) * ehGlow2;

    // ── Relativistic jets (faint blue beams) ──
    float jetX = abs(uv.x);
    float jetY = uv.y - 0.035;
    float jetUp = smoothstep(0.01, 0.0, jetX) * smoothstep(0.0, 0.12, jetY) * smoothstep(0.45, 0.08, jetY);
    float jetDown = smoothstep(0.01, 0.0, jetX) * smoothstep(0.0, -0.08, -jetY) * smoothstep(-0.3, -0.06, -jetY);
    float jetTurb = 0.6 + 0.4 * sin(jetY * 90.0 + T * 3.5);
    color += vec3(0.25, 0.45, 1.0) * jetUp * 0.12 * jetTurb;
    color += vec3(0.2, 0.35, 0.85) * jetDown * 0.06 * jetTurb;

    // ── Soft bloom from accumulated disk light ──
    float bloomR = length(uv - vec2(0.0, 0.035));
    float bloom = exp(-bloomR * 7.0) * diskGlow * 0.35;
    float bloom2 = exp(-bloomR * 3.0) * diskGlow * 0.08;
    color += vec3(1.0, 0.75, 0.35) * bloom;
    color += vec3(0.8, 0.5, 0.2) * bloom2;

    // ── Gravitational lensing distortion glow around shadow ──
    float lensR = length(uv - vec2(0.0, 0.035));
    float lens = exp(-pow(abs(lensR - 0.05), 2.0) * 800.0) * 0.15;
    color += vec3(1.0, 0.85, 0.5) * lens;

    // ── ACES Tone mapping ──
    color = (color * (2.51 * color + 0.03)) / (color * (2.43 * color + 0.59) + 0.14);

    // Cinematic warm color grade
    color = pow(color, vec3(0.88, 0.93, 1.06));

    // Vignette
    vec2 vu = gl_FragCoord.xy / R;
    color *= 1.0 - 0.3 * pow(length(vu - 0.5), 1.5);

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

            {/* SMOOTH GRADIENT TRANSITION — tall multi-step fade from site into footer */}
            <div className="absolute inset-x-0 top-0 z-10 pointer-events-none"
                style={{ height: '180px' }}>
                <div className="w-full h-full"
                    style={{
                        background: 'linear-gradient(to bottom, #09090b 0%, #09090b 20%, rgba(9,9,11,0.95) 35%, rgba(9,9,11,0.8) 50%, rgba(9,9,11,0.5) 65%, rgba(9,9,11,0.2) 80%, transparent 100%)'
                    }}
                />
            </div>

            {/* LINK SECTIONS — glass backdrop for visibility */}
            <div className="container relative z-30 py-10 md:py-14">
                <div className="relative rounded-2xl backdrop-blur-md bg-black/40 border border-white/[0.06] p-6 md:p-10">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-10 text-center md:text-left w-full max-w-4xl mx-auto">
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center justify-center md:justify-start gap-2.5 mb-1">
                                <div className="w-1.5 h-5 bg-blue-400 rounded-full shadow-[0_0_12px_rgba(96,165,250,0.7)]" />
                                <h4 className="text-sm font-extrabold text-blue-200 uppercase tracking-widest"
                                    style={{ textShadow: '0 0 20px rgba(96,165,250,0.4)' }}>
                                    Keşif Modülü
                                </h4>
                            </div>
                            <nav aria-label="Keşif bağlantıları" className="flex flex-col gap-2.5">
                                <Link href="/kesfet" className="text-sm text-zinc-300 hover:text-yellow-400 transition-all duration-300 hover:translate-x-1.5 font-medium">Keşfet</Link>
                                <Link href="/testler" className="text-sm text-zinc-300 hover:text-yellow-400 transition-all duration-300 hover:translate-x-1.5 font-medium">Testler</Link>
                                <Link href="/sozluk" className="text-sm text-zinc-300 hover:text-yellow-400 transition-all duration-300 hover:translate-x-1.5 font-medium">Sözlük</Link>
                            </nav>
                        </div>
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center justify-center md:justify-start gap-2.5 mb-1">
                                <div className="w-1.5 h-5 bg-purple-400 rounded-full shadow-[0_0_12px_rgba(192,132,252,0.7)]" />
                                <h4 className="text-sm font-extrabold text-purple-200 uppercase tracking-widest"
                                    style={{ textShadow: '0 0 20px rgba(192,132,252,0.4)' }}>
                                    Topluluk
                                </h4>
                            </div>
                            <nav className="flex flex-col gap-2.5">
                                <Link href="/forum" className="text-sm text-zinc-300 hover:text-yellow-400 transition-all duration-300 hover:translate-x-1.5 font-medium">Forum</Link>
                                <Link href="/siralamalar" className="text-sm text-zinc-300 hover:text-yellow-400 transition-all duration-300 hover:translate-x-1.5 font-medium">Sıralamalar</Link>
                                <Link href="/yazar" className="text-sm text-zinc-300 hover:text-yellow-400 transition-all duration-300 hover:translate-x-1.5 font-medium">Yazarlar</Link>
                            </nav>
                        </div>
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center justify-center md:justify-start gap-2.5 mb-1">
                                <div className="w-1.5 h-5 bg-green-400 rounded-full shadow-[0_0_12px_rgba(74,222,128,0.7)]" />
                                <h4 className="text-sm font-extrabold text-green-200 uppercase tracking-widest"
                                    style={{ textShadow: '0 0 20px rgba(74,222,128,0.4)' }}>
                                    Kurumsal
                                </h4>
                            </div>
                            <nav className="flex flex-col gap-2.5">
                                <Link href="/hakkimizda" className="text-sm text-zinc-300 hover:text-yellow-400 transition-all duration-300 hover:translate-x-1.5 font-medium">Hakkımızda</Link>
                                <Link href="/iletisim" className="text-sm text-zinc-300 hover:text-yellow-400 transition-all duration-300 hover:translate-x-1.5 font-medium">İletişim</Link>
                                <Link href="/blog" className="text-sm text-zinc-300 hover:text-yellow-400 transition-all duration-300 hover:translate-x-1.5 font-medium">Blog</Link>
                            </nav>
                        </div>
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center justify-center md:justify-start gap-2.5 mb-1">
                                <div className="w-1.5 h-5 bg-red-400 rounded-full shadow-[0_0_12px_rgba(248,113,113,0.7)]" />
                                <h4 className="text-sm font-extrabold text-red-200 uppercase tracking-widest"
                                    style={{ textShadow: '0 0 20px rgba(248,113,113,0.4)' }}>
                                    Protokoller
                                </h4>
                            </div>
                            <nav className="flex flex-col gap-2.5">
                                <Link href="/gizlilik-politikasi" className="text-sm text-zinc-300 hover:text-yellow-400 transition-all duration-300 hover:translate-x-1.5 font-medium">Gizlilik</Link>
                                <Link href="/kullanim-sartlari" className="text-sm text-zinc-300 hover:text-yellow-400 transition-all duration-300 hover:translate-x-1.5 font-medium">Şartlar</Link>
                                <Link href="/kvkk" className="text-sm text-zinc-300 hover:text-yellow-400 transition-all duration-300 hover:translate-x-1.5 font-medium">KVKK</Link>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>

            {/* COPYRIGHT BAR — compact, with DankLogo */}
            <div className="relative z-40 w-full border-t border-white/[0.06] bg-black/60 backdrop-blur-sm pb-5 pt-3">
                <div className="container flex flex-col items-center justify-center gap-1.5 text-center">
                    <div className="scale-[0.55] origin-center -my-2">
                        <DankLogo />
                    </div>
                    <p className="text-[10px] font-mono text-zinc-500">&copy; 2025 FİZİKHUB.</p>
                    <span
                        className="font-black text-[11px] tracking-[0.25em] uppercase"
                        style={{
                            background: 'linear-gradient(90deg, #f97316, #ef4444, #f97316)',
                            backgroundSize: '200% 100%',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            textShadow: 'none',
                            filter: 'drop-shadow(0 0 8px rgba(249,115,22,0.4))',
                            animation: 'shimmer 3s ease-in-out infinite',
                        }}
                    >
                        İzinsiz kopyalayanı kara deliğe atarız.
                    </span>
                    <style>{`
                        @keyframes shimmer {
                            0%, 100% { background-position: 0% 50%; }
                            50% { background-position: 100% 50%; }
                        }
                    `}</style>
                </div>
            </div>
        </footer>
    );
}
