import { Router } from "express";
import * as statsService from "../services/statsService.js";
import * as clickService from "../services/clickService.js";

const router = Router();

// Get dashboard stats
router.get("/", (req, res) => {
  const totalClicks = statsService.getTotalClicks();
  const totalLinks = statsService.getTotalLinks();
  const clicksThisWeek = statsService.getClicksThisWeek();
  const clicksLastWeek = statsService.getClicksLastWeek();
  const topSource = statsService.getTopSource();
  
  const weeklyChange = clicksLastWeek > 0 
    ? Math.round(((clicksThisWeek - clicksLastWeek) / clicksLastWeek) * 100)
    : 0;
  
  res.json({
    totalClicks,
    totalLinks,
    weeklyChange,
    topSource: topSource?.referrer || "Direct",
    topSourcePercentage: topSource ? Math.round((topSource.count / totalClicks) * 100) : 0
  });
});

// Get stats for specific link
router.get("/link/:id", (req, res) => {
  const { id } = req.params;
  const { days = 30 } = req.query;
  
  const clickHistory = clickService.getClicksByLinkId(id, Number(days));
  const topReferrers = clickService.getTopReferrers(id);
  
  res.json({ clickHistory, topReferrers });
});

export default router;
