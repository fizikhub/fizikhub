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
import { BadgeDisplay } from "@/components/badge-display";
import { ReputationDisplay } from "@/components/reputation-display";

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
                id,
                name,
                description,
                icon,
                category
            )
        `)
        .eq('user_id', user.id)
        .order('awarded_at', { ascending: false });

    // Fetch conversations
    const conversations = await getConversations();

    // Fetch follow stats
    const { followersCount, followingCount } = await getFollowStats(user.id);

    return (

        <div className="min-h-screen bg-background pb-20 md:pb-0">
            <div className="container max-w-2xl mx-auto px-0 border-x border-border min-h-screen">
                {/* Profile Header */}
                <div className="relative">
                    {/* Cover Image */}
                    <div className="h-32 sm:h-48 bg-gradient-to-r from-primary/20 via-primary/10 to-background overflow-hidden relative">
                        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
                    </div>

                    {/* Avatar & Action Bar Container */}
                    <div className="px-4 md:px-6 flex flex-col sm:flex-row items-start sm:items-end justify-between relative -mt-12 sm:-mt-16 mb-4 sm:mb-6 gap-4">
                        {/* Avatar */}
                        <div className="relative z-10">
                            <div className="rounded-full p-1 bg-background shadow-xl">
                                <AvatarUpload
                                    currentAvatarUrl={profile?.avatar_url}
                                    userInitial={profile?.full_name?.charAt(0) || user.email?.charAt(0).toUpperCase() || "U"}
                                    className="h-24 w-24 sm:h-32 sm:w-32 border-4 border-background"
                                />
                            </div>
                        </div>

                        {/* Action Bar */}
                        <div className="flex gap-2 w-full sm:w-auto justify-end">
                            <div className="md:hidden">
                                <ModeToggle />
                            </div>
                            {profile?.is_writer && (
                                <Link href="/yazar">
                                    <Button variant="outline" size="sm" className="gap-2 bg-purple-500/10 text-purple-600 hover:bg-purple-500/20 border-purple-200">
                                        <FileText className="h-4 w-4" />
                                        <span className="hidden sm:inline">Yazar Paneli</span>
                                        <span className="sm:hidden">Panel</span>
                                    </Button>
                                </Link>
                            )}
                            <ProfileMessagesButton />
                            <EditProfileButton
                                currentUsername={profile?.username || null}
                                currentFullName={profile?.full_name || null}
                                currentBio={profile?.bio || null}
                                currentAvatarUrl={profile?.avatar_url || null}
                                currentWebsite={profile?.website || null}
                                currentSocialLinks={profile?.social_links || null}
                                userEmail={user?.email || null}
                            />
                            <div className="md:hidden">
                                <SignOutButton
                                    variant="destructive"
                                    className="rounded-full bg-red-600 hover:bg-red-700 text-white shadow-sm"
                                    iconOnly
                                />
                            </div>
                            <div className="hidden md:block">
                                <NotificationBell />
                            </div>
                        </div>
                    </div>

                    {/* Profile Info */}
                    <div className="px-4 md:px-6 pb-6 space-y-5">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                                    {profile?.full_name || "İsimsiz Kullanıcı"}
                                </h1>
                                {profile?.is_verified && (
                                    <BadgeCheck className="h-6 w-6 text-blue-500 fill-blue-500/10" />
                                )}
                            </div>
                            <p className="text-base text-muted-foreground font-medium">@{profile?.username || "kullanici"}</p>
                        </div>

                        {profile?.bio && (
                            <p className="text-base leading-relaxed max-w-2xl text-foreground/90 whitespace-pre-wrap">
                                {profile.bio}
                            </p>
                        )}

                        {/* Stats Row */}
                        <div className="flex flex-wrap items-center gap-6 py-4 border-y border-border/50">
                            <div className="flex flex-col gap-0.5">
                                <span className="text-xl font-bold text-foreground">{followersCount.toLocaleString('tr-TR')}</span>
                                <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Takipçi</span>
                            </div>
                            <div className="flex flex-col gap-0.5">
                                <span className="text-xl font-bold text-foreground">{followingCount.toLocaleString('tr-TR')}</span>
                                <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Takip</span>
                            </div>
                            <div className="w-px h-8 bg-border/50 hidden sm:block" />
                            <div className="flex flex-col gap-0.5">
                                <span className="text-xl font-bold text-foreground">{questions?.length || 0}</span>
                                <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Soru</span>
                            </div>
                            <div className="flex flex-col gap-0.5">
                                <span className="text-xl font-bold text-foreground">{answers?.length || 0}</span>
                                <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Cevap</span>
                            </div>
                        </div>

                        {/* Metadata & Social */}
                        <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-muted-foreground pt-1">
                            <div className="flex flex-wrap gap-4">
                                {profile?.website && (
                                    <a href={profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-primary transition-colors group">
                                        <Globe className="h-4 w-4 group-hover:text-primary" />
                                        <span className="truncate max-w-[200px] border-b border-transparent group-hover:border-primary/30">{profile.website.replace(/^https?:\/\//, '')}</span>
                                    </a>
                                )}
                                <div className="flex items-center gap-1.5">
                                    <span className="text-lg leading-none">📅</span>
                                    <span>{new Date(user.created_at).toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })} tarihinde katıldı</span>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                {profile?.social_links?.twitter && (
                                    <a href={`https://twitter.com/${profile.social_links.twitter.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-muted/50 hover:bg-muted hover:text-[#1DA1F2] transition-colors">
                                        <Twitter className="h-4 w-4" />
                                    </a>
                                )}
                                {profile?.social_links?.github && (
                                    <a href={`https://github.com/${profile.social_links.github}`} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-muted/50 hover:bg-muted hover:text-foreground transition-colors">
                                        <Github className="h-4 w-4" />
                                    </a>
                                )}
                                {profile?.social_links?.instagram && (
                                    <a href={`https://instagram.com/${profile.social_links.instagram}`} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-muted/50 hover:bg-muted hover:text-[#E1306C] transition-colors">
                                        <Instagram className="h-4 w-4" />
                                    </a>
                                )}
                                {profile?.social_links?.linkedin && (
                                    <a href={`https://linkedin.com/in/${profile.social_links.linkedin}`} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-muted/50 hover:bg-muted hover:text-[#0077b5] transition-colors">
                                        <Linkedin className="h-4 w-4" />
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reputation & Badges */}
                <div className="px-4 md:px-6 pb-6 space-y-4 border-t border-border/40 pt-4">
                    {/* Reputation */}
                    <div className="flex items-center gap-3 justify-center md:justify-start">
                        <ReputationDisplay
                            reputation={profile?.reputation || 0}
                            showLabel={true}
                            size="md"
                        />
                    </div>

                    {/* Badges */}
                    {userBadges && userBadges.length > 0 && (
                        <div className="space-y-2">
                            <div className="text-sm font-medium text-muted-foreground text-center md:text-left">Rozetler</div>
                            <div className="flex justify-center md:justify-start">
                                <BadgeDisplay
                                    userBadges={userBadges as any}
                                    maxDisplay={8}
                                    size="md"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Content Tabs */}
            <Tabs defaultValue="questions" className="w-full">
                <TabsList className="w-full justify-between border-b rounded-none h-auto p-0 bg-background/80 backdrop-blur-md sticky top-0 z-20">
                    <TabsTrigger
                        value="questions"
                        className="flex-1 rounded-none border-b-4 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 py-3 sm:py-4 font-bold text-sm text-muted-foreground data-[state=active]:text-foreground hover:bg-muted/50 transition-colors"
                    >
                        Sorular
                    </TabsTrigger>
                    <TabsTrigger
                        value="answers"
                        className="flex-1 rounded-none border-b-4 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 py-3 sm:py-4 font-bold text-sm text-muted-foreground data-[state=active]:text-foreground hover:bg-muted/50 transition-colors"
                    >
                        Cevaplar
                    </TabsTrigger>
                    <TabsTrigger
                        value="notifications"
                        className="flex-1 rounded-none border-b-4 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 py-3 sm:py-4 font-bold text-sm text-muted-foreground data-[state=active]:text-foreground hover:bg-muted/50 transition-colors"
                    >
                        Bildirimler
                    </TabsTrigger>
                    <TabsTrigger
                        value="messages"
                        className="flex-1 rounded-none border-b-4 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 py-3 sm:py-4 font-bold text-sm text-muted-foreground data-[state=active]:text-foreground hover:bg-muted/50 transition-colors"
                    >
                        Mesajlar
                    </TabsTrigger>
                </TabsList>

                <div className="min-h-[50vh]">
                    <TabsContent value="messages" className="m-0 animate-in fade-in-50 duration-300">
                        <div className="divide-y divide-border">
                            <ConversationList conversations={conversations} />
                        </div>
                    </TabsContent>

                    <TabsContent value="notifications" className="m-0 animate-in fade-in-50 duration-300">
                        <NotificationsList userId={user.id} />
                    </TabsContent>

                    <TabsContent value="questions" className="m-0 animate-in fade-in-50 duration-300">
                        {!questions || questions.length === 0 ? (
                            <div className="text-center py-12 px-4">
                                <MessageSquare className="h-10 w-10 mx-auto mb-4 text-muted-foreground/20" />
                                <p className="text-muted-foreground font-medium">Henüz hiç soru sormadın.</p>
                                <Link href="/forum">
                                    <Button variant="outline" className="mt-4 rounded-full">Soru Sor</Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="divide-y divide-border">
                                {questions.map((question) => (
                                    <div key={question.id} className="hover:bg-muted/30 transition-colors">
                                        <QuestionCard
                                            question={{
                                                ...question,
                                                profiles: {
                                                    username: profile?.username || "Ben",
                                                    full_name: profile?.full_name
                                                },
                                                answers: []
                                            }}
                                            hasVoted={false}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="answers" className="m-0 animate-in fade-in-50 duration-300">
                        {!answers || answers.length === 0 ? (
                            <div className="text-center py-12 px-4">
                                <FileText className="h-10 w-10 mx-auto mb-4 text-muted-foreground/20" />
                                <p className="text-muted-foreground font-medium">Henüz hiç cevap vermedin.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-border">
                                {answers.map((answer) => (
                                    <Link key={answer.id} href={`/forum/${answer.question_id}`} className="block hover:bg-muted/30 transition-colors p-4">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                                                <span className="font-bold text-foreground">Cevap verdi</span>
                                                <span>·</span>
                                                <span>{formatDistanceToNow(new Date(answer.created_at), { addSuffix: true, locale: tr })}</span>
                                            </div>
                                            <p className="text-sm font-medium text-muted-foreground mb-1">
                                                Soru: <span className="text-primary">{answer.questions?.title || "Silinmiş Soru"}</span>
                                            </p>
                                            <p className="text-base whitespace-pre-wrap line-clamp-3">
                                                {answer.content}
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    );
}
