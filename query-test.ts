import { createClient } from "@supabase/supabase-js";
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
async function test() {
  const { data, error } = await supabase.from('profiles').select('location').limit(1);
  console.log(error ? "Error: " + error.message : "Success");
}
test();
