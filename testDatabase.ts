import 'dotenv/config' 
import { initDatabase } from "@/lib/database";

async function main() {
  try {
    console.log('DATABASE_URL:', process.env.DATABASE_URL)
    const res = await initDatabase();
    console.log("Database initialized:", res);
  } catch (error) {
    console.error("Failed to initialize database:", error);
  }
}

main();
