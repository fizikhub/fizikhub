// Script to generate the updated file
const fs = require('fs');
const file = '/Users/baran/.gemini/antigravity/scratch/fizikhub/components/blog/article-reader.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace("import { AnimatePresence, m as motion } from \"framer-motion\";", "import { AnimatePresence, m as motion, useScroll, useMotionValueEvent, useTransform } from \"framer-motion\";");

// We need to rewrite the state part
const stateReplacement = `
    const [isZenMode, setIsZenMode] = useState(false);
    const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg' | 'xl'>('base');
    const [fontFamily, setFontFamily] = useState<'sans' | 'serif'>('sans');
    const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
    const [showScrollTop, setShowScrollTop] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);
    const pillRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll();

    // Parse total reading time from the "X dk" string
    const totalMinutes = parseInt(readingTime) || 5;

    // Use framer-motion to avoid react re-renders on every scroll tick
    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        // Toggle scroll-to-top button
        if (latest > 0.3 && !showScrollTop) {
            setShowScrollTop(true);
        } else if (latest <= 0.3 && showScrollTop) {
            setShowScrollTop(false);
        }

        // Update pill text directly via ref to bypass react render
        if (pillRef.current) {
            const progress = latest * 100;
            const minutesRemaining = Math.max(1, Math.ceil(totalMinutes * (1 - latest)));
            const showTimeRemaining = progress > 5 && progress < 95;
            
            if (showTimeRemaining) {
                pillRef.current.classList.add("visible");
                pillRef.current.textContent = \`~\${minutesRemaining} dk kaldı\`;
            } else {
                pillRef.current.classList.remove("visible");
            }
        }
    });
`;

// regex to replace the state and useEffect block
const stateRegex = /const \[isZenMode, setIsZenMode\] = useState\(false\);[\s\S]*?\}, \[\]\);/m;
content = content.replace(stateRegex, stateReplacement.trim() + "\n");

// Fix the progress bar div
const progressBarRegex = /\{?\/\*\s*Reading Progress Bar\s*\*\/\s*\}?\s*<div className="fixed top-0 left-0 w-full h-1\.5 z-\[100\] bg-zinc-200\/50 dark:bg-zinc-800\/50 backdrop-blur-sm">\s*<div\s*className="h-full bg-\[#FFC800\] dark:bg-\[#23A9FA\] transition-all duration-150 ease-out origin-left"\s*style=\{\{ width: \`\$\{scrollProgress\}%\` \}\}\s*\/>\s*<\/div>/m;

const progressBarReplacement = `
            {/* Reading Progress Bar has been DELETED because app/makale/[slug]/page.tsx already renders <ReadingProgress /> globally! */}
`;
content = content.replace(progressBarRegex, progressBarReplacement.trim());

const scrollTopRegex = /\{scrollProgress > 30 && \(/m;
content = content.replace(scrollTopRegex, "{showScrollTop && (");

const pillRegex = /<div className=\{cn\("reading-time-pill", showTimeRemaining && "visible"\)\}>\s*~\{minutesRemaining\} dk kaldı\s*<\/div>/m;
content = content.replace(pillRegex, '<div ref={pillRef} className="reading-time-pill"></div>');

fs.writeFileSync(file, content);
console.log("Patched!");
