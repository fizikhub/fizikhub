import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow, format } from "date-fns";
import { tr } from "date-fns/locale";
import { MessageSquare, FileText, BadgeCheck, Twitter, Github, Instagram, Linkedin, Bookmark, Calendar, Link as LinkIcon, MapPin } from "lucide-react";
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

    // Generate gradient for cover
    const gradients = [
        "from-blue-500 to-indigo-600",
        "from-emerald-500 to-teal-600",
        "from-orange-500 to-amber-600",
        "from-pink-500 to-rose-600",
        "from-violet-500 to-purple-600"
    ];
    const gradientIndex = (profile?.username?.length || 0 + (profile?.full_name?.length || 0)) % gradients.length;
    const coverGradient = gradients[gradientIndex];

    return (
        <div className="min-h-screen bg-background">
            {/* Simple Cover */}
            <div className={`h-48 w-full bg-gradient-to-r ${coverGradient}`} />

            <div className="container mx-auto max-w-5xl px-4 -mt-20">
                {/* Profile Header */}
                <Card className="mb-6">
                    <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row gap-6 items-start">
                            {/* Avatar */}
                            <div className="relative mx-auto md:mx-0">
                                <div className="h-32 w-32 rounded-full ring-4 ring-background bg-background">
                                    <AvatarUpload
                                        currentAvatarUrl={profile?.avatar_url}
                                        userInitial={profile?.full_name?.charAt(0) || user.email?.charAt(0).toUpperCase() || "U"}
                                        className="h-full w-full"
                                    />
                                </div>
                                {profile?.is_verified && (
                                    <div className="absolute bottom-0 right-0 bg-background rounded-full p-1">
                                        <BadgeCheck className="h-6 w-6 text-blue-500 fill-blue-500/20" />
                                    </div>
                                )}
                            </div>

                            {/* Info */}
                            <div className="flex-1 text-center md:text-left space-y-3">
                                <div>
                                    <h1 className="text-2xl font-bold">{profile?.full_name || "İsimsiz Kullanıcı"}</h1>
                                    <p className="text-muted-foreground">@{profile?.username || "kullanici"}</p>
                                </div>

                                {profile?.bio && (
                                    <p className="text-sm text-foreground/80 max-w-2xl">{profile.bio}</p>
                                )}

                                {/* Meta info */}
                                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground justify-center md:justify-start">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="h-4 w-4" />
                                        <span>Katılım: {format(new Date(user.created_at), 'MMM yyyy', { locale: tr })}</span>
                                    </div>
                                    {profile?.website && (
                                        <a
                                            href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-1 hover:text-primary transition-colors"
                                        >
                                            <LinkIcon className="h-4 w-4" />
                                            <span>{profile.website.replace(/^https?:\/\//, '')}</span>
                                        </a>
                                    )}
                                </div>

                                {/* Social links */}
                                {(profile?.social_links?.twitter || profile?.social_links?.github || profile?.social_links?.linkedin || profile?.social_links?.instagram) && (
                                    <div className="flex gap-2 justify-center md:justify-start">
                                        {profile.social_links?.twitter && (
                                            <a href={`https://twitter.com/${profile.social_links.twitter}`} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-[#1DA1F2]">
                                                <Twitter className="h-5 w-5" />
                                            </a>
                                        )}
                                        {profile.social_links?.github && (
                                            <a href={`https://github.com/${profile.social_links.github}`} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                                                <Github className="h-5 w-5" />
                                            </a>
                                        )}
                                        {profile.social_links?.linkedin && (
                                            <a href={`https://linkedin.com/in/${profile.social_links.linkedin}`} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-[#0077b5]">
                                                <Linkedin className="h-5 w-5" />
                                            </a>
                                        )}
                                        {profile.social_links?.instagram && (
                                            <a href={`https://instagram.com/${profile.social_links.instagram}`} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-[#E1306C]">
                                                <Instagram className="h-5 w-5" />
                                            </a>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col gap-2 w-full md:w-auto">
                                <div className="flex gap-2 justify-center">
                                    <div className="md:hidden">
                                        <ModeToggle />
                                    </div>
                                    {profile?.is_writer && (
                                        <Link href="/yazar">
                                            <Button variant="outline" size="sm">
                                                <FileText className="h-4 w-4 mr-2" />
                                                Panel
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
                                <div className="md:hidden">
                                    <SignOutButton className="w-full" />
                                </div>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="mt-6 pt-6 border-t flex flex-wrap gap-6 justify-center md:justify-start">
                            <div className="text-center">
                                <div className="text-2xl font-bold">{followersCount}</div>
                                <div className="text-sm text-muted-foreground">Takipçi</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold">{followingCount}</div>
                                <div className="text-sm text-muted-foreground">Takip</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold">{questions?.length || 0}</div>
                                <div className="text-sm text-muted-foreground">Soru</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold">{answers?.length || 0}</div>
                                <div className="text-sm text-muted-foreground">Cevap</div>
                            </div>
                            <div className="flex items-center">
                                <ReputationDisplay reputation={profile?.reputation || 0} />
                            </div>
                        </div>

                        {/* Badges */}
                        {userBadges && userBadges.length > 0 && (
                            <div className="mt-6 pt-6 border-t">
                                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                                    <BadgeCheck className="h-4 w-4" />
                                    Rozetler
                                </h3>
                                <BadgeDisplay userBadges={userBadges as any} maxDisplay={10} size="md" />
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Content Tabs */}
                <Tabs defaultValue="questions" className="mb-20">
                    <TabsList className="w-full justify-start overflow-x-auto">
                        <TabsTrigger value="questions" className="gap-2">
                            <MessageSquare className="h-4 w-4" />
                            <span>Sorular</span>
                            <Badge variant="secondary" className="ml-1">{questions?.length || 0}</Badge>
                        </TabsTrigger>
                        <TabsTrigger value="answers" className="gap-2">
                            <FileText className="h-4 w-4" />
                            <span>Cevaplar</span>
                            <Badge variant="secondary" className="ml-1">{answers?.length || 0}</Badge>
                        </TabsTrigger>
                        <TabsTrigger value="notifications" className="gap-2">
                            🔔
                            <span>Bildirimler</span>
                        </TabsTrigger>
                        <TabsTrigger value="messages" className="gap-2">
                            💬
                            <span>Mesajlar</span>
                        </TabsTrigger>
                        <TabsTrigger value="saved" className="gap-2">
                            <Bookmark className="h-4 w-4" />
                            <span>Kaydedilenler</span>
                        </TabsTrigger>
                    </TabsList>

                    <div className="mt-6">
                        <TabsContent value="questions" className="space-y-4">
                            {!questions || questions.length === 0 ? (
                                <Card>
                                    <CardContent className="py-12 text-center">
                                        <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                                        <h3 className="font-semibold mb-2">Henüz soru yok</h3>
                                        <p className="text-muted-foreground text-sm mb-4">İlk sorunu sorarak başla!</p>
                                        <Link href="/forum">
                                            <Button>Soru Sor</Button>
                                        </Link>
                                    </CardContent>
                                </Card>
                            ) : (
                                questions.map((question) => (
                                    <QuestionCard
                                        key={question.id}
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
                                ))
                            )}
                        </TabsContent>

                        <TabsContent value="answers" className="space-y-4">
                            {!answers || answers.length === 0 ? (
                                <Card>
                                    <CardContent className="py-12 text-center">
                                        <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                                        <p className="text-muted-foreground">Henüz cevap vermediniz.</p>
                                    </CardContent>
                                </Card>
                            ) : (
                                answers.map((answer) => (
                                    <Link key={answer.id} href={`/forum/${answer.question_id}`}>
                                        <Card className="hover:border-primary/50 transition-colors">
                                            <CardContent className="p-4">
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                                                    <Badge variant="outline">Cevap</Badge>
                                                    <span>{formatDistanceToNow(new Date(answer.created_at), { addSuffix: true, locale: tr })}</span>
                                                </div>
                                                <p className="text-sm font-medium text-muted-foreground mb-2">
                                                    Soru: <span className="text-foreground">{answer.questions?.title || "Silinmiş"}</span>
                                                </p>
                                                <p className="text-sm line-clamp-2">{answer.content}</p>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                ))
                            )}
                        </TabsContent>

                        <TabsContent value="notifications">
                            <Card>
                                <CardContent className="p-4">
                                    <NotificationsList userId={user.id} />
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="messages">
                            <Card>
                                <CardContent className="p-0">
                                    <ConversationList conversations={conversations} />
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="saved">
                            <Tabs defaultValue="articles">
                                <TabsList>
                                    <TabsTrigger value="articles" className="gap-2">
                                        <FileText className="h-4 w-4" />
                                        Makaleler ({bookmarkedArticles?.length || 0})
                                    </TabsTrigger>
                                    <TabsTrigger value="questions" className="gap-2">
                                        <MessageSquare className="h-4 w-4" />
                                        Sorular ({bookmarkedQuestions?.length || 0})
                                    </TabsTrigger>
                                </TabsList>

                                <div className="mt-4">
                                    <TabsContent value="articles" className="space-y-4">
                                        {!bookmarkedArticles || bookmarkedArticles.length === 0 ? (
                                            <Card>
                                                <CardContent className="py-12 text-center">
                                                    <Bookmark className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                                                    <p className="text-muted-foreground mb-4">Henüz makale kaydetmediniz.</p>
                                                    <Link href="/blog">
                                                        <Button variant="outline">Makaleleri Keşfet</Button>
                                                    </Link>
                                                </CardContent>
                                            </Card>
                                        ) : (
                                            bookmarkedArticles.map((item: any) => (
                                                <Link key={item.articles.id} href={`/blog/${item.articles.slug}`}>
                                                    <Card className="hover:border-primary/50 transition-colors">
                                                        <CardContent className="p-4">
                                                            <h3 className="font-semibold mb-2">{item.articles.title}</h3>
                                                            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{item.articles.excerpt}</p>
                                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                                <span>{item.articles.author?.full_name || "Yazar"}</span>
                                                                <span>•</span>
                                                                <span>{formatDistanceToNow(new Date(item.articles.created_at), { addSuffix: true, locale: tr })}</span>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                </Link>
                                            ))
                                        )}
                                    </TabsContent>

                                    <TabsContent value="questions" className="space-y-4">
                                        {!bookmarkedQuestions || bookmarkedQuestions.length === 0 ? (
                                            <Card>
                                                <CardContent className="py-12 text-center">
                                                    <Bookmark className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                                                    <p className="text-muted-foreground mb-4">Henüz soru kaydetmediniz.</p>
                                                    <Link href="/forum">
                                                        <Button variant="outline">Soruları Keşfet</Button>
                                                    </Link>
                                                </CardContent>
                                            </Card>
                                        ) : (
                                            bookmarkedQuestions.map((item: any) => (
                                                <Link key={item.questions.id} href={`/forum/${item.questions.id}`}>
                                                    <Card className="hover:border-primary/50 transition-colors">
                                                        <CardContent className="p-4">
                                                            <div className="flex items-center justify-between mb-2">
                                                                <Badge variant="outline">{item.questions.category || "Genel"}</Badge>
                                                                <span className="text-xs text-muted-foreground">
                                                                    {item.questions.answers?.[0]?.count || 0} Cevap
                                                                </span>
                                                            </div>
                                                            <h3 className="font-semibold mb-2">{item.questions.title}</h3>
                                                            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                                                                {item.questions.content.substring(0, 150)}...
                                                            </p>
                                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                                <span>{item.questions.profiles?.full_name || "Kullanıcı"}</span>
                                                                <span>•</span>
                                                                <span>{formatDistanceToNow(new Date(item.questions.created_at), { addSuffix: true, locale: tr })}</span>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                </Link>
                                            ))
                                        )}
                                    </TabsContent>
                                </div>
                            </Tabs>
                        </TabsContent>
                    </div>
                </Tabs>
            </div>
        </div>
    );
}
