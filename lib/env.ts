import "server-only";

type ServerEnvironment = {
  supabaseUrl: string;
  supabasePublishableKey: string;
  openAiApiKey: string;
};

function requireEnvironmentVariable(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

export function getServerEnvironment(): ServerEnvironment {
  return {
    supabaseUrl: requireEnvironmentVariable("NEXT_PUBLIC_SUPABASE_URL"),
    supabasePublishableKey: requireEnvironmentVariable("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"),
    openAiApiKey: requireEnvironmentVariable("OPENAI_API_KEY"),
  };
}
