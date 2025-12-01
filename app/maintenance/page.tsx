'use client'

import { motion } from 'framer-motion'
import { Wrench, Scissors, Sparkles } from 'lucide-react'

export default function MaintenancePage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-muted p-4 text-center">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-2xl space-y-8"
            >
                <div className="flex justify-center gap-4 mb-8">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    >
                        <Wrench className="w-12 h-12 text-primary" />
                    </motion.div>
                    <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    >
                        <Scissors className="w-12 h-12 text-primary" />
                    </motion.div>
                </div>

                <motion.h1
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 20
                    }}
                    className="text-4xl md:text-6xl font-bold tracking-tight"
                >
                    Bakımdayız Hocam
                </motion.h1>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-4 text-lg md:text-xl text-muted-foreground"
                >
                    <p className="font-medium text-foreground">
                        Tıraş olup fön çektiriyoruz. <Sparkles className="inline w-5 h-5 text-yellow-500" />
                    </p>
                    <p>
                        Şaka şaka, bir sorun ile uğraşıyoruz ve sitede kötü deneyime sahip olma diye giriş yapmanı engelliyoruz.
                    </p>
                    <p className="text-sm italic">
                        Yakında çözeriz (umarım) 🤞
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="pt-8"
                >
                    <div className="h-2 w-48 mx-auto bg-muted rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-primary"
                            animate={{ x: ["-100%", "100%"] }}
                            transition={{
                                repeat: Infinity,
                                duration: 1.5,
                                ease: "easeInOut"
                            }}
                        />
                    </div>
                </motion.div>
            </motion.div>
        </div>
    )
}
