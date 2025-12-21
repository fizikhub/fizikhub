"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { SpaceBackground } from "@/components/home/space-background";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Twitter, Github, Linkedin, Instagram, Calendar, Link as LinkIcon, Microscope, Activity, Scan, Bell, Bookmark } from "lucide-react";
import { StartChatButton } from "@/components/messaging/start-chat-button";
import { FollowButton } from "@/components/profile/follow-button";
import { EditProfileButton } from "@/components/profile/edit-profile-button";
import { BadgeDisplay } from "@/components/badge-display";
import { ReputationDisplay } from "@/components/reputation-display";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { QuestionCard } from "@/components/forum/question-card";

interface PublicProfileViewProps {
    profile: any;
    isOwnProfile: boolean;
    isFollowing: boolean;
    followersCount: number;
    followingCount: number;
    userBadges: any[];
    articles: any[];
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
    articles,
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
            <div className="relative h-40 md:h-56 w-full overflow-hidden border-b border-border/50">
                {profile.cover_url ? (
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${profile.cover_url})` }}
                    />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-muted to-muted-foreground/10" />
                )}
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
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
                        <div className="bg-card border border-border/50 p-6 rounded-2xl">
                            <div className="flex flex-col items-center text-center">
                                {/* Avatar */}
                                <div className="relative mb-6">
                                    <div className="h-28 w-28 rounded-full relative">
                                        <Avatar className="h-full w-full border-2 border-foreground/10">
                                            <AvatarImage src={profile.avatar_url || ""} className="object-cover" />
                                            <AvatarFallback className="text-3xl bg-muted text-foreground font-medium">
                                                {profile.full_name?.charAt(0) || profile.username?.charAt(0).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                    </div>
                                </div>

                                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                                    {profile.full_name || "Anonim Kullanıcı"}
                                </h1>
                                <div className="flex items-center gap-2 mt-2 mb-5">
                                    <span className="text-sm text-muted-foreground">
                                        @{profile.username}
                                    </span>
                                    <ReputationDisplay reputation={profile.reputation || 0} size="sm" showLabel={true} />
                                </div>

                                {profile.bio && (
                                    <p className="w-full text-sm text-muted-foreground leading-relaxed text-left mb-5">
                                        {profile.bio}
                                    </p>
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
                                <div className="w-full mt-5 space-y-2 text-xs text-muted-foreground text-left pt-5 border-t border-border/50">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-3 w-3" />
                                        <span>{format(new Date(profile.created_at || new Date()), 'MMMM yyyy', { locale: tr })} tarihinden beri üye</span>
                                    </div>
                                    {profile.website && (
                                        <div className="flex items-center gap-2">
                                            <LinkIcon className="h-3 w-3" />
                                            <a href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`} target="_blank" rel="noopener noreferrer" className="hover:text-foreground truncate max-w-[200px] transition-colors">
                                                {profile.website.replace(/^https?:\/\//, '')}
                                            </a>
                                        </div>
                                    )}
                                </div>

                                {/* Social Links */}
                                <div className="flex gap-3 mt-4 justify-center">
                                    {profile.social_links?.twitter && (
                                        <a href={`https://twitter.com/${profile.social_links.twitter}`} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                                            <Twitter className="h-4 w-4" />
                                        </a>
                                    )}
                                    {profile.social_links?.github && (
                                        <a href={`https://github.com/${profile.social_links.github}`} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                                            <Github className="h-4 w-4" />
                                        </a>
                                    )}
                                    {profile.social_links?.linkedin && (
                                        <a href={`https://linkedin.com/in/${profile.social_links.linkedin}`} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                                            <Linkedin className="h-4 w-4" />
                                        </a>
                                    )}
                                    {profile.social_links?.instagram && (
                                        <a href={`https://instagram.com/${profile.social_links.instagram}`} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                                            <Instagram className="h-4 w-4" />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Badges Module */}
                        {userBadges && userBadges.length > 0 && (
                            <div className="bg-card border border-border/50 p-4 rounded-2xl">
                                <h3 className="text-xs font-semibold text-muted-foreground mb-3">Rozetler</h3>
                                <BadgeDisplay
                                    userBadges={userBadges}
                                    maxDisplay={8}
                                    size="sm"
                                />
                            </div>
                        )}
                    </motion.div>

                    {/* Right Content: Observation Data */}
                    <motion.div variants={itemVariants} className="lg:col-span-8 space-y-6">

                        {/* Stats Row */}
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                            {[
                                { label: "Makale", value: articles?.length || 0 },
                                { label: "Takipçi", value: followersCount },
                                { label: "Takip", value: followingCount },
                                { label: "Soru", value: questions?.length || 0 },
                                { label: "Cevap", value: answersCount || 0 }
                            ].map((stat, i) => (
                                <div key={i} className="bg-card border border-border/50 p-4 flex flex-col items-center justify-center rounded-xl">
                                    <span className="text-2xl font-bold text-foreground">{stat.value}</span>
                                    <span className="text-xs text-muted-foreground">{stat.label}</span>
                                </div>
                            ))}
                        </div>

                        {/* Content Tabs */}
                        <Tabs defaultValue="questions" className="w-full">
                            <div className="mb-5">
                                <TabsList className="bg-card border border-border/50 p-1 gap-1 h-auto rounded-xl">
                                    <TabsTrigger
                                        value="questions"
                                        className="rounded-lg data-[state=active]:bg-foreground data-[state=active]:text-background text-muted-foreground font-medium transition-all px-4 py-2"
                                    >
                                        <div className="flex items-center gap-2">
                                            <Microscope className="h-4 w-4" />
                                            <span>Sorular</span>
                                        </div>
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="answers"
                                        className="rounded-lg data-[state=active]:bg-foreground data-[state=active]:text-background text-muted-foreground font-medium transition-all px-4 py-2"
                                    >
                                        <div className="flex items-center gap-2">
                                            <Activity className="h-4 w-4" />
                                            <span>Cevaplar</span>
                                        </div>
                                    </TabsTrigger>
                                </TabsList>
                            </div>

                            <div className="min-h-[300px]">
                                <TabsContent value="questions" className="space-y-3 mt-0">
                                    <AnimatePresence mode="popLayout">
                                        {questions?.length === 0 ? (
                                            <div className="text-center py-16 border border-dashed border-border/50 rounded-xl">
                                                <Microscope className="h-10 w-10 mx-auto mb-3 text-muted-foreground/30" />
                                                <h3 className="text-base font-medium mb-1 text-muted-foreground">Henüz soru yok</h3>
                                                <p className="text-sm text-muted-foreground/60">
                                                    Bu kullanıcı henüz soru sormamış.
                                                </p>
                                            </div>
                                        ) : (
                                            questions?.map((question, index) => (
                                                <motion.div
                                                    key={question.id}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: index * 0.03 }}
                                                >
                                                    <Link href={`/forum/${question.id}`} className="block group">
                                                        <div className="bg-card border border-border/50 p-4 rounded-xl hover:border-foreground/20 transition-all">
                                                            <h3 className="font-semibold text-foreground group-hover:text-foreground/80 transition-colors mb-2 line-clamp-2">
                                                                {question.title}
                                                            </h3>
                                                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                                                <span>{format(new Date(question.created_at), 'dd MMM yyyy', { locale: tr })}</span>
                                                                <span>•</span>
                                                                <span>{question.answers?.length || 0} cevap</span>
                                                            </div>
                                                        </div>
                                                    </Link>
                                                </motion.div>
                                            ))
                                        )}
                                    </AnimatePresence>
                                </TabsContent>

                                <TabsContent value="answers" className="space-y-3 mt-0">
                                    <div className="text-center py-16 border border-dashed border-border/50 rounded-xl">
                                        <Activity className="h-10 w-10 mx-auto mb-3 text-muted-foreground/30" />
                                        <h3 className="text-base font-medium mb-1 text-muted-foreground">Yakında</h3>
                                        <p className="text-sm text-muted-foreground/60">
                                            Cevap geçmişi yakında burada olacak.
                                        </p>
                                    </div>
                                </TabsContent>
                            </div>
                        </Tabs>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}
