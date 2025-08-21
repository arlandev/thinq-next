import { supabase } from "@/lib/supabaseClient"

async function listFaqs() {
  const { data, error } = await supabase
    .storage
    .from("faqs")
    .list("", { limit: 100 })

  if (error) {
    console.error(error)
    return []
  }

  return data
}