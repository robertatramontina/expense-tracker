//*******************************
//* configuracao do Supabase
//*******************************
const supabaseUrl = "https://kdofasyayzgohfndgzbq.supabase.co";
const supabaseKey = "sb_publishable_M4d9f3nV4QRvOJ8g88EsWg_pUEGwURZ";

const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

console.log("Cliente Supabase:", supabaseClient);