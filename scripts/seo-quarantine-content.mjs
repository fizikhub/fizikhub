import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  for (const line of fs.readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (!match || process.env[match[1]]) continue;
    process.env[match[1]] = match[2].replace(/^["']|["']$/g, "");
  }
}

loadEnvFile(path.join(process.cwd(), ".env.local"));

const apply = process.argv.includes("--apply");
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.");
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});

const testLikePattern = /(^|[-_\s])(test|deneme|tesr|taslak|lorem|dummy|sample|djrjr)([-_\s]|$)/i;

function clean(value = "") {
  return String(value)
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/[#*_>`~|[\]]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function isTestLike(...values) {
  return values
    .filter(Boolean)
    .some((value) => {
      const text = clean(value).toLocaleLowerCase("tr-TR");
      return testLikePattern.test(text) ||
        /^test[-_\d]/i.test(text) ||
        text === "test" ||
        text === "deneme";
    });
}

function hasWeakTitle(title) {
  const text = clean(title).toLocaleLowerCase("tr-TR");
  return text.length < 4 ||
    /^(.)\1+$/i.test(text) ||
    /^[\d\W_]+$/.test(text) ||
    text === "test" ||
    text === "deneme" ||
    text === "taslak" ||
    text.startsWith("lorem ipsum");
}

function visibleLength(...values) {
  return clean(values.filter(Boolean).join(" ")).length;
}

const { data: articles, error: articleError } = await supabase
  .from("articles")
  .select("id,title,slug,category,status,excerpt,content")
  .eq("status", "published")
  .limit(5000);

if (articleError) throw articleError;

const articleCandidates = (articles || [])
  .filter((article) => {
    if (isTestLike(article.slug, article.title)) return true;
    if (article.category === "Terim") return true;
    return visibleLength(article.excerpt, article.content) < 80;
  })
  .map((article) => ({
    id: article.id,
    slug: article.slug,
    title: article.title,
    category: article.category,
    reason: isTestLike(article.slug, article.title) ? "test-like" : article.category === "Terim" ? "term-article" : "weak-content",
  }));

const { data: questions, error: questionError } = await supabase
  .from("questions")
  .select("id,title,content,status,votes,answers(count)")
  .eq("status", "published")
  .limit(5000);

if (questionError) throw questionError;

const questionCandidates = (questions || [])
  .filter((question) => {
    const answerCount = Number(question.answers?.[0]?.count || 0);
    return isTestLike(question.title) ||
      hasWeakTitle(question.title) ||
      (visibleLength(question.title, question.content) < 40 && answerCount === 0);
  })
  .map((question) => ({
    id: question.id,
    title: question.title,
    votes: question.votes || 0,
    answerCount: Number(question.answers?.[0]?.count || 0),
    reason: isTestLike(question.title) ? "test-like" : hasWeakTitle(question.title) ? "weak-title" : "weak-content",
  }));

if (apply) {
  if (articleCandidates.length > 0) {
    const { error } = await supabase
      .from("articles")
      .update({ status: "draft" })
      .in("id", articleCandidates.map((article) => article.id));
    if (error) throw error;
  }

  if (questionCandidates.length > 0) {
    const { error } = await supabase
      .from("questions")
      .update({ status: "draft" })
      .in("id", questionCandidates.map((question) => question.id));
    if (error) throw error;
  }
}

console.log(JSON.stringify({
  mode: apply ? "applied" : "dry-run",
  articleCandidateCount: articleCandidates.length,
  questionCandidateCount: questionCandidates.length,
  articleCandidates,
  questionCandidates,
}, null, 2));
