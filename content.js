// All personal content lives here. Edit this file — the page renders from it.
window.PORTFOLIO = {
  name: "Julius John Arcilla",
  role: "Full Stack Developer",
  location: "Antipolo City, Philippines",
  timezone: "Asia/Manila", // IANA zone for the live clock, e.g. "America/New_York"
  available: true, // shows the "Available for work" badge
  tagline: "Computer engineer and full stack developer building React and Python web apps for support teams.",

  // Big line in the About section; words light up as you scroll.
  statement: "I build tools that replace manual tracking, from a support dashboard on React and Supabase to a fall detector on sensors and video.",
  about: [
    "I'm a Computer Engineering graduate from Mapúa University. I design, build and ship full stack web apps.",
    "At Cellumove I built a monitoring dashboard that replaced spreadsheet tracking, and supervised 12 support agents. At Dashlabs.ai I resolved client issues in production, about 75 tickets a week.",
  ],

  email: "joulesdearc@gmail.com",
  links: [
    { label: "GitHub", url: "https://github.com/JuliusJohnArcilla" },
    { label: "LinkedIn", url: "https://www.linkedin.com/in/julius-john-arcilla-b8944918b/" },
  ],
  resumeUrl: "", // e.g. "resume.pdf"; leave empty to hide the link

  // `hue` (0–360) colors the generated preview. Use `image: "img/x.jpg"` for a real screenshot.
  projects: [
    { title: "Helpdesk", image: "img/helpdesk.jpg", year: "2026", hue: 230, url: "#",
      summary: "Shared support inbox with a built-in AI that drafts replies from Shopify orders. Agents review every draft before it goes out.",
      tags: ["Full-Stack", "Next.js", "Claude API"] },
    { title: "Ticket Monitor", image: "img/ticket-monitor.jpg", year: "2025", hue: 200, url: "https://github.com/JuliusJohnArcilla/Tracking-and-Monitoring",
      summary: "Dashboard for a 12-agent support team. Replaced spreadsheet tracking of tickets per agent, status and type.",
      tags: ["React", "Supabase", "PostgreSQL"] },
    { title: "F.A.M.S.", year: "2026", hue: 340, url: "#",
      summary: "Fall detection for assisted living. Fuses video and sensor models for 97.87% ensemble accuracy and alerts caregivers.",
      tags: ["Deep Learning", "PyTorch", "Raspberry Pi"] },
    { title: "Wallet Tracker", image: "img/wallet-tracker.jpg", year: "2026", hue: 150, url: "https://juliusjohnarcilla.github.io/wallet-tracker/",
      summary: "Phone-first money tracker for e-wallets, cards, loans and budgets. Data stays in the browser; sync is optional.",
      tags: ["PWA", "JavaScript", "Personal Finance"] },
    { title: "SchedulePix", image: "img/schedulepix.jpg", year: "2026", hue: 285, url: "https://github.com/JuliusJohnArcilla/schedulepix",
      summary: "Browser-only schedule builder. Drag images onto a time grid, style it, and export PNG or JPG.",
      tags: ["React", "TypeScript", "Drag and Drop"] },
    { title: "Cardfolio", image: "img/cardfolio.jpg", year: "2026", hue: 45, url: "#",
      summary: "Card collection organizer with price checking. Try it as a guest, or sign up to save your binder online.",
      tags: ["Web App", "Cloudflare Pages", "Price Checking"] },
  ],

  experience: [
    { period: "2026", title: "Support Engineer", org: "Dashlabs.ai (YC W21)", note: "Resolved client issues for diagnostic-lab accounts, about 75 tickets a week, on rotating shifts." },
    { period: "2025 — 2026", title: "Customer Operations & Data Associate", org: "Cellumove", note: "Built a ticket monitoring dashboard in React and Supabase; supervised 12 support agents." },
    { period: "2021 — 2026", title: "B.S. Computer Engineering", org: "Mapúa University", note: "Thesis: a fall detection system with 97.87% ensemble accuracy." },
  ],

  skills: {
    Frontend: ["React", "JavaScript", "HTML & CSS"],
    Backend: ["Python", "Supabase", "PostgreSQL", "MySQL", "REST APIs"],
    Tools: ["Git & GitHub", "Vercel", "Google Apps Script"],
    Other: ["C++", "Networking (CCNA)", "Embedded systems"],
  },
};
