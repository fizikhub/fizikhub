import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { User, MessageSquare, FileText, LogOut, Shield, BadgeCheck, Globe, Twitter, Github, Instagram, Linkedin } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { EditUsernameButton } from "@/components/profile/edit-username-button";
import { EditProfileButton } from "@/components/profile/edit-profile-button";
import { ModeToggle } from "@/components/mode-toggle";
import { NotificationsList } from "@/components/profile/notifications-list";
import { StartChatButton } from "@/components/messaging/start-chat-button";
import { ConversationList } from "@/components/messaging/conversation-list";
import { getConversations } from "@/app/mesajlar/actions";
import { QuestionCard } from "@/components/forum/question-card";
import { ProfileMessagesButton } from "@/components/profile/profile-messages-button";
import { FollowStats } from "@/components/profile/follow-stats";
import { getFollowStats } from "@/app/profil/actions";
import { AvatarUpload } from "@/components/profile/avatar-upload";
import { NotificationBell } from "@/components/notifications/notification-bell";

export default async function ProfilePage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Fetch profile
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    const isOwnProfile = true; // Since this page is /profil, it's always the own profile
    // If we had /profil/[id], we would compare user.id === params.id

    // Fetch user's questions
    const { data: questions } = await supabase
        .from('questions')
        .select('*')
        .eq('author_id', user.id)
        .order('created_at', { ascending: false });

    // Fetch user's answers with related question titles
    const { data: answers } = await supabase
        .from('answers')
        .select(`
            *,
            questions (
                id,
                title
            )
        `)
        .eq('author_id', user.id)
        .order('created_at', { ascending: false });

    // Fetch user's badges
    const { data: userBadges } = await supabase
        .from('user_badges')
        .select(`
            awarded_at,
            badges (
                name,
                description,
                icon
            )
        `)
        .eq('user_id', user.id)
        .order('awarded_at', { ascending: false });

    // Fetch conversations
    const conversations = await getConversations();

    // Fetch follow stats
    const { followersCount, followingCount } = await getFollowStats(user.id);

    return (
        <div className="container py-4 sm:py-6 md:py-8 px-3 sm:px-4 md:px-6 max-w-5xl mx-auto min-h-screen">
            {/* Profile Header */}
            <div className="relative mb-6 sm:mb-8 group">
                {/* Cover Image */}
                <div className="h-24 sm:h-32 md:h-48 rounded-t-2xl sm:rounded-t-3xl bg-gradient-to-r from-primary/20 via-primary/10 to-background border-x border-t border-primary/10 overflow-hidden relative">
                    <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] " />
                </div>

                <div className="px-4 sm:px-6 md:px-10 pb-4 sm:pb-6 -mt-10 sm:-mt-12 md:-mt-16 relative z-10">
                    <div className="flex flex-col md:flex-row items-start md:items-end gap-4 sm:gap-6">
                        <AvatarUpload
                            currentAvatarUrl={profile?.avatar_url}
                            userInitial={profile?.full_name?.charAt(0) || user.email?.charAt(0).toUpperCase() || "U"}
                        />

                        <div className="flex-1 pt-1 sm:pt-2 md:pb-2 space-y-1.5 sm:space-y-2">
                            <div className="flex flex-col md:flex-row md:items-center gap-1.5 sm:gap-2">
                                <div className="flex items-center gap-1.5 sm:gap-2">
                                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">{profile?.full_name || "İsimsiz Kullanıcı"}</h1>
                                    {profile?.is_verified && (
                                        <BadgeCheck className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500 fill-blue-500/10" />
                                    )}
                                </div>
                                {userBadges && userBadges.length > 0 && (
                                    <div className="flex gap-1 sm:gap-1.5 mt-0.5 md:mt-0">
                                        {userBadges.map((ub: any) => (
                                            <div
                                                key={ub.badges.name}
                                                title={`${ub.badges.name}: ${ub.badges.description}`}
                                                className="cursor-help"
                                            >
                                                <span className="text-base sm:text-lg">{ub.badges.icon}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <p className="text-sm sm:text-base text-muted-foreground font-medium">@{profile?.username || "kullanici"}</p>

                            {profile?.bio && (
                                <p className="text-sm text-muted-foreground/80 max-w-md line-clamp-2 hover:line-clamp-none transition-all">
                                    {profile.bio}
                                </p>
                            )}

                            {/* Social Links */}
                            <div className="flex flex-wrap gap-3 mt-3">
                                {profile?.website && (
                                    <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                                        <Globe className="h-5 w-5" />
                                    </a>
                                )}
                                {profile?.social_links?.twitter && (
                                    <a href={`https://twitter.com/${profile.social_links.twitter.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                                        <Twitter className="h-5 w-5" />
                                    </a>
                                )}
                                {profile?.social_links?.github && (
                                    <a href={`https://github.com/${profile.social_links.github}`} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                                        <Github className="h-5 w-5" />
                                    </a>
                                )}
                                {profile?.social_links?.instagram && (
                                    <a href={`https://instagram.com/${profile.social_links.instagram}`} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                                        <Instagram className="h-5 w-5" />
                                    </a>
                                )}
                                {profile?.social_links?.linkedin && (
                                    <a href={`https://linkedin.com/in/${profile.social_links.linkedin}`} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                                        <Linkedin className="h-5 w-5" />
                                    </a>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 sm:gap-3 w-full md:w-auto mt-3 sm:mt-4 md:mt-0">
                            <div className="flex gap-2">
                                <ProfileMessagesButton />
                                <EditProfileButton
                                    currentFullName={profile?.full_name || null}
                                    currentBio={profile?.bio || null}
                                    currentAvatarUrl={profile?.avatar_url || null}
                                    currentWebsite={profile?.website || null}
                                    currentSocialLinks={profile?.social_links || null}
                                />
                                <NotificationBell />
                                <div className="md:hidden">
                                    <ModeToggle />
                                </div>
                            </div>

                            <div className="flex items-center gap-3 sm:gap-4 bg-card/50 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-border/50 shadow-sm">
                                <FollowStats followers={followersCount} following={followingCount} />
                            </div>

                            {/* Desktop Actions */}
                            <div className="hidden md:flex gap-2 justify-end">
                                {user.email?.toLowerCase() === 'barannnbozkurttb.b@gmail.com' && (
                                    <EditUsernameButton currentUsername={profile?.username || ""} />
                                )}
                                <ModeToggle />
                                <SignOutButton />
                            </div>

                            {/* Mobile Actions */}
                            <div className="md:hidden grid grid-cols-2 gap-2 mt-2">
                                {user.email?.toLowerCase() === 'barannnbozkurttb.b@gmail.com' && (
                                    <Link href="/admin" className="col-span-2">
                                        <Button variant="outline" className="w-full border-red-500/20 text-red-500 hover:bg-red-500/10 hover:text-red-600">
                                            <Shield className="mr-2 h-4 w-4" />
                                            Admin Paneli
                                        </Button>
                                    </Link>
                                )}
                                <div className="col-span-2">
                                    <SignOutButton />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Tabs */}
                <Tabs defaultValue="questions" className="w-full">
                    <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8 overflow-x-auto flex-nowrap">
                        <TabsTrigger
                            value="questions"
                            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 sm:px-3 md:px-4 py-2 sm:py-3 font-medium text-xs sm:text-sm md:text-base text-muted-foreground data-[state=active]:text-foreground transition-none whitespace-nowrap"
                        >
                            Sorular
                        </TabsTrigger>
                        <TabsTrigger
                            value="answers"
                            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 sm:px-3 md:px-4 py-2 sm:py-3 font-medium text-xs sm:text-sm md:text-base text-muted-foreground data-[state=active]:text-foreground transition-none whitespace-nowrap"
                        >
                            Cevaplar
                        </TabsTrigger>
                        <TabsTrigger
                            value="notifications"
                            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 sm:px-3 md:px-4 py-2 sm:py-3 font-medium text-xs sm:text-sm md:text-base text-muted-foreground data-[state=active]:text-foreground transition-none whitespace-nowrap"
                        >
                            Bildirimler
                        </TabsTrigger>
                        <TabsTrigger
                            value="messages"
                            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 sm:px-3 md:px-4 py-2 sm:py-3 font-medium text-xs sm:text-sm md:text-base text-muted-foreground data-[state=active]:text-foreground transition-none whitespace-nowrap"
                        >
                            Mesajlar
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="messages" className="space-y-4 animate-in fade-in-50 duration-300">
                        <div className="bg-card/50 backdrop-blur-sm rounded-xl border shadow-sm overflow-hidden">
                            <ConversationList conversations={conversations} />
                        </div>
                    </TabsContent>

                    <TabsContent value="notifications" className="space-y-4 animate-in fade-in-50 duration-300">
                        <Card className="bg-card/50 backdrop-blur-sm border-0 shadow-sm">
                            <CardContent className="p-0">
                                <NotificationsList userId={user.id} />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="questions" className="space-y-3 sm:space-y-4 animate-in fade-in-50 duration-300">
                        {!questions || questions.length === 0 ? (
                            <div className="text-center py-10 sm:py-12 border rounded-xl bg-muted/10 border-dashed">
                                <MessageSquare className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4 text-muted-foreground/20" />
                                <p className="text-sm sm:text-base text-muted-foreground">Henüz hiç soru sormadın.</p>
                                <Link href="/forum">
                                    <Button variant="link" size="sm" className="mt-2">Foruma Git</Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="grid gap-3 sm:gap-4">
                                {questions.map((question) => (
                                    <div key={question.id} className="relative group">
                                        <QuestionCard
                                            question={{
                                                ...question,
                                                profiles: {
                                                    username: profile?.username || "Ben",
                                                    full_name: profile?.full_name
                                                },
                                                answers: [] // This is simplified - full answer details not needed for profile view
                                            }}
                                            hasVoted={false} // Own questions
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="answers" className="space-y-3 sm:space-y-4 animate-in fade-in-50 duration-300">
                        {!answers || answers.length === 0 ? (
                            <div className="text-center py-10 sm:py-12 border rounded-xl bg-muted/10 border-dashed">
                                <FileText className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4 text-muted-foreground/20" />
                                <p className="text-sm sm:text-base text-muted-foreground">Henüz hiç cevap vermedin.</p>
                            </div>
                        ) : (
                            <div className="grid gap-3 sm:gap-4">
                                {answers.map((answer) => (
                                    <Link key={answer.id} href={`/forum/${answer.question_id}`}>
                                        <Card className="hover:border-primary/50 transition-colors cursor-pointer bg-card/50 backdrop-blur-sm">
                                            <CardHeader className="pb-2">
                                                <CardTitle className="text-base font-medium line-clamp-1 group-hover:text-primary transition-colors">
                                                    {answer.questions?.title || "Silinmiş Soru"}
                                                </CardTitle>
                                                <p className="text-xs text-muted-foreground">
                                                    {formatDistanceToNow(new Date(answer.created_at), { addSuffix: true, locale: tr })}
                                                </p>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-sm text-muted-foreground line-clamp-2">
                                                    {answer.content}
                                                </p>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
