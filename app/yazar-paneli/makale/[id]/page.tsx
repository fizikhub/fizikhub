import { getArticleDetail } from "@/app/yazar-paneli/actions";
import { redirect } from "next/navigation";
import { ReviewDetailClient } from "./client-page";

export default async function ReviewDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const articleId = parseInt(id);

    if (isNaN(articleId)) redirect("/yazar-paneli");

    const data = await getArticleDetail(articleId);

    if ("error" in data && data.error) {
        redirect("/yazar-paneli");
    }

    return <ReviewDetailClient data={data as any} articleId={articleId} />;
}
