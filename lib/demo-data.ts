export type WorkflowStatus = "idea" | "developing" | "draft" | "review" | "approved" | "ready_to_share" | "archived";

export const platforms = ["Instagram", "Facebook", "X", "TikTok"] as const;
export const themes = ["Questions", "Testimonies", "Invitations", "Countdown"] as const;

export const ideas = [
  { id: "why-church", title: "Why would I go back to church?", description: "A candid invitation for someone who may believe in God but has lost trust in churches.", theme: "Questions", owner: "Maya", status: "developing" as WorkflowStatus, platforms: ["Instagram", "Facebook", "TikTok"], updated: "Today" },
  { id: "suffering", title: "Why does God allow suffering?", description: "Make room for the question without pretending there is a quick or painless answer.", theme: "Questions", owner: "Jon", status: "review" as WorkflowStatus, platforms: ["Instagram", "Facebook", "X"], updated: "Yesterday" },
  { id: "dinner", title: "Dinner with no strings attached", description: "An invitation centered on a shared meal, free childcare, and no pressure.", theme: "Invitations", owner: "Elena", status: "draft" as WorkflowStatus, platforms: ["Instagram", "Facebook"], updated: "Aug 20" },
  { id: "story", title: "I brought my doubts with me", description: "A short first-person story about arriving skeptical and finding room for honest questions.", theme: "Testimonies", owner: "Chris", status: "approved" as WorkflowStatus, platforms: ["Instagram", "Facebook", "TikTok"], updated: "Aug 18" },
];

export const shareItems = [
  { id: "suffering-video", title: "Why does God allow suffering?", type: "Video", duration: "27-second video", theme: "Questions", campaign: "Bridge Fall 2026", platforms: ["Instagram", "Facebook", "TikTok"], caption: "If God is good, why is there so much suffering? That question deserves more than a slogan. Bridge is a place to bring honest questions, share a meal, and explore Christianity without pressure.", accent: "from-[#214e3d] to-[#6e8f76]" },
  { id: "doubts-story", title: "You don't have to leave your questions at the door", type: "Image", duration: "Shareable image", theme: "Testimonies", campaign: "Bridge Fall 2026", platforms: ["Instagram", "Facebook", "X"], caption: "Questions and doubts are welcome at Bridge. Join us for ten relaxed evenings, a free dinner, and an honest exploration of Christianity.", accent: "from-[#9b6335] to-[#d7aa6a]" },
  { id: "free-dinner", title: "Dinner, childcare, and space to explore", type: "Invitation", duration: "Invitation card", theme: "Invitations", campaign: "Bridge Fall 2026", platforms: ["Instagram", "Facebook"], caption: "Curious about Christianity? Bridge begins September 9 in Malvern. Dinner and childcare are free, and there is no pressure. Come as you are.", accent: "from-[#593f57] to-[#b2869d]" },
];
