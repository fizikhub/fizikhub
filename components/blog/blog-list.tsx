"use client";

import { useState, useEffect } from "react";
import { BlogCard } from "@/components/blog/blog-card";
import { CategoryFilter } from "@/components/blog/category-filter";
import { motion, AnimatePresence } from "framer-motion";
import { Article } from "@/lib/api";

interface BlogListProps {
    initialArticles: Article[];
}

export function BlogList({ initialArticles }: BlogListProps) {
    const [selectedCategory, setSelectedCategory] = useState("Tümü");

    // Extract unique categories
    const categories = Array.from(new Set(initialArticles.map((article) => article.category).filter(Boolean))) as string[];

    // Filter articles
    const filteredArticles = selectedCategory === "Tümü"
        ? initialArticles
        : initialArticles.filter((article) => article.category === selectedCategory);

    // Manual Scroll Logic
    useEffect(() => {
        // Check if there is a hash in the URL
        if (window.location.hash) {
            const id = window.location.hash.substring(1); // Remove '#'
            const element = document.getElementById(id);

            if (element) {
                // Wait a bit for layout animations to settle
                setTimeout(() => {
                    element.scrollIntoView({ behavior: "smooth", block: "center" });
                }, 500);
            }
        }
    }, []); // Run only on mount

    return (
        <>
            {/* Filter Section */}
            <div className="mb-8 sm:mb-10 md:mb-12 sticky top-16 z-30 bg-background/95 backdrop-blur-lg py-4 sm:py-5 -mx-4 px-4 md:mx-0 md:px-0 border-b border-border/50 md:border-none shadow-sm md:shadow-none transition-all duration-300">
                <CategoryFilter
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onSelectCategory={setSelectedCategory}
                />
            </div>

            {/* Articles Grid */}
            <motion.div
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10"
            >
                <AnimatePresence mode="popLayout">
                    {filteredArticles.map((article) => (
                        <motion.div
                            key={article.id}
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                        >
                            <BlogCard article={article} />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>

            {/* Empty State */}
            {filteredArticles.length === 0 && (
                <div className="text-center py-20">
                    <p className="text-xl text-muted-foreground">
                        Bu kategoride henüz bir şey yok. 🕳️
                        <br />
                        <span className="text-sm mt-2 inline-block">Belki kara delik yutmuştur?</span>
                    </p>
                </div>
            )}
        </>
    );
}
