import { getWeeklyQuestion } from "@/app/actions/weekly-pick";
import { WeeklyQuestionManager } from "@/components/admin/weekly-question-manager";

export default async function AdminWeeklyQuestionPage() {
    const currentPick = await getWeeklyQuestion();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Haftanın Sorusu</h1>
                <p className="text-muted-foreground">
                    Anasayfada gösterilecek "Haftanın Sorusu"nu seç.
                </p>
            </div>

            <WeeklyQuestionManager currentPick={currentPick} />
        </div>
    );
}
