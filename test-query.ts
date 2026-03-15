import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function run() {
  const { data, error } = await supabase
    .from("articles")
    .select(`
      id,
      author:profiles!author_id(full_name),
      article_approvals(user_id, profiles(full_name))
    `)
    .limit(1);
    
  if (error) {
      console.log("Error profiles:", error.message);
      
      const { data: data2, error: err2 } = await supabase
        .from("articles")
        .select(`
          id,
          author:profiles!author_id(full_name),
          article_approvals(user_id, profiles!user_id(full_name))
        `)
        .limit(1);
        
      if (err2) {
          console.log("Error profiles!user_id:", err2.message);
          
          const { data: data3, error: err3 } = await supabase
            .from("articles")
            .select(`
              id,
              author:profiles!author_id(full_name),
              article_approvals(user_id, approver:profiles!user_id(full_name))
            `)
            .limit(1);
          console.log("Error approver:profiles!user_id:", err3?.message);
      } else {
          console.log("Success profiles!user_id!");
      }
  } else {
      console.log("Success normal profiles!", data);
  }
}

run();
