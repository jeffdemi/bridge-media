import { WorkspaceShell } from "@/components/layout/workspace-shell";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/supabase/data";

export default async function WorkspaceLayout({ children }: LayoutProps<"/">) {
  const configured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);
  if (configured && !(await getCurrentUser())) redirect("/login");
  return <WorkspaceShell>{children}</WorkspaceShell>;
}
