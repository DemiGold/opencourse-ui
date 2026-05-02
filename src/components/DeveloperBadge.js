export function renderDeveloperBadge() {
  const badge = document.createElement('a');
  badge.href = "https://github.com/DemiGold/opencourse-ui.git"; // Link to the repo for this project
  badge.target = "_blank";
  badge.rel = "noopener noreferrer";
  
  // Tailwind classes for a fixed, floating badge with hover effects
  badge.className = "fixed bottom-4 right-4 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-lg rounded-full py-2 px-4 flex items-center space-x-2 z-50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300";
  
  badge.innerHTML = `
      <div class="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
      <span class="text-xs font-semibold text-neutral-700 dark:text-neutral-300">Built by DemiGold</span>
  `;
  
  document.body.appendChild(badge);
}