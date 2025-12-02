"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, FileText, BadgeCheck, Globe, Twitter, Github, Linkedin, Instagram, MapPin, Calendar, Link as LinkIcon } from "lucide-react";
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
    // Generate a consistent gradient based on username length (simple hash)
    const gradients = [
        "from-blue-600 via-indigo-500 to-purple-600",
        "from-emerald-500 via-teal-500 to-cyan-500",
        "from-orange-500 via-amber-500 to-yellow-500",
        "from-pink-500 via-rose-500 to-red-500",
        "from-violet-600 via-purple-500 to-fuchsia-500"
    ];
    const gradientIndex = (profile.username.length + (profile.full_name?.length || 0)) % gradients.length;
    const coverGradient = gradients[gradientIndex];

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
        <div className="min-h-screen bg-background pb-20 overflow-x-hidden">
            {/* Modern Cover Section with Parallax-like feel */}
            <div className="relative h-64 md:h-80 w-full overflow-hidden group">
                {profile.cover_url ? (
                    <motion.div
                        initial={{ scale: 1.1 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${profile.cover_url})` }}
                    />
                ) : (
                    <motion.div
                        initial={{ scale: 1.1 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className={`absolute inset-0 bg-gradient-to-br ${coverGradient}`}
                    >
                        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-20" />
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                    </motion.div>
                )}
                <div className="absolute inset-0 bg-black/10" />
            </div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="container px-4 md:px-6 mx-auto max-w-6xl relative z-10 -mt-32"
            >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Sidebar: Profile Card */}
                    <motion.div variants={itemVariants} className="lg:col-span-4">
                        <Card className="border-none shadow-2xl bg-card/80 backdrop-blur-xl overflow-visible sticky top-24">
                            <CardContent className="p-6 flex flex-col items-center text-center pt-16 relative">
                                {/* Avatar */}
                                <div className="absolute -top-16 left-1/2 -translate-x-1/2 z-20">
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        className="relative"
                                    >
                                        <div className="h-32 w-32 rounded-full p-1.5 bg-background shadow-2xl ring-4 ring-background/50 overflow-hidden">
                                            <Avatar className="h-full w-full border-2 border-muted">
                                                <AvatarImage src={profile.avatar_url || ""} className="object-cover" />
                                                <AvatarFallback className="text-4xl bg-muted font-bold text-muted-foreground">
                                                    {profile.full_name?.charAt(0) || profile.username?.charAt(0).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                        </div>
                                        {profile.is_verified && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="absolute bottom-1 right-1 bg-background rounded-full p-1.5 shadow-lg text-blue-500"
                                            >
                                                <BadgeCheck className="h-6 w-6 fill-blue-500/10" />
                                            </motion.div>
                                        )}
                                    </motion.div>
                                </div>

                                {/* Name & Bio */}
                                <div className="mt-4 space-y-2 w-full">
                                    <h1 className="text-2xl font-bold tracking-tight">{profile.full_name || "İsimsiz Kullanıcı"}</h1>
                                    <p className="text-muted-foreground font-medium flex items-center justify-center gap-1">
                                        @{profile.username}
                                    </p>

                                    <div className="flex justify-center py-2">
                                        <ReputationDisplay
                                            reputation={profile.reputation || 0}
                                            size="sm"
                                            className="bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-950/50 dark:text-blue-400 dark:border-blue-800"
                                        />
                                    </div>

                                    {profile.bio && (
                                        <p className="text-sm text-foreground/80 leading-relaxed py-2 border-t border-border/50 mt-4">
                                            {profile.bio}
                                        </p>
                                    )}
                                </div>

                                {/* Stats */}
                                <div className="w-full py-4 border-y border-border/50 my-4">
                                    <FollowStats followers={followersCount} following={followingCount} />
                                </div>

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

                                {/* Social & Info */}
                                <div className="w-full mt-6 space-y-3 text-sm">
                                    {profile.website && (
                                        <a
                                            href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors p-2 rounded-lg hover:bg-muted/50"
                                        >
                                            <div className="p-1.5 bg-primary/10 rounded-md text-primary">
                                                <LinkIcon className="h-4 w-4" />
                                            </div>
                                            <span className="truncate">{profile.website.replace(/^https?:\/\//, '')}</span>
                                        </a>
                                    )}

                                    <div className="flex items-center gap-3 text-muted-foreground p-2">
                                        <div className="p-1.5 bg-primary/10 rounded-md text-primary">
                                            <Calendar className="h-4 w-4" />
                                        </div>
                                        <span>{format(new Date(profile.created_at || new Date()), 'MMMM yyyy', { locale: tr })} tarihinde katıldı</span>
                                    </div>

                                    {/* Social Icons */}
                                    <div className="flex justify-center gap-2 pt-2">
                                        {profile.social_links?.twitter && (
                                            <a href={`https://twitter.com/${profile.social_links.twitter}`} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-muted/50 hover:bg-[#1DA1F2]/10 hover:text-[#1DA1F2] transition-colors">
                                                <Twitter className="h-5 w-5" />
                                            </a>
                                        )}
                                        {profile.social_links?.github && (
                                            <a href={`https://github.com/${profile.social_links.github}`} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-muted/50 hover:bg-foreground/10 hover:text-foreground transition-colors">
                                                <Github className="h-5 w-5" />
                                            </a>
                                        )}
                                        {profile.social_links?.linkedin && (
                                            <a href={`https://linkedin.com/in/${profile.social_links.linkedin}`} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-muted/50 hover:bg-[#0077b5]/10 hover:text-[#0077b5] transition-colors">
                                                <Linkedin className="h-5 w-5" />
                                            </a>
                                        )}
                                        {profile.social_links?.instagram && (
                                            <a href={`https://instagram.com/${profile.social_links.instagram}`} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-muted/50 hover:bg-[#E1306C]/10 hover:text-[#E1306C] transition-colors">
                                                <Instagram className="h-5 w-5" />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Badges Section - Left Sidebar */}
                        <motion.div variants={itemVariants} className="mt-6">
                            <Card className="border-none shadow-lg bg-card/50 backdrop-blur-sm">
                                <CardContent className="p-6">
                                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                                        <BadgeCheck className="h-5 w-5 text-primary" />
                                        Rozetler
                                    </h3>
                                    {userBadges && userBadges.length > 0 ? (
                                        <BadgeDisplay
                                            userBadges={userBadges}
                                            maxDisplay={12}
                                            size="md"
                                        />
                                    ) : (
                                        <a href="/puanlar-nedir" className="block group">
                                            <div className="border-2 border-dashed border-muted rounded-xl p-4 text-center hover:bg-muted/50 transition-colors cursor-pointer">
                                                <div className="bg-muted/50 p-2 rounded-full inline-flex mb-2 group-hover:scale-110 transition-transform">
                                                    <BadgeCheck className="h-5 w-5 text-muted-foreground" />
                                                </div>
                                                <p className="text-sm font-medium text-muted-foreground">Henüz rozet kazanılmamış</p>
                                                <p className="text-xs text-primary mt-1 font-medium">Rozetler nedir?</p>
                                            </div>
                                        </a>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>
                    </motion.div>

                    {/* Right Content: Tabs & Activity */}
                    <motion.div variants={itemVariants} className="lg:col-span-8 space-y-6">
                        <Tabs defaultValue="questions" className="w-full">
                            <div className="sticky top-[72px] z-20 bg-background/80 backdrop-blur-xl rounded-2xl border border-white/10 shadow-lg mb-6 p-1">
                                <TabsList className="w-full justify-start bg-transparent h-auto p-0">
                                    <TabsTrigger
                                        value="questions"
                                        className="flex-1 rounded-xl data-[state=active]:bg-primary/10 data-[state=active]:text-primary px-4 py-3 font-medium text-muted-foreground transition-all"
                                    >
                                        <div className="flex items-center gap-2">
                                            <MessageSquare className="h-4 w-4" />
                                            <span>Sorular</span>
                                            <Badge variant="secondary" className="ml-1 bg-primary/10 text-primary border-0">
                                                {questions?.length || 0}
                                            </Badge>
                                        </div>
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="answers"
                                        className="flex-1 rounded-xl data-[state=active]:bg-primary/10 data-[state=active]:text-primary px-4 py-3 font-medium text-muted-foreground transition-all"
                                    >
                                        <div className="flex items-center gap-2">
                                            <FileText className="h-4 w-4" />
                                            <span>Cevaplar</span>
                                            <Badge variant="secondary" className="ml-1 bg-primary/10 text-primary border-0">
                                                {answersCount || 0}
                                            </Badge>
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
                                                className="text-center py-20 border-2 border-dashed rounded-3xl bg-muted/20"
                                            >
                                                <div className="bg-muted/50 p-4 rounded-full inline-block mb-4">
                                                    <MessageSquare className="h-8 w-8 text-muted-foreground" />
                                                </div>
                                                <h3 className="text-xl font-semibold mb-2">Henüz soru yok</h3>
                                                <p className="text-muted-foreground max-w-sm mx-auto">
                                                    Bu kullanıcı henüz topluluğa bir soru sormamış.
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
                                        className="text-center py-20 border-2 border-dashed rounded-3xl bg-muted/20"
                                    >
                                        <div className="bg-muted/50 p-4 rounded-full inline-block mb-4">
                                            <FileText className="h-8 w-8 text-muted-foreground" />
                                        </div>
                                        <h3 className="text-xl font-semibold mb-2">Cevaplar yakında</h3>
                                        <p className="text-muted-foreground max-w-sm mx-auto">
                                            Kullanıcının verdiği cevapları listeleme özelliği çok yakında eklenecek.
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
