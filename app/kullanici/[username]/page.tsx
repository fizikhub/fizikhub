import { createClient } from "@/lib/supabase-server";
import { notFound } from "next/navigation";
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
import { getFollowStatus, getFollowStats } from "@/app/profil/actions";
import { Metadata } from "next";

interface PageProps {
    params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { username } = await params;
    return {
        title: `@${username} - FizikHub Profil`,
    };
}

export default async function PublicProfilePage({ params }: PageProps) {
    const { username } = await params;
    const supabase = await createClient();

    // Fetch profile
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single();

    if (!profile) {
        notFound();
    }

    // Fetch current user to check if it's own profile
    const { data: { user } } = await supabase.auth.getUser();
    const isOwnProfile = user?.id === profile.id;

    // Check follow status
    const { isFollowing } = user && !isOwnProfile
        ? await getFollowStatus(profile.id)
        : { isFollowing: false };

    // Fetch follow stats
    const { followersCount, followingCount } = await getFollowStats(profile.id);

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
        .eq('user_id', profile.id)
        .order('awarded_at', { ascending: false });

    // Fetch user's questions
    const { data: questions } = await supabase
        .from('questions')
        .select(`
            *,
            profiles(username, full_name),
            answers(count)
        `)
        .eq('author_id', profile.id)
        .order('created_at', { ascending: false });

    // Fetch user's answers count (simplified for now)
    const { count: answersCount } = await supabase
        .from('answers')
        .select('*', { count: 'exact', head: true })
        .eq('author_id', profile.id);

    return (
        <div className="container py-10 px-4 md:px-6 max-w-4xl mx-auto min-h-screen">
            {/* Profile Header */}
            <Card className="mb-8 border-primary/20 bg-card/50 backdrop-blur-sm">
                <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <Avatar className="h-24 w-24 border-4 border-primary/10">
                            <AvatarImage src={profile.avatar_url || ""} />
                            <AvatarFallback className="text-2xl bg-primary/5">
                                {profile.full_name?.charAt(0) || profile.username?.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 text-center md:text-left">
                            <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2 justify-center md:justify-start">
                                <div className="flex items-center gap-2">
                                    <h1 className="text-3xl font-bold">{profile.full_name || "İsimsiz Kullanıcı"}</h1>
                                    {profile.is_verified && (
                                        <BadgeCheck className="h-6 w-6 text-blue-500 fill-blue-500/10" />
                                    )}
                                </div>
                                {userBadges && userBadges.length > 0 && (
                                    <div className="flex gap-1 justify-center md:justify-start">
                                        {userBadges.map((ub: any) => (
                                            <div key={ub.badges.name} title={`${ub.badges.name}: ${ub.badges.description}`} className="text-xl cursor-help hover:scale-110 transition-transform">
                                                {ub.badges.icon}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <p className="text-muted-foreground mb-2">@{profile.username}</p>
                            {profile.bio && (
                                <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto md:mx-0">
                                    {profile.bio}
                                </p>
                            )}

                            {/* Social Links */}
                            <div className="flex flex-wrap gap-3 justify-center md:justify-start mb-6">
                                {profile.website && (
                                    <a href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                                        <Globe className="h-5 w-5" />
                                    </a>
                                )}
                                {profile.social_links?.twitter && (
                                    <a href={`https://twitter.com/${profile.social_links.twitter}`} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-blue-400 transition-colors">
                                        <Twitter className="h-5 w-5" />
                                    </a>
                                )}
                                {profile.social_links?.github && (
                                    <a href={`https://github.com/${profile.social_links.github}`} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                                        <Github className="h-5 w-5" />
                                    </a>
                                )}
                                {profile.social_links?.linkedin && (
                                    <a href={`https://linkedin.com/in/${profile.social_links.linkedin}`} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-blue-600 transition-colors">
                                        <Linkedin className="h-5 w-5" />
                                    </a>
                                )}
                                {profile.social_links?.instagram && (
                                    <a href={`https://instagram.com/${profile.social_links.instagram}`} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-pink-600 transition-colors">
                                        <Instagram className="h-5 w-5" />
                                    </a>
                                )}
                            </div>
                            <div className="flex flex-wrap justify-center md:justify-start gap-4">
                                <Badge variant="secondary" className="gap-1">
                                    <MessageSquare className="h-3 w-3" /> {questions?.length || 0} Soru
                                </Badge>
                                <Badge variant="secondary" className="gap-1">
                                    <FileText className="h-3 w-3" /> {answersCount || 0} Cevap
                                </Badge>
                            </div>

                            <div className="mt-4">
                                <FollowStats followers={followersCount} following={followingCount} />
                            </div>

                            <div className="flex flex-wrap gap-2 mt-4">
                                {isOwnProfile ? (
                                    <EditProfileButton
                                        currentFullName={profile.full_name}
                                        currentBio={profile.bio}
                                        currentAvatarUrl={profile.avatar_url}
                                        currentWebsite={profile.website}
                                        currentSocialLinks={profile.social_links}
                                    />
                                ) : (
                                    user && (
                                        <>
                                            <FollowButton targetUserId={profile.id} initialIsFollowing={isFollowing} />
                                            <StartChatButton otherUserId={profile.id} />
                                        </>
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Content Tabs */}
            <Tabs defaultValue="questions" className="w-full">
                <TabsList className="grid w-full grid-cols-1 mb-8">
                    <TabsTrigger value="questions">Sorular</TabsTrigger>
                </TabsList>

                <TabsContent value="questions" className="space-y-4">
                    {questions?.length === 0 ? (
                        <div className="text-center py-12 border rounded-xl bg-muted/10 border-dashed">
                            <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground/20" />
                            <p className="text-muted-foreground">Bu kullanıcı henüz soru sormamış.</p>
                        </div>
                    ) : (
                        questions?.map((question) => (
                            <QuestionCard key={question.id} question={question} />
                        ))
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}
