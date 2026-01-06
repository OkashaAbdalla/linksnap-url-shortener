export const sampleLinks = [
  {
    id: 1,
    slug: "design-v2",
    long: "https://figma.com/file/x9s2k/Project-Alpha-Design",
    clicks: "1.2k",
    icon: "palette",
    iconBg: "bg-orange-500/20",
    iconColor: "text-orange-400",
    slugColor: "text-orange-400",
    barColor: "bg-cyan-400",
  },
  {
    id: 2,
    slug: "prod-demo",
    long: "https://youtube.com/watch?v=dQw4w9WgXcQ",
    clicks: "842",
    icon: "play_circle",
    iconBg: "bg-red-500/20",
    iconColor: "text-red-400",
    slugColor: "text-pink-400",
    barColor: "bg-pink-400",
  },
  {
    id: 3,
    slug: "q3-report",
    long: "https://drive.google.com/drive/folders/1A2B3C",
    clicks: "156",
    icon: "description",
    iconBg: "bg-blue-500/20",
    iconColor: "text-blue-400",
    slugColor: "text-gray-400",
    barColor: "bg-blue-400",
  },
];

export const statsData = [
  { title: "TOTAL CLICKS", value: "128.4k", subtitle: "+12% this week", subtitleColor: "text-cyan-400", icon: "trending_up" },
  { title: "ACTIVE LINKS", value: "42", subtitle: "~ Stable", subtitleColor: "text-gray-500", icon: null },
  { title: "TOP SOURCE", value: "Twitter / X", subtitle: "65% of traffic", subtitleColor: "text-cyan-400", icon: "share" },
  { title: "AVG. CTR", value: "4.8%", subtitle: "+0.5% vs last mo", subtitleColor: "text-cyan-400", icon: "trending_up" },
];

export const createNewLink = (url, slug) => ({
  id: Date.now(),
  slug,
  long: url,
  clicks: "0",
  icon: "link",
  iconBg: "bg-cyan-500/20",
  iconColor: "text-cyan-400",
  slugColor: "text-cyan-400",
  barColor: "bg-cyan-400",
});
