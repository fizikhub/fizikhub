import { QuizForm } from "@/components/admin/quiz-form";

export default function NewQuizPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Yeni Quiz Oluştur</h1>
                <p className="text-muted-foreground">
                    Yeni bir test oluşturmak için aşağıdaki formu doldurun.
                </p>
            </div>

            <QuizForm />
        </div>
    );
}
