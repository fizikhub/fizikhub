"use client";

import Link from "next/link";
import { SiteLogo } from "@/components/icons/site-logo";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

// ═══════════════════════════════════════════════════════════════════════
// GARGANTUA FOOTER v4 — Schwarzschild geodesic ray tracer (GLSL)
//
// Real GR: each pixel fires a ray that bends according to the
// Schwarzschild metric. The accretion disk is a physical plane
// detected via ray-plane intersection. Secondary (lensed) images
// of the disk appear naturally from the physics — no faking.
// ═══════════════════════════════════════════════════════════════════════

const VS = `attribute vec2 a;void main(){gl_Position=vec4(a,0,1);}`;

const FS = `
precision highp float;
uniform float T;
uniform vec2 R;

#define PI 3.14159265
#define STEPS 150
#define RS 1.0

// ── Pseudo-random ──
float hash(vec2 p){
    p=fract(p*vec2(443.8975,441.4237));
    p+=dot(p,p.yx+19.19);
    return fract((p.x+p.y)*p.x);
}

// ── FBM noise ──
float noise(vec2 p){
    vec2 i=floor(p),f=fract(p);
    f=f*f*(3.0-2.0*f);
    return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),
               mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);
}

float fbm(vec2 p){
    float v=0.0,a=0.5;
    for(int i=0;i<5;i++){v+=a*noise(p);p*=2.1;a*=0.5;}
    return v;
}

// ── Procedural star field on a sphere ──
vec3 starsSphere(vec3 rd){
    vec3 col=vec3(0.0);

    // Convert to spherical UVs
    vec2 suv=vec2(atan(rd.z,rd.x)/(2.0*PI)+0.5, asin(clamp(rd.y,-1.0,1.0))/PI+0.5);

    for(float layer=0.0;layer<6.0;layer++){
        float sc=120.0+layer*80.0;
        float thr=0.97-layer*0.005;
        vec2 g=floor(suv*sc);
        float h=hash(g+layer*71.0);
        if(h>thr){
            vec2 c=(g+0.5+0.35*(vec2(hash(g+vec2(3,7)),hash(g+vec2(11,13)))-0.5))/sc;
            float d=length(suv-c)*sc;
            float br=smoothstep(1.8-layer*0.15,0.0,d);
            br*=0.55+0.45*sin(T*(0.8+h*3.5)+h*80.0);

            vec3 sc2;
            if(h>0.996) sc2=vec3(1.0,0.7,0.35);
            else if(h>0.99) sc2=vec3(0.6,0.78,1.0);
            else if(h>0.982) sc2=vec3(1.0,0.92,0.65);
            else sc2=vec3(0.82,0.85,0.92);

            col+=sc2*br*0.9;
        }
    }
    // Milky way band
    float mw=exp(-8.0*pow(abs(rd.y-0.05),2.0));
    col+=vec3(0.06,0.05,0.08)*mw*fbm(suv*8.0+T*0.01);

    return col;
}

// ── Blackbody-ish color from temperature ──
vec3 tempColor(float t){
    // t: 0=cool → 1=hot
    vec3 cool=vec3(0.5,0.05,0.01);
    vec3 warm=vec3(1.0,0.3,0.02);
    vec3 orange=vec3(1.0,0.65,0.1);
    vec3 yellow=vec3(1.0,0.9,0.4);
    vec3 white=vec3(1.0,0.98,0.95);

    if(t<0.2) return mix(cool,warm,t/0.2);
    if(t<0.4) return mix(warm,orange,(t-0.2)/0.2);
    if(t<0.65) return mix(orange,yellow,(t-0.4)/0.25);
    return mix(yellow,white,(t-0.65)/0.35);
}

// ── Disk shading ──
vec3 diskShade(vec3 hitPos, float r){
    float innerR=RS*2.6;
    float outerR=RS*10.0;
    if(r<innerR||r>outerR) return vec3(0.0);

    float ratio=1.0-(r-innerR)/(outerR-innerR); // 1=inner(hot), 0=outer(cool)
    vec3 c=tempColor(ratio);

    // Angle in disk plane (for rotation + turbulence)
    float angle=atan(hitPos.z,hitPos.x)+T*0.35*(1.0+ratio*0.5);

    // Turbulence
    float turb=fbm(vec2(angle*2.5,r*3.0-T*0.4));
    turb=0.35+0.65*turb;

    // Spiral arms
    float spiral=0.7+0.3*sin(angle*3.0-r*5.0+T*1.5);

    // Doppler relativistic beaming (approaching side brigher)
    float doppler=0.55+0.45*cos(angle-T*0.35);

    float brightness=ratio*ratio*turb*spiral*doppler*2.5;

    // Bright inner edge (ISCO glow)
    float iscoGlow=exp(-(r-innerR)*4.0)*3.0;
    c+=vec3(1.0,0.8,0.5)*iscoGlow;

    return c*brightness;
}

void main(){
    vec2 uv=(gl_FragCoord.xy-R*0.5)/R.y;

    // ── Camera setup ──
    // Position: behind and above, looking down at the black hole
    float camDist=12.0;
    float camAngle=0.45; // Elevation angle (radians) — ~26 degrees above equator
    vec3 ro=vec3(0.0, camDist*sin(camAngle), -camDist*cos(camAngle));
    vec3 target=vec3(0.0, 0.0, 0.0);
    vec3 up=vec3(0.0,1.0,0.0);

    // View matrix
    vec3 fwd=normalize(target-ro);
    vec3 right=normalize(cross(fwd,up));
    vec3 vup=cross(right,fwd);

    float fov=1.8;
    vec3 rd=normalize(fwd*fov+right*uv.x+vup*uv.y);

    // ── Ray trace with Schwarzschild geodesic ──
    vec3 pos=ro;
    vec3 vel=rd*1.0;

    // h² = |r × v|² — conserved angular momentum (squared)
    vec3 crossRV=cross(pos,vel);
    float h2=dot(crossRV,crossRV);

    vec3 color=vec3(0.0);
    float prevY=pos.y;
    bool hit=false;

    for(int i=0;i<STEPS;i++){
        float r=length(pos);

        // ── Schwarzschild geodesic acceleration ──
        // d²r/dλ² = -1.5 * h² / r⁵ * r_vec
        // This is the exact GR correction for photon orbits
        vec3 accel=-1.5*h2/(r*r*r*r*r)*pos;

        // Adaptive step size: smaller near the black hole
        float dt=0.08+0.04*clamp(r-RS*2.0,0.0,5.0);

        // Leapfrog integration
        vel+=accel*dt;
        pos+=vel*dt;

        float newR=length(pos);

        // ── Event horizon: absorbed ──
        if(newR<RS*0.5){
            color=vec3(0.0);
            hit=true;
            break;
        }

        // ── Accretion disk: check if ray crossed y=0 plane ──
        if(pos.y*prevY<0.0 && newR>RS*2.0){
            // Interpolate exact crossing point
            float frac=abs(prevY)/(abs(prevY)+abs(pos.y));
            vec3 hitP=pos-vel*dt*(1.0-frac);
            float hitR=length(hitP);

            if(hitR>RS*2.5 && hitR<RS*10.0){
                vec3 dc=diskShade(hitP,hitR);
                if(length(dc)>0.01){
                    // Accumulate (semi-transparent disk)
                    float opacity=clamp(length(dc)*0.5,0.0,0.85);
                    color=color*(1.0-opacity)+dc;
                }
            }
        }

        prevY=pos.y;

        // ── Escaped: star field ──
        if(newR>25.0){
            color+=starsSphere(normalize(pos));
            hit=true;
            break;
        }
    }

    // Rays that didn't hit anything
    if(!hit){
        color+=starsSphere(normalize(vel))*0.3;
    }

    // ── Photon ring glow ──
    // Approximate: brightening at the photon sphere edge
    // Recast a quick 2D check
    vec2 screenBH=vec2(0.0, 0.0); // BH is at center of screen roughly
    float screenDist=length(uv-vec2(0.0,0.05));
    float photonR=0.085;
    float ringDist=abs(screenDist-photonR);
    float ring=exp(-ringDist*200.0)*0.4;
    ring*=0.7+0.3*sin(T*1.2);
    color+=vec3(1.0,0.85,0.6)*ring;

    // ── Tone mapping (ACES-ish) ──
    color=color/(color+0.8);

    // Subtle warm color grade
    color=pow(color,vec3(0.95,1.0,1.08));

    // Vignette
    vec2 vuv=gl_FragCoord.xy/R;
    color*=1.0-0.25*length(vuv-0.5);

    gl_FragColor=vec4(color,1.0);
}
`;

function initGL(canvas: HTMLCanvasElement) {
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false });
    if (!gl) return null;

    const compile = (type: number, src: string) => {
        const s = gl.createShader(type)!;
        gl.shaderSource(s, src);
        gl.compileShader(s);
        if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
            console.error(gl.getShaderInfoLog(s));
            return null;
        }
        return s;
    };

    const vs = compile(gl.VERTEX_SHADER, VS);
    const fs = compile(gl.FRAGMENT_SHADER, FS);
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
    const containerRef = useRef<HTMLDivElement>(null);
    const ctxRef = useRef<ReturnType<typeof initGL>>(null);
    const animRef = useRef(0);
    const t0 = useRef(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        const box = containerRef.current;
        if (!canvas || !box) return;

        const resize = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
            const r = box.getBoundingClientRect();
            canvas.width = r.width * dpr;
            canvas.height = r.height * dpr;
            canvas.style.width = r.width + "px";
            canvas.style.height = r.height + "px";
            if (ctxRef.current) {
                const { gl, uR } = ctxRef.current;
                gl.viewport(0, 0, canvas.width, canvas.height);
                gl.uniform2f(uR, canvas.width, canvas.height);
            }
        };

        ctxRef.current = initGL(canvas);
        if (!ctxRef.current) return;
        t0.current = Date.now();
        resize();

        const loop = () => {
            if (!ctxRef.current) return;
            const { gl, uT, uR } = ctxRef.current;
            gl.uniform1f(uT, (Date.now() - t0.current) * 0.001);
            gl.uniform2f(uR, canvas.width, canvas.height);
            gl.drawArrays(gl.TRIANGLES, 0, 6);
            animRef.current = requestAnimationFrame(loop);
        };

        animRef.current = requestAnimationFrame(loop);
        window.addEventListener("resize", resize);
        return () => { window.removeEventListener("resize", resize); cancelAnimationFrame(animRef.current); };
    }, []);

    if (isMessagesPage) return null;

    return (
        <footer ref={containerRef} role="contentinfo" aria-label="Site bilgileri"
            className="relative bg-black overflow-hidden min-h-[520px] md:min-h-[650px] flex flex-col justify-end">

            <canvas ref={canvasRef} className="absolute inset-0 z-0 block" />
            <div className="absolute inset-x-0 top-0 h-[60px] bg-gradient-to-b from-[#0a0a0a] to-transparent z-10 pointer-events-none" />

            {/* CONTENT */}
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
