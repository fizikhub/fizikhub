import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "..", ".env.local") });

const secret = process.env.SUPABASE_WEBHOOK_SECRET;
const localUrl = "http://localhost:3000/api/webhooks/search-sync";

async function testWebhook() {
    if (!secret) {
        console.error("Missing SUPABASE_WEBHOOK_SECRET. Refusing to send a webhook with a hard-coded fallback secret.");
        process.exit(1);
    }

    console.log("Starting Webhook Eşitleme Testi (Yerel Next.js sunucusu üzerinden)...");

    // 1. Test INSERT payload
    const insertPayload = {
        type: "INSERT",
        table: "articles",
        record: {
            id: 99999,
            title: "Kuantum Mekaniğinde Zamanın Akışı",
            category: "Kuantum",
            excerpt: "Zamanın kuantum fiziğindeki yeri ve Wheeler-DeWitt denklemi.",
            content: "Wheeler-DeWitt denkleminde zaman terimi bulunmaz. Bu durum fiziğin en büyük gizemlerinden biridir...",
            published: true,
            slug: "kuantum-mekaniginde-zamanin-akisi-99999"
        }
    };

    try {
        console.log("\n1. Gönderiliyor: INSERT Mock Makale (ID: 99999)...");
        const resInsert = await fetch(localUrl, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${secret}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(insertPayload)
        });

        const dataInsert = await resInsert.json();
        console.log(`Status: ${resInsert.status}`);
        console.log("Response:", JSON.stringify(dataInsert, null, 2));

        if (resInsert.status !== 200) {
            throw new Error("INSERT Webhook testi başarısız oldu!");
        }

        // Wait a moment
        await new Promise((r) => setTimeout(r, 1000));

        // 2. Test DELETE payload (Temizlik)
        const deletePayload = {
            type: "DELETE",
            table: "articles",
            old_record: {
                id: 99999
            }
        };

        console.log("\n2. Gönderiliyor: DELETE Mock Makale (ID: 99999)...");
        const resDelete = await fetch(localUrl, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${secret}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(deletePayload)
        });

        const dataDelete = await resDelete.json();
        console.log(`Status: ${resDelete.status}`);
        console.log("Response:", JSON.stringify(dataDelete, null, 2));

        if (resDelete.status !== 200) {
            throw new Error("DELETE Webhook testi başarısız oldu!");
        }

        console.log("\n✅ Webhook Testi Başarıyla Tamamlandı! Hem yazma hem de silme işlemleri mükemmel çalışıyor!");

    } catch (err) {
        console.error("❌ Test sırasında bir hata oluştu:", err.message);
        process.exit(1);
    }
}

// Give dev server a moment to spin up before triggering
setTimeout(testWebhook, 3000);
