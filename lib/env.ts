import "server-only";

type SupabaseEnvironment = {
  supabaseUrl: string;
  supabasePublishableKey: string;
};

type AiEnvironment = {
  openAiApiKey: string;
};

function requireEnvironmentVariable(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

export function getSupabaseEnvironment(): SupabaseEnvironment {
  return {
    supabaseUrl: requireEnvironmentVariable("NEXT_PUBLIC_SUPABASE_URL"),
    supabasePublishableKey: requireEnvironmentVariable("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"),
  };
}

export function getAiEnvironment(): AiEnvironment {
  return {
    openAiApiKey: requireEnvironmentVariable("OPENAI_API_KEY"),
  };
}
