"use client";

import { SpaceBackground } from "@/components/home/space-background";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Twitter, Github, Linkedin, Instagram, Calendar, Link as LinkIcon, Microscope, Activity } from "lucide-react";
import { StartChatButton } from "@/components/messaging/start-chat-button";
import { FollowButton } from "@/components/profile/follow-button";
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
            <SpaceBackground />

            {/* Cover Area */}
            <div className="relative h-48 md:h-64 w-full overflow-hidden border-b border-amber-500/20 bg-muted/10">
                {profile.cover_url ? (
                    <div
                        className="absolute inset-0 bg-cover bg-center opacity-80"
                        style={{ backgroundImage: `url(${profile.cover_url})` }}
                    />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-950 to-black" />
                )}
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
            </div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="container px-4 md:px-6 mx-auto max-w-7xl relative z-10 -mt-20"
            >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Sidebar: Profile Identity */}
                    <motion.div variants={itemVariants} className="lg:col-span-4 space-y-6">
                        {/* Identity Card */}
                        <div className="bg-black/60 backdrop-blur-md border border-amber-500/20 p-6 rounded-2xl relative shadow-[0_0_20px_rgba(251,191,36,0.1)]">
                            <div className="flex flex-col items-center text-center">
                                {/* Avatar Orbit */}
                                <div className="relative mb-6">
                                    <div className="absolute inset-0 border-2 border-dashed border-amber-500/30 rounded-full animate-[spin_10s_linear_infinite]" />
                                    <div className="h-32 w-32 rounded-full p-2 relative z-10">
                                        <Avatar className="h-full w-full border-2 border-amber-500/50">
                                            <AvatarImage src={profile.avatar_url || ""} className="object-cover" />
                                            <AvatarFallback className="text-4xl bg-amber-950 text-amber-500 font-mono">
                                                {profile.full_name?.charAt(0) || profile.username?.charAt(0).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                    </div>
                                </div>

                                <h1 className="text-3xl font-black tracking-tight uppercase text-white drop-shadow-[0_0_5px_rgba(251,191,36,0.3)]">
                                    {profile.full_name || "BİLİNMEYEN ÜYE"}
                                </h1>
                                <div className="flex items-center gap-2 mt-2 mb-6">
                                    <span className="font-mono text-sm text-amber-400 bg-amber-950/30 px-3 py-1 rounded-full border border-amber-500/30">
                                        @{profile.username}
                                    </span>
                                    <ReputationDisplay reputation={profile.reputation || 0} size="sm" showLabel={true} />
                                </div>

                                {profile.bio && (
                                    <div className="w-full bg-amber-950/10 border-l-2 border-amber-500/50 p-4 text-left mb-6 rounded-r-lg">
                                        <p className="text-sm text-amber-100/80 leading-relaxed font-sans font-medium">
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
                                <div className="w-full mt-6 space-y-2 text-xs font-mono text-amber-200/50 text-left pt-6 border-t border-amber-500/10">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-3 w-3 text-amber-500" />
                                        <span>KAYIT: {format(new Date(profile.created_at || new Date()), 'dd.MM.yyyy', { locale: tr })}</span>
                                    </div>
                                    {profile.website && (
                                        <div className="flex items-center gap-2">
                                            <LinkIcon className="h-3 w-3 text-amber-500" />
                                            <a href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`} target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 truncate max-w-[200px] transition-colors">
                                                {profile.website.replace(/^https?:\/\//, '')}
                                            </a>
                                        </div>
                                    )}
                                </div>

                                {/* Social Links */}
                                <div className="flex gap-4 mt-4 justify-center">
                                    {profile.social_links?.twitter && (
                                        <a href={`https://twitter.com/${profile.social_links.twitter}`} target="_blank" rel="noopener noreferrer" className="text-amber-500/50 hover:text-amber-400 transition-colors">
                                            <Twitter className="h-4 w-4" />
                                        </a>
                                    )}
                                    {profile.social_links?.github && (
                                        <a href={`https://github.com/${profile.social_links.github}`} target="_blank" rel="noopener noreferrer" className="text-amber-500/50 hover:text-amber-400 transition-colors">
                                            <Github className="h-4 w-4" />
                                        </a>
                                    )}
                                    {profile.social_links?.linkedin && (
                                        <a href={`https://linkedin.com/in/${profile.social_links.linkedin}`} target="_blank" rel="noopener noreferrer" className="text-amber-500/50 hover:text-amber-400 transition-colors">
                                            <Linkedin className="h-4 w-4" />
                                        </a>
                                    )}
                                    {profile.social_links?.instagram && (
                                        <a href={`https://instagram.com/${profile.social_links.instagram}`} target="_blank" rel="noopener noreferrer" className="text-amber-500/50 hover:text-amber-400 transition-colors">
                                            <Instagram className="h-4 w-4" />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Badges Module */}
                        <div className="bg-black/60 backdrop-blur-md border border-amber-500/20 p-4 rounded-2xl relative">
                            <div className="absolute -top-3 left-4 bg-black px-2 text-xs font-bold uppercase tracking-wider text-amber-500 border border-amber-500/30 rounded-full">
                                BAŞARI KAYITLARI
                            </div>
                            {userBadges && userBadges.length > 0 ? (
                                <BadgeDisplay
                                    userBadges={userBadges}
                                    maxDisplay={8}
                                    size="sm"
                                />
                            ) : (
                                <div className="text-center py-4 text-xs font-mono text-amber-200/30">
                                    KAYIT BULUNAMADI
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* Right Content: Observation Data */}
                    <motion.div variants={itemVariants} className="lg:col-span-8 space-y-6">

                        {/* Stats Row */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { label: "TAKİPÇİ", value: followersCount },
                                { label: "TAKİP", value: followingCount },
                                { label: "SORU", value: questions?.length || 0 },
                                { label: "CEVAP", value: answersCount || 0 }
                            ].map((stat, i) => (
                                <div key={i} className="bg-black/60 backdrop-blur-md border border-amber-500/20 p-4 flex flex-col items-center justify-center hover:border-amber-500/50 transition-colors rounded-xl group relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                                    </div>
                                    <span className="text-2xl font-mono font-bold text-white group-hover:text-amber-400 transition-colors">{stat.value}</span>
                                    <span className="text-[10px] uppercase tracking-widest text-amber-500/70">{stat.label}</span>
                                </div>
                            ))}
                        </div>

                        {/* Data Tabs */}
                        <Tabs defaultValue="questions" className="w-full">
                            <div className="mb-6">
                                <TabsList className="bg-black/40 backdrop-blur-md border border-amber-500/20 p-1 gap-2 h-auto rounded-xl">
                                    <TabsTrigger
                                        value="questions"
                                        className="rounded-lg data-[state=active]:bg-amber-500 data-[state=active]:text-black text-amber-100/60 font-bold uppercase tracking-wide transition-all"
                                    >
                                        <div className="flex items-center gap-2">
                                            <Microscope className="h-4 w-4" />
                                            <span>SORULAR</span>
                                        </div>
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="answers"
                                        className="rounded-lg data-[state=active]:bg-amber-500 data-[state=active]:text-black text-amber-100/60 font-bold uppercase tracking-wide transition-all"
                                    >
                                        <div className="flex items-center gap-2">
                                            <Activity className="h-4 w-4" />
                                            <span>CEVAPLAR</span>
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
                                                className="text-center py-20 border border-dashed border-amber-500/20 bg-amber-950/5 rounded-xl"
                                            >
                                                <h3 className="text-lg font-bold uppercase mb-2 text-amber-500/50">VERİ TESPİT EDİLEMEDİ</h3>
                                                <p className="text-amber-200/30 font-mono text-xs">
                                                    Bu kullanıcının henüz bir sorusu bulunmuyor.
                                                </p>
                                            </motion.div>
                                        ) : (
                                            questions?.map((question, index) => (
                                                <motion.div
                                                    key={question.id}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: index * 0.05 }}
                                                >
                                                    <Link href={`/forum/${question.id}`} className="block group">
                                                        <div className="bg-black/60 backdrop-blur-md border border-amber-500/20 p-5 rounded-xl hover:border-amber-500/60 transition-all relative overflow-hidden">
                                                            <div className="absolute left-0 top-0 w-1 h-full bg-amber-500/0 group-hover:bg-amber-500 transition-colors" />
                                                            <h3 className="font-bold text-lg text-amber-100 group-hover:text-amber-400 transition-colors mb-2">
                                                                {question.title}
                                                            </h3>
                                                            <div className="flex items-center gap-4 text-xs font-mono text-amber-200/40">
                                                                <span>{format(new Date(question.created_at), 'dd.MM.yyyy', { locale: tr })}</span>
                                                                <span>•</span>
                                                                <span>{question.answers?.length || 0} CEVAP</span>
                                                            </div>
                                                        </div>
                                                    </Link>
                                                </motion.div>
                                            ))
                                        )}
                                    </AnimatePresence>
                                </TabsContent>

                                <TabsContent value="answers" className="space-y-4 mt-0">
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="text-center py-20 border border-dashed border-amber-500/20 bg-amber-950/5 rounded-xl"
                                    >
                                        <Activity className="h-8 w-8 text-amber-500/20 mx-auto mb-4" />
                                        <h3 className="text-lg font-bold uppercase mb-2 text-amber-500/50">VERİLER İŞLENİYOR</h3>
                                        <p className="text-amber-200/30 font-mono text-xs">
                                            Cevap geçmişi şu an görüntülenemiyor.
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
