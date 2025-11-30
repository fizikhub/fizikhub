import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow, format } from "date-fns";
import { tr } from "date-fns/locale";
import { MessageSquare, FileText, BadgeCheck, Globe, Twitter, Github, Instagram, Linkedin, Bookmark, Calendar, Link as LinkIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { EditProfileButton } from "@/components/profile/edit-profile-button";
import { ModeToggle } from "@/components/mode-toggle";
import { NotificationsList } from "@/components/profile/notifications-list";
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
import { AnimatedStatCard } from "@/components/profile/animated-stat-card";
import { ParallaxCover } from "@/components/profile/parallax-cover";
import { Users, MessageCircle, FileQuestion, Heart } from "lucide-react";

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

    // Fetch bookmarked articles
    const { data: bookmarkedArticles } = await supabase
        .from('article_bookmarks')
        .select(`
            created_at,
            articles (
                id,
                title,
                slug,
                excerpt,
                created_at,
                author:profiles(full_name, username)
            )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    // Fetch bookmarked questions
    const { data: bookmarkedQuestions } = await supabase
        .from('question_bookmarks')
        .select(`
            created_at,
            questions (
                id,
                title,
                content,
                created_at,
                category,
                profiles(full_name, username),
                answers(count)
            )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    // Generate gradient
    const gradients = [
        "from-blue-600 via-indigo-500 to-purple-600",
        "from-emerald-500 via-teal-500 to-cyan-500",
        "from-orange-500 via-amber-500 to-yellow-500",
        "from-pink-500 via-rose-500 to-red-500",
        "from-violet-600 via-purple-500 to-fuchsia-500"
    ];
    const gradientIndex = (profile?.username?.length || 0 + (profile?.full_name?.length || 0)) % gradients.length;
    const coverGradient = gradients[gradientIndex];

    return (
        <div className="min-h-screen bg-background pb-20 overflow-x-hidden">
            {/* Parallax Cover Section */}
            <ParallaxCover gradient={coverGradient} />

            <div className="container px-4 md:px-6 mx-auto max-w-6xl relative z-10 -mt-32">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Sidebar: Profile Card */}
                    <div className="lg:col-span-4">
                        <Card className="border-none shadow-2xl bg-card/80 backdrop-blur-xl overflow-hidden sticky top-24">
                            <CardContent className="p-6 flex flex-col items-center text-center pt-12 relative">
                                {/* Avatar */}
                                <div className="absolute -top-16 left-1/2 -translate-x-1/2">
                                    <div className="relative group">
                                        <div className="h-32 w-32 rounded-full p-1.5 bg-background shadow-2xl ring-4 ring-background/50 transition-transform group-hover:scale-105">
                                            <AvatarUpload
                                                currentAvatarUrl={profile?.avatar_url}
                                                userInitial={profile?.full_name?.charAt(0) || user.email?.charAt(0).toUpperCase() || "U"}
                                                className="h-full w-full border-2 border-muted"
                                            />
                                        </div>
                                        {profile?.is_verified && (
                                            <div className="absolute bottom-1 right-1 bg-background rounded-full p-1.5 shadow-lg text-blue-500 animate-in zoom-in duration-300">
                                                <BadgeCheck className="h-6 w-6 fill-blue-500/10" />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Name & Bio */}
                                <div className="mt-16 space-y-2 w-full">
                                    <h1 className="text-2xl font-bold tracking-tight">{profile?.full_name || "İsimsiz Kullanıcı"}</h1>
                                    <p className="text-muted-foreground font-medium flex items-center justify-center gap-1">
                                        @{profile?.username || "kullanici"}
                                    </p>

                                    <div className="flex justify-center py-3">
                                        <ReputationDisplay
                                            reputation={profile?.reputation || 0}
                                            size="lg"
                                            showProgress={true}
                                        />
                                    </div>

                                    {profile?.bio && (
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
                                    <div className="flex gap-2 justify-center">
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
                                        <div className="hidden md:block">
                                            <NotificationBell />
                                        </div>
                                    </div>

                                    <EditProfileButton
                                        currentUsername={profile?.username || null}
                                        currentFullName={profile?.full_name || null}
                                        currentBio={profile?.bio || null}
                                        currentAvatarUrl={profile?.avatar_url || null}
                                        currentWebsite={profile?.website || null}
                                        currentSocialLinks={profile?.social_links || null}
                                        userEmail={user?.email || null}
                                    />

                                    <div className="md:hidden w-full">
                                        <SignOutButton className="w-full" />
                                    </div>
                                </div>

                                {/* Social & Info */}
                                <div className="w-full mt-6 space-y-3 text-sm">
                                    {profile?.website && (
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
                                        <span>{format(new Date(user.created_at), 'MMMM yyyy', { locale: tr })} tarihinde katıldı</span>
                                    </div>

                                    {/* Social Icons */}
                                    <div className="flex justify-center gap-2 pt-2">
                                        {profile?.social_links?.twitter && (
                                            <a href={`https://twitter.com/${profile.social_links.twitter}`} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-muted/50 hover:bg-[#1DA1F2]/10 hover:text-[#1DA1F2] transition-colors">
                                                <Twitter className="h-5 w-5" />
                                            </a>
                                        )}
                                        {profile?.social_links?.github && (
                                            <a href={`https://github.com/${profile.social_links.github}`} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-muted/50 hover:bg-foreground/10 hover:text-foreground transition-colors">
                                                <Github className="h-5 w-5" />
                                            </a>
                                        )}
                                        {profile?.social_links?.linkedin && (
                                            <a href={`https://linkedin.com/in/${profile.social_links.linkedin}`} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-muted/50 hover:bg-[#0077b5]/10 hover:text-[#0077b5] transition-colors">
                                                <Linkedin className="h-5 w-5" />
                                            </a>
                                        )}
                                        {profile?.social_links?.instagram && (
                                            <a href={`https://instagram.com/${profile.social_links.instagram}`} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-muted/50 hover:bg-[#E1306C]/10 hover:text-[#E1306C] transition-colors">
                                                <Instagram className="h-5 w-5" />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Badges Section - Left Sidebar */}
                        {userBadges && userBadges.length > 0 && (
                            <div className="mt-6">
                                <Card className="border-none shadow-lg bg-card/50 backdrop-blur-sm">
                                    <CardContent className="p-6">
                                        <h3 className="font-semibold mb-4 flex items-center gap-2">
                                            <BadgeCheck className="h-5 w-5 text-primary" />
                                            Rozetler
                                        </h3>
                                        <BadgeDisplay
                                            userBadges={userBadges as any}
                                            maxDisplay={12}
                                            size="md"
                                        />
                                    </CardContent>
                                </Card>
                            </div>
                        )}

                        {/* Animated Stats Section */}
                        <div className="mt-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <AnimatedStatCard
                                    icon={<Users className="h-6 w-6" strokeWidth={2.5} />}
                                    value={followersCount}
                                    label="Takipçi"
                                    delay={0}
                                />
                                <AnimatedStatCard
                                    icon={<Users className="h-6 w-6" strokeWidth={2.5} />}
                                    value={followingCount}
                                    label="Takip"
                                    delay={0.1}
                                />
                                <AnimatedStatCard
                                    icon={<MessageCircle className="h-6 w-6" strokeWidth={2.5} />}
                                    value={questions?.length || 0}
                                    label="Soru"
                                    delay={0.2}
                                />
                                <AnimatedStatCard
                                    icon={<FileQuestion className="h-6 w-6" strokeWidth={2.5} />}
                                    value={answers?.length || 0}
                                    label="Cevap"
                                    delay={0.3}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right Content: Tabs & Activity */}
                    <div className="lg:col-span-8 space-y-6">
                        <Tabs defaultValue="questions" className="w-full">
                            <div className="sticky top-[72px] z-20 bg-background/80 backdrop-blur-xl rounded-2xl border border-white/10 shadow-lg mb-6 p-1 overflow-x-auto">
                                <TabsList className="w-full justify-start bg-transparent h-auto p-0 min-w-max">
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
                                                {answers?.length || 0}
                                            </Badge>
                                        </div>
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="notifications"
                                        className="flex-1 rounded-xl data-[state=active]:bg-primary/10 data-[state=active]:text-primary px-4 py-3 font-medium text-muted-foreground transition-all"
                                    >
                                        <div className="flex items-center gap-2">
                                            <div className="relative">
                                                <div className="h-2 w-2 rounded-full bg-red-500 absolute -top-0.5 -right-0.5 animate-pulse" />
                                                <span className="text-lg leading-none">🔔</span>
                                            </div>
                                            <span>Bildirimler</span>
                                        </div>
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="messages"
                                        className="flex-1 rounded-xl data-[state=active]:bg-primary/10 data-[state=active]:text-primary px-4 py-3 font-medium text-muted-foreground transition-all"
                                    >
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg leading-none">💬</span>
                                            <span>Mesajlar</span>
                                        </div>
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="saved"
                                        className="flex-1 rounded-xl data-[state=active]:bg-primary/10 data-[state=active]:text-primary px-4 py-3 font-medium text-muted-foreground transition-all"
                                    >
                                        <div className="flex items-center gap-2">
                                            <Bookmark className="h-4 w-4" />
                                            <span>Kaydedilenler</span>
                                        </div>
                                    </TabsTrigger>
                                </TabsList>
                            </div>

                            <div className="min-h-[400px]">
                                <TabsContent value="messages" className="mt-0 animate-in fade-in-50 duration-300">
                                    <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-white/5 overflow-hidden">
                                        <ConversationList conversations={conversations} />
                                    </div>
                                </TabsContent>

                                <TabsContent value="notifications" className="mt-0 animate-in fade-in-50 duration-300">
                                    <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-white/5 overflow-hidden p-4">
                                        <NotificationsList userId={user.id} />
                                    </div>
                                </TabsContent>

                                <TabsContent value="questions" className="mt-0 space-y-4 animate-in fade-in-50 duration-300">
                                    {!questions || questions.length === 0 ? (
                                        <div className="text-center py-20 border-2 border-dashed rounded-3xl bg-muted/20">
                                            <div className="bg-muted/50 p-4 rounded-full inline-block mb-4">
                                                <MessageSquare className="h-8 w-8 text-muted-foreground" />
                                            </div>
                                            <h3 className="text-xl font-semibold mb-2">Henüz soru yok</h3>
                                            <p className="text-muted-foreground max-w-sm mx-auto mb-6">
                                                Henüz hiç soru sormadın. İlk sorunu sorarak topluluğa katıl!
                                            </p>
                                            <Link href="/forum">
                                                <Button className="rounded-full">Soru Sor</Button>
                                            </Link>
                                        </div>
                                    ) : (
                                        questions.map((question) => (
                                            <div key={question.id} className="hover:translate-x-1 transition-transform duration-300">
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
                                        ))
                                    )}
                                </TabsContent>

                                <TabsContent value="answers" className="mt-0 space-y-4 animate-in fade-in-50 duration-300">
                                    {!answers || answers.length === 0 ? (
                                        <div className="text-center py-20 border-2 border-dashed rounded-3xl bg-muted/20">
                                            <div className="bg-muted/50 p-4 rounded-full inline-block mb-4">
                                                <FileText className="h-8 w-8 text-muted-foreground" />
                                            </div>
                                            <h3 className="text-xl font-semibold mb-2">Henüz cevap yok</h3>
                                            <p className="text-muted-foreground max-w-sm mx-auto">
                                                Henüz hiç cevap vermedin.
                                            </p>
                                        </div>
                                    ) : (
                                        answers.map((answer) => (
                                            <Link key={answer.id} href={`/forum/${answer.question_id}`} className="block group">
                                                <Card className="hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-card/50 backdrop-blur-sm">
                                                    <CardContent className="p-6">
                                                        <div className="flex flex-col gap-2">
                                                            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                                                                <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                                                                    Cevap verdi
                                                                </Badge>
                                                                <span>·</span>
                                                                <span>{formatDistanceToNow(new Date(answer.created_at), { addSuffix: true, locale: tr })}</span>
                                                            </div>
                                                            <p className="text-sm font-medium text-muted-foreground">
                                                                Soru: <span className="text-foreground font-semibold group-hover:text-primary transition-colors">{answer.questions?.title || "Silinmiş Soru"}</span>
                                                            </p>
                                                            <p className="text-base whitespace-pre-wrap line-clamp-3 text-foreground/90">
                                                                {answer.content}
                                                            </p>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </Link>
                                        ))
                                    )}
                                </TabsContent>

                                <TabsContent value="saved" className="mt-0 animate-in fade-in-50 duration-300">
                                    <Tabs defaultValue="articles" className="w-full">
                                        <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-white/5 p-1 mb-6 inline-flex">
                                            <TabsList className="bg-transparent h-auto p-0">
                                                <TabsTrigger
                                                    value="articles"
                                                    className="rounded-xl px-4 py-2 text-sm font-medium data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <FileText className="h-4 w-4" />
                                                        <span>Makaleler</span>
                                                        <Badge variant="secondary" className="ml-1 text-[10px] h-5 px-1.5 bg-background/50">
                                                            {bookmarkedArticles?.length || 0}
                                                        </Badge>
                                                    </div>
                                                </TabsTrigger>
                                                <TabsTrigger
                                                    value="questions"
                                                    className="rounded-xl px-4 py-2 text-sm font-medium data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <MessageSquare className="h-4 w-4" />
                                                        <span>Sorular</span>
                                                        <Badge variant="secondary" className="ml-1 text-[10px] h-5 px-1.5 bg-background/50">
                                                            {bookmarkedQuestions?.length || 0}
                                                        </Badge>
                                                    </div>
                                                </TabsTrigger>
                                            </TabsList>
                                        </div>

                                        <TabsContent value="articles" className="mt-0 space-y-4">
                                            {!bookmarkedArticles || bookmarkedArticles.length === 0 ? (
                                                <div className="text-center py-12 px-4 border-2 border-dashed rounded-3xl bg-muted/20">
                                                    <Bookmark className="h-10 w-10 mx-auto mb-4 text-muted-foreground/20" />
                                                    <p className="text-muted-foreground font-medium">Henüz hiç makale kaydetmediniz.</p>
                                                    <Link href="/blog">
                                                        <Button variant="outline" className="mt-4 rounded-full">Makaleleri Keşfet</Button>
                                                    </Link>
                                                </div>
                                            ) : (
                                                <div className="grid gap-4">
                                                    {bookmarkedArticles.map((item: any) => (
                                                        <Link key={item.articles.id} href={`/blog/${item.articles.slug}`}>
                                                            <Card className="hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-card/50 backdrop-blur-sm cursor-pointer">
                                                                <CardContent className="p-6">
                                                                    <div className="space-y-2">
                                                                        <h3 className="font-bold text-lg group-hover:text-primary transition-colors line-clamp-1">
                                                                            {item.articles.title}
                                                                        </h3>
                                                                        <p className="text-muted-foreground line-clamp-2 text-sm">
                                                                            {item.articles.excerpt}
                                                                        </p>
                                                                        <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t border-border/50 mt-2">
                                                                            <span className="font-medium text-foreground">{item.articles.author?.full_name || "Yazar"}</span>
                                                                            <span>•</span>
                                                                            <span>{formatDistanceToNow(new Date(item.articles.created_at), { addSuffix: true, locale: tr })}</span>
                                                                        </div>
                                                                    </div>
                                                                </CardContent>
                                                            </Card>
                                                        </Link>
                                                    ))}
                                                </div>
                                            )}
                                        </TabsContent>

                                        <TabsContent value="questions" className="mt-0 space-y-4">
                                            {!bookmarkedQuestions || bookmarkedQuestions.length === 0 ? (
                                                <div className="text-center py-12 px-4 border-2 border-dashed rounded-3xl bg-muted/20">
                                                    <Bookmark className="h-10 w-10 mx-auto mb-4 text-muted-foreground/20" />
                                                    <p className="text-muted-foreground font-medium">Henüz hiç soru kaydetmediniz.</p>
                                                    <Link href="/forum">
                                                        <Button variant="outline" className="mt-4 rounded-full">Soruları Keşfet</Button>
                                                    </Link>
                                                </div>
                                            ) : (
                                                <div className="grid gap-4">
                                                    {bookmarkedQuestions.map((item: any) => (
                                                        <Link key={item.questions.id} href={`/forum/${item.questions.id}`}>
                                                            <Card className="hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-card/50 backdrop-blur-sm cursor-pointer">
                                                                <CardContent className="p-6">
                                                                    <div className="space-y-3">
                                                                        <div className="flex items-center justify-between">
                                                                            <Badge variant="outline" className="text-[10px] px-2 py-0.5 h-6 bg-primary/5 border-primary/20 text-primary">
                                                                                {item.questions.category || "Genel"}
                                                                            </Badge>
                                                                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                                                <MessageSquare className="h-3 w-3" />
                                                                                {item.questions.answers?.[0]?.count || 0} Cevap
                                                                            </span>
                                                                        </div>
                                                                        <h3 className="font-bold text-lg group-hover:text-primary transition-colors line-clamp-1">
                                                                            {item.questions.title}
                                                                        </h3>
                                                                        <p className="text-muted-foreground line-clamp-2 text-sm">
                                                                            {item.questions.content.substring(0, 150)}...
                                                                        </p>
                                                                        <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t border-border/50">
                                                                            <span className="font-medium text-foreground">{item.questions.profiles?.full_name || "Kullanıcı"}</span>
                                                                            <span>•</span>
                                                                            <span>{formatDistanceToNow(new Date(item.questions.created_at), { addSuffix: true, locale: tr })}</span>
                                                                        </div>
                                                                    </div>
                                                                </CardContent>
                                                            </Card>
                                                        </Link>
                                                    ))}
                                                </div>
                                            )}
                                        </TabsContent>
                                    </Tabs>
                                </TabsContent>
                            </div>
                        </Tabs>
                    </div>
                </div>
            </div>
        </div>
    );
}
