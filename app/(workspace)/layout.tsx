import { WorkspaceShell } from "@/components/layout/workspace-shell";

export default function WorkspaceLayout({ children }: LayoutProps<"/">) {
  return <WorkspaceShell>{children}</WorkspaceShell>;
}
