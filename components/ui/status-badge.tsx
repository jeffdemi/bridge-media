import type { WorkflowStatus } from "@/lib/demo-data";

const labels: Record<WorkflowStatus, string> = { idea: "Idea", developing: "Developing", draft: "Draft", review: "In review", approved: "Approved", ready_to_share: "Ready to share", archived: "Archived" };
const colors: Record<WorkflowStatus, string> = { idea: "bg-stone-100 text-stone-700", developing: "bg-amber-100 text-amber-800", draft: "bg-sky-100 text-sky-800", review: "bg-violet-100 text-violet-800", approved: "bg-emerald-100 text-emerald-800", ready_to_share: "bg-green-100 text-green-800", archived: "bg-zinc-100 text-zinc-600" };

export function StatusBadge({ status }: { status: WorkflowStatus }) {
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${colors[status]}`}>{labels[status]}</span>;
}
