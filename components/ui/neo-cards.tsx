"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { MessageSquare, Heart, Bookmark, Eye, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

/* -----------------------------------------------------------------------------------------------
 * UTILS
 * -----------------------------------------------------------------------------------------------*/

// Hard shadow style for neo-brutalist effect
const shadowStyle = "shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.9)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200";
const borderStyle = "border-2 border-black dark:border-white";

/* -----------------------------------------------------------------------------------------------
 * NEO ARTICLE CARD
 * -----------------------------------------------------------------------------------------------*/
interface NeoArticleCardProps {
  article: any;
  index?: number;
}

export function NeoArticleCard({ article, index = 0 }: NeoArticleCardProps) {
  const isVideo = article.is_video || false; // Mock or actual check
  // fallback or actual image
  const imageUrl = article.cover_image || "/placeholder-cover.jpg";
  const authorAvatar = article.author?.avatar_url || "/default-avatar.png";
  const authorName = article.author?.full_name || article.author?.username || "Anonim";
  
  return (
    <Link href={`/makale/${article.slug}`} className="block h-full cursor-pointer group">
      <article 
        className={cn(
          "relative flex flex-col h-full bg-white dark:bg-zinc-900 overflow-hidden rounded-xl",
          borderStyle,
          shadowStyle
        )}
      >
        {/* Image Section */}
        <div className="relative aspect-[16/9] w-full border-b-2 border-black dark:border-white overflow-hidden bg-gray-100 dark:bg-zinc-800">
           {article.category && (
              <div className="absolute top-3 left-3 z-10">
                 <Badge className="bg-yellow-400 text-black border-2 border-black hover:bg-yellow-500 rounded-none text-xs font-bold uppercase tracking-wider px-2 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    {article.category}
                 </Badge>
              </div>
           )}
           <Image
             src={imageUrl}
             alt={article.title}
             fill
             className="object-cover transition-transform duration-500 group-hover:scale-105"
           />
           {isVideo && (
             <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-transparent transition-colors">
               <div className="w-12 h-12 bg-red-600 rounded-full border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                 <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[14px] border-l-white border-b-[8px] border-b-transparent ml-1" />
               </div>
             </div>
           )}
        </div>

        {/* Content Section */}
        <div className="flex flex-col flex-1 p-4 sm:p-5">
           <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full border-2 border-black dark:border-white overflow-hidden relative shrink-0">
                  <Image src={authorAvatar} alt={authorName} fill className="object-cover" />
              </div>
              <div className="flex flex-col">
                  <span className="text-xs font-bold truncate max-w-[120px]">{authorName}</span>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-widest">
                    {new Date(article.created_at).toLocaleDateString('tr-TR')}
                  </span>
              </div>
           </div>

           <h3 className="text-lg sm:text-xl font-black leading-tight mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-yellow-400 transition-colors">
             {article.title}
           </h3>

           <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-1">
             {article.summary || article.content?.substring(0, 100) + "..."}
           </p>

           {/* Footer Actions */}
           <div className="flex items-center justify-between pt-4 border-t-2 border-black/10 dark:border-white/10 mt-auto">
              <div className="flex items-center gap-4 text-sm font-semibold">
                  <div className="flex items-center gap-1.5">
                      <Heart className="w-4 h-4" />
                      <span>{article.likes_count || 0}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                      <MessageSquare className="w-4 h-4" />
                      <span>{article.comments_count || 0}</span>
                  </div>
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-200">
                  <ArrowUpRight className="w-6 h-6 text-black dark:text-white" />
              </div>
           </div>
        </div>
      </article>
    </Link>
  );
}

/* -----------------------------------------------------------------------------------------------
 * NEO BLOG CARD (Similar but simpler/colorful)
 * -----------------------------------------------------------------------------------------------*/
export function NeoBlogCard({ article, index }: NeoArticleCardProps) {
    // For blogs, maybe a slightly different style or color accent?
    // Let's use a "sticky note" vibe or cleaner layout.
    return (
        <NeoArticleCard article={article} index={index} />
        // Reusing for consistency, maybe differentiate via category badge color above
    );
}


/* -----------------------------------------------------------------------------------------------
 * NEO QUESTION CARD
 * -----------------------------------------------------------------------------------------------*/
interface NeoQuestionCardProps {
    question: any;
}

export function NeoQuestionCard({ question }: NeoQuestionCardProps) {
    const authorAvatar = question.profiles?.avatar_url || "/default-avatar.png";
    const authorName = question.profiles?.username || "Anonim";
    const answerCount = question.answer_count || question.answers?.[0]?.count || 0;

    return (
        <Link href={`/forum/${question.id}`} className="block w-full cursor-pointer group">
            <div className={cn(
                "relative flex flex-col bg-[#f0f0f0] dark:bg-zinc-900 p-4 sm:p-5 rounded-xl h-full",
                borderStyle,
                shadowStyle,
                "hover:bg-[#e4e4e4] dark:hover:bg-zinc-800"
            )}>
                 {/* Top Row: User & Badge */}
                 <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-lg border-2 border-black dark:border-white overflow-hidden relative shrink-0 bg-white">
                             <Image src={authorAvatar} alt={authorName} fill className="object-cover" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-bold text-blue-600 dark:text-blue-400">@{authorName}</span>
                            <span className="text-[10px] text-muted-foreground font-mono">
                                {new Date(question.created_at).toLocaleDateString('tr-TR')}
                            </span>
                        </div>
                    </div>
                    <Badge variant="outline" className="border-2 border-black dark:border-white rounded-md bg-white dark:bg-black text-xs font-bold px-2 py-1">
                        SORU
                    </Badge>
                 </div>

                 {/* Question Content */}
                 <h4 className="text-base sm:text-lg font-black leading-snug mb-2 group-hover:underline decoration-2 underline-offset-2">
                    {question.title}
                 </h4>
                 
                 {/* Chips/Tags */}
                 <div className="flex flex-wrap gap-2 mb-4">
                     {question.category && (
                         <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-black dark:border-white bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300">
                             #{question.category}
                         </span>
                     )}
                       {question.tags && question.tags.map((tag: string) => (
                         <span key={tag} className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-black/20 dark:border-white/20 bg-transparent text-muted-foreground">
                             #{tag}
                         </span>
                     ))}
                 </div>

                 {/* Bottom Actions */}
                 <div className="mt-auto pt-3 border-t-2 border-dashed border-black/10 dark:border-white/10 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    <div className="flex items-center gap-4">
                        <span className={cn("px-2 py-1 rounded bg-black/5 dark:bg-white/5", answerCount > 0 && "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400")}>
                             {answerCount} Cevap
                        </span>
                        <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {question.views || 0}
                        </span>
                    </div>
                    <div className="text-blue-600 group-hover:translate-x-1 transition-transform">
                        YANITLA →
                    </div>
                 </div>
            </div>
        </Link>
    );
}

