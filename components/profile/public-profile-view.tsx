"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, FileText, BadgeCheck, Globe, Twitter, Github, Linkedin, Instagram, MapPin, Calendar, Link as LinkIcon, Microscope, Activity, Scan } from "lucide-react";
import { StartChatButton } from "@/components/messaging/start-chat-button";
import { QuestionCard } from "@/components/forum/question-card";
import { FollowButton } from "@/components/profile/follow-button";
import { FollowStats } from "@/components/profile/follow-stats";
import { EditProfileButton } from "@/components/profile/edit-profile-button";
import { BadgeDisplay } from "@/components/badge-display";
import { ReputationDisplay } from "@/components/reputation-display";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

interface PublicProfileViewProps {
    profile: any;
    isOwnProfile: boolean;
    isFollowing: boolean;
    followersCount: number;
    followingCount: number;
    userBadges: any[];
    questions: any[];
    answersCount: number;
    user: any;
}

export function PublicProfileView({
    profile,
    isOwnProfile,
    isFollowing,
    followersCount,
    followingCount,
    userBadges,
    questions,
    answersCount,
    user
}: PublicProfileViewProps) {

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants: any = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        }
    };

    return (
        <div className="min-h-screen bg-background pb-20 overflow-x-hidden relative">
            {/* Laboratory Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

            {/* Top Ruler Decoration */}
            <div className="absolute top-0 left-0 w-full h-8 border-b border-black/10 dark:border-white/10 flex items-end justify-between px-4 font-mono text-[10px] text-muted-foreground select-none pointer-events-none">
                <span>00</span><span>10</span><span>20</span><span>30</span><span>40</span><span>50</span><span>60</span><span>70</span><span>80</span><span>90</span><span>100</span>
            </div>

            {/* Cover Area - Technical & Clean */}
            <div className="relative h-48 md:h-64 w-full overflow-hidden border-b border-black/10 dark:border-white/10 bg-muted/10">
                {profile.cover_url ? (
                    <div
                        className="absolute inset-0 bg-cover bg-center opacity-80 grayscale hover:grayscale-0 transition-all duration-700"
                        style={{ backgroundImage: `url(${profile.cover_url})` }}
                    />
                ) : (
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-background to-background" />
                )}

                {/* Overlay Grid */}
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />

                {/* Data Overlay */}
                <div className="absolute top-4 right-4 flex gap-2">
                    <div className="px-2 py-1 bg-background/80 backdrop-blur border border-black/10 dark:border-white/10 text-[10px] font-mono">
                        SUBJ_ID: {profile.id.substring(0, 8).toUpperCase()}
                    </div>
                </div>
            </div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="container px-4 md:px-6 mx-auto max-w-7xl relative z-10 -mt-12"
            >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Sidebar: Subject Identity */}
                    <motion.div variants={itemVariants} className="lg:col-span-4 space-y-6">
                        {/* Identity Card */}
                        <div className="bg-background border border-black/20 dark:border-white/20 p-6 relative shadow-sm">
                            {/* Scanner Corners */}
                            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary" />
                            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-primary" />
                            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-primary" />
                            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary" />

                            <div className="flex flex-col items-center text-center">
                                {/* Avatar Scanner Frame */}
                                <div className="relative mb-4 group">
                                    <div className="absolute inset-0 border-2 border-dashed border-primary/30 rounded-full animate-[spin_10s_linear_infinite] group-hover:border-primary/60" />
                                    <div className="h-32 w-32 rounded-full p-2 bg-background relative z-10">
                                        <Avatar className="h-full w-full">
                                            <AvatarImage src={profile.avatar_url || ""} className="object-cover" />
                                            <AvatarFallback className="text-4xl bg-muted font-mono">
                                                {profile.full_name?.charAt(0) || profile.username?.charAt(0).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                    </div>
                                    {profile.is_verified && (
                                        <div className="absolute bottom-2 right-2 z-20 bg-background rounded-full p-1 shadow-sm border border-black/10">
                                            <BadgeCheck className="h-5 w-5 text-blue-500 fill-blue-500/10" />
                                        </div>
                                    )}
                                </div>

                                <h1 className="text-2xl font-bold tracking-tight uppercase font-outfit">
                                    {profile.full_name || "BİLİNMEYEN DENEK"}
                                </h1>
                                <div className="flex items-center gap-2 mt-1 mb-4">
                                    <span className="font-mono text-sm text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-sm">
                                        @{profile.username}
                                    </span>
                                </div>

                                <div className="w-full border-t border-dashed border-black/10 dark:border-white/10 my-4" />

                                <div className="flex justify-center mb-4">
                                    <ReputationDisplay
                                        reputation={profile.reputation || 0}
                                        size="sm"
                                        showLabel={true}
                                        className="bg-transparent border border-primary/20"
                                    />
                                </div>

                                {profile.bio && (
                                    <div className="w-full bg-muted/10 border-l-2 border-primary/50 p-3 text-left mb-6">
                                        <p className="text-sm text-muted-foreground leading-relaxed font-mono text-xs">
                                            "{profile.bio}"
                                        </p>
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="w-full space-y-3">
                                    {isOwnProfile ? (
                                        <EditProfileButton
                                            currentFullName={profile.full_name}
                                            currentBio={profile.bio}
                                            currentAvatarUrl={profile.avatar_url}
                                            currentWebsite={profile.website}
                                            currentSocialLinks={profile.social_links}
                                            currentUsername={profile.username}
                                            userEmail={user?.email}
                                        />
                                    ) : (
                                        user && (
                                            <div className="grid grid-cols-2 gap-3">
                                                <StartChatButton otherUserId={profile.id} />
                                                <FollowButton targetUserId={profile.id} initialIsFollowing={isFollowing} />
                                            </div>
                                        )
                                    )}
                                </div>

                                {/* Meta Data */}
                                <div className="w-full mt-6 space-y-2 text-xs font-mono text-muted-foreground text-left">
                                    <div className="flex items-center justify-between border-b border-dashed border-black/5 dark:border-white/5 pb-1">
                                        <span className="flex items-center gap-2"><Calendar className="h-3 w-3" /> KAYIT TARİHİ</span>
                                        <span>{format(new Date(profile.created_at || new Date()), 'dd.MM.yyyy', { locale: tr })}</span>
                                    </div>
                                    {profile.website && (
                                        <div className="flex items-center justify-between border-b border-dashed border-black/5 dark:border-white/5 pb-1">
                                            <span className="flex items-center gap-2"><LinkIcon className="h-3 w-3" /> BAĞLANTI</span>
                                            <a href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`} target="_blank" rel="noopener noreferrer" className="hover:text-primary truncate max-w-[150px]">
                                                {profile.website.replace(/^https?:\/\//, '')}
                                            </a>
                                        </div>
                                    )}
                                </div>

                                {/* Social Links */}
                                <div className="flex gap-4 mt-4 pt-4 border-t border-black/10 dark:border-white/10">
                                    {profile.social_links?.twitter && (
                                        <a href={`https://twitter.com/${profile.social_links.twitter}`} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                                            <Twitter className="h-4 w-4" />
                                        </a>
                                    )}
                                    {profile.social_links?.github && (
                                        <a href={`https://github.com/${profile.social_links.github}`} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                                            <Github className="h-4 w-4" />
                                        </a>
                                    )}
                                    {profile.social_links?.linkedin && (
                                        <a href={`https://linkedin.com/in/${profile.social_links.linkedin}`} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                                            <Linkedin className="h-4 w-4" />
                                        </a>
                                    )}
                                    {profile.social_links?.instagram && (
                                        <a href={`https://instagram.com/${profile.social_links.instagram}`} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                                            <Instagram className="h-4 w-4" />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Badges Module */}
                        <div className="bg-background border border-black/20 dark:border-white/20 p-4 relative">
                            <div className="absolute -top-3 left-4 bg-background px-2 text-xs font-bold uppercase tracking-wider text-primary border border-primary/20">
                                BAŞARI KAYITLARI
                            </div>
                            {userBadges && userBadges.length > 0 ? (
                                <BadgeDisplay
                                    userBadges={userBadges}
                                    maxDisplay={8}
                                    size="sm"
                                />
                            ) : (
                                <div className="text-center py-4 text-xs font-mono text-muted-foreground">
                                    KAYIT BULUNAMADI
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* Right Content: Observation Data */}
                    <motion.div variants={itemVariants} className="lg:col-span-8 space-y-6">

                        {/* Stats Row */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-background border border-black/10 dark:border-white/10 p-3 flex flex-col items-center justify-center hover:border-primary/50 transition-colors">
                                <span className="text-2xl font-mono font-bold">{followersCount}</span>
                                <span className="text-[10px] uppercase tracking-widest text-muted-foreground">TAKİPÇİ</span>
                            </div>
                            <div className="bg-background border border-black/10 dark:border-white/10 p-3 flex flex-col items-center justify-center hover:border-primary/50 transition-colors">
                                <span className="text-2xl font-mono font-bold">{followingCount}</span>
                                <span className="text-[10px] uppercase tracking-widest text-muted-foreground">TAKİP</span>
                            </div>
                            <div className="bg-background border border-black/10 dark:border-white/10 p-3 flex flex-col items-center justify-center hover:border-primary/50 transition-colors">
                                <span className="text-2xl font-mono font-bold">{questions?.length || 0}</span>
                                <span className="text-[10px] uppercase tracking-widest text-muted-foreground">SORU</span>
                            </div>
                            <div className="bg-background border border-black/10 dark:border-white/10 p-3 flex flex-col items-center justify-center hover:border-primary/50 transition-colors">
                                <span className="text-2xl font-mono font-bold">{answersCount || 0}</span>
                                <span className="text-[10px] uppercase tracking-widest text-muted-foreground">CEVAP</span>
                            </div>
                        </div>

                        {/* Data Tabs */}
                        <Tabs defaultValue="questions" className="w-full">
                            <div className="border-b border-black/10 dark:border-white/10 mb-6">
                                <TabsList className="bg-transparent h-auto p-0 gap-6">
                                    <TabsTrigger
                                        value="questions"
                                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-3 font-bold uppercase tracking-wide text-muted-foreground data-[state=active]:text-foreground transition-all"
                                    >
                                        <div className="flex items-center gap-2">
                                            <Microscope className="h-4 w-4" />
                                            <span>SORU ANALİZLERİ</span>
                                        </div>
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="answers"
                                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-3 font-bold uppercase tracking-wide text-muted-foreground data-[state=active]:text-foreground transition-all"
                                    >
                                        <div className="flex items-center gap-2">
                                            <Activity className="h-4 w-4" />
                                            <span>CEVAP VERİLERİ</span>
                                        </div>
                                    </TabsTrigger>
                                </TabsList>
                            </div>

                            <div className="min-h-[400px]">
                                <TabsContent value="questions" className="space-y-4 mt-0">
                                    <AnimatePresence mode="popLayout">
                                        {questions?.length === 0 ? (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="text-center py-20 border border-dashed border-black/10 dark:border-white/10 bg-muted/5"
                                            >
                                                <div className="bg-muted/20 p-4 rounded-full inline-block mb-4">
                                                    <Scan className="h-8 w-8 text-muted-foreground" />
                                                </div>
                                                <h3 className="text-lg font-bold uppercase mb-2">VERİ TESPİT EDİLEMEDİ</h3>
                                                <p className="text-muted-foreground font-mono text-xs max-w-sm mx-auto">
                                                    Bu deneğin soru veritabanında henüz bir kaydı bulunmuyor.
                                                </p>
                                            </motion.div>
                                        ) : (
                                            questions?.map((question, index) => (
                                                <motion.div
                                                    key={question.id}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: index * 0.05 }}
                                                >
                                                    <QuestionCard question={question} />
                                                </motion.div>
                                            ))
                                        )}
                                    </AnimatePresence>
                                </TabsContent>

                                <TabsContent value="answers" className="space-y-4 mt-0">
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="text-center py-20 border border-dashed border-black/10 dark:border-white/10 bg-muted/5"
                                    >
                                        <div className="bg-muted/20 p-4 rounded-full inline-block mb-4">
                                            <Activity className="h-8 w-8 text-muted-foreground" />
                                        </div>
                                        <h3 className="text-lg font-bold uppercase mb-2">VERİLER İŞLENİYOR</h3>
                                        <p className="text-muted-foreground font-mono text-xs max-w-sm mx-auto">
                                            Cevap analiz modülü şu anda bakımda. Veriler yakında sisteme düşecek.
                                        </p>
                                    </motion.div>
                                </TabsContent>
                            </div>
                        </Tabs>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}
