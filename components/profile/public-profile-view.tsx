"use client";

import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, FileText, BadgeCheck, Globe, Twitter, Github, Linkedin, Instagram } from "lucide-react";
import { StartChatButton } from "@/components/messaging/start-chat-button";
import { QuestionCard } from "@/components/forum/question-card";
import { FollowButton } from "@/components/profile/follow-button";
import { FollowStats } from "@/components/profile/follow-stats";
import { EditProfileButton } from "@/components/profile/edit-profile-button";

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

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
            }
        }
    };

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Modern Cover Section */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                className={`h-48 md:h-64 w-full bg-gradient-to-r ${coverGradient} relative`}
            >
                <div className="absolute inset-0 bg-black/10" />
            </motion.div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="container px-4 md:px-6 mx-auto max-w-5xl"
            >
                <div className="relative -mt-20 mb-6 flex flex-col items-center md:flex-row md:items-end gap-6">
                    {/* Profile Avatar */}
                    <motion.div variants={itemVariants} className="relative z-10">
                        <div className="h-32 w-32 md:h-40 md:w-40 rounded-full p-1.5 bg-background shadow-xl">
                            <Avatar className="h-full w-full border-2 border-muted">
                                <AvatarImage src={profile.avatar_url || ""} className="object-cover" />
                                <AvatarFallback className="text-4xl bg-muted">
                                    {profile.full_name?.charAt(0) || profile.username?.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                        </div>
                        {profile.is_verified && (
                            <div className="absolute bottom-2 right-2 bg-background rounded-full p-1 shadow-sm" title="Doğrulanmış Hesap">
                                <BadgeCheck className="h-6 w-6 text-blue-500 fill-blue-500/10" />
                            </div>
                        )}
                    </motion.div>

                    {/* Profile Actions (Desktop) */}
                    <motion.div variants={itemVariants} className="hidden md:flex gap-3 mb-4 ml-auto">
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
                                <>
                                    <StartChatButton otherUserId={profile.id} />
                                    <FollowButton targetUserId={profile.id} initialIsFollowing={isFollowing} />
                                </>
                            )
                        )}
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                    {/* Left Sidebar: Info */}
                    <motion.div variants={itemVariants} className="md:col-span-4 space-y-6 text-center md:text-left">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">{profile.full_name || "İsimsiz Kullanıcı"}</h1>
                            <p className="text-muted-foreground font-medium">@{profile.username}</p>
                        </div>

                        {profile.bio && (
                            <p className="text-base leading-relaxed text-foreground/90">
                                {profile.bio}
                            </p>
                        )}

                        {/* Mobile Actions */}
                        <div className="flex md:hidden flex-col gap-3">
                            {isOwnProfile ? (
                                <EditProfileButton
                                    currentFullName={profile.full_name}
                                    currentBio={profile.bio}
                                    currentAvatarUrl={profile.avatar_url}
                                    currentWebsite={profile.website}
                                    currentSocialLinks={profile.social_links}
                                    currentUsername={profile.username}
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

                        <div className="flex flex-col gap-2 text-sm text-muted-foreground items-center md:items-start">
                            {profile.website && (
                                <a href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-primary transition-colors">
                                    <Globe className="h-4 w-4" />
                                    <span className="truncate">{profile.website.replace(/^https?:\/\//, '')}</span>
                                </a>
                            )}
                            {/* Social Links Row */}
                            <div className="flex gap-3 mt-2 justify-center md:justify-start">
                                {profile.social_links?.twitter && (
                                    <a href={`https://twitter.com/${profile.social_links.twitter}`} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-muted/50 hover:bg-blue-500/10 hover:text-blue-500 transition-colors">
                                        <Twitter className="h-5 w-5" />
                                    </a>
                                )}
                                {profile.social_links?.github && (
                                    <a href={`https://github.com/${profile.social_links.github}`} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-muted/50 hover:bg-foreground/10 hover:text-foreground transition-colors">
                                        <Github className="h-5 w-5" />
                                    </a>
                                )}
                                {profile.social_links?.linkedin && (
                                    <a href={`https://linkedin.com/in/${profile.social_links.linkedin}`} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-muted/50 hover:bg-blue-600/10 hover:text-blue-600 transition-colors">
                                        <Linkedin className="h-5 w-5" />
                                    </a>
                                )}
                                {profile.social_links?.instagram && (
                                    <a href={`https://instagram.com/${profile.social_links.instagram}`} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-muted/50 hover:bg-pink-600/10 hover:text-pink-600 transition-colors">
                                        <Instagram className="h-5 w-5" />
                                    </a>
                                )}
                            </div>
                        </div>

                        <div className="pt-6 border-t">
                            <div className="mt-4 flex justify-center md:justify-start">
                                <FollowStats followers={followersCount} following={followingCount} />
                            </div>
                        </div>

                        {userBadges && userBadges.length > 0 && (
                            <div className="pt-6 border-t">
                                <h3 className="font-semibold mb-3 text-sm uppercase tracking-wider text-muted-foreground">Rozetler</h3>
                                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                                    {userBadges.map((ub: any) => (
                                        <motion.div
                                            key={ub.badges.name}
                                            whileHover={{ scale: 1.05 }}
                                            title={`${ub.badges.name}: ${ub.badges.description}`}
                                            className="p-2 bg-primary/5 rounded-xl border border-primary/10 cursor-help"
                                        >
                                            <div className="text-2xl">{ub.badges.icon}</div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </motion.div>

                    {/* Right Content: Tabs */}
                    <motion.div variants={itemVariants} className="md:col-span-8">
                        <Tabs defaultValue="questions" className="w-full">
                            <TabsList className="w-full justify-start bg-transparent border-b rounded-none h-auto p-0 mb-6">
                                <TabsTrigger
                                    value="questions"
                                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3 font-medium text-muted-foreground data-[state=active]:text-foreground transition-all"
                                >
                                    Sorular ({questions?.length || 0})
                                </TabsTrigger>
                                <TabsTrigger
                                    value="answers"
                                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3 font-medium text-muted-foreground data-[state=active]:text-foreground transition-all"
                                >
                                    Cevaplar ({answersCount || 0})
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="questions" className="space-y-4">
                                {questions?.length === 0 ? (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-center py-16 border-2 border-dashed rounded-2xl bg-muted/30"
                                    >
                                        <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground/30" />
                                        <h3 className="text-lg font-medium mb-1">Henüz soru yok</h3>
                                        <p className="text-muted-foreground">Bu kullanıcı henüz hiç soru sormamış.</p>
                                    </motion.div>
                                ) : (
                                    questions?.map((question, index) => (
                                        <motion.div
                                            key={question.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                        >
                                            <QuestionCard question={question} />
                                        </motion.div>
                                    ))
                                )}
                            </TabsContent>

                            <TabsContent value="answers" className="space-y-4">
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-center py-16 border-2 border-dashed rounded-2xl bg-muted/30"
                                >
                                    <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground/30" />
                                    <h3 className="text-lg font-medium mb-1">Cevaplar yakında</h3>
                                    <p className="text-muted-foreground">Cevap listeleme özelliği çok yakında eklenecek.</p>
                                </motion.div>
                            </TabsContent>
                        </Tabs>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}
