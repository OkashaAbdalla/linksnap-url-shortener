import { Router } from "express";
import * as statsService from "../services/statsService.js";
import * as clickService from "../services/clickService.js";
import * as linkService from "../services/linkService.js";
import { authenticate } from "../middleware/auth.js";
import { NotFoundError } from "../middleware/errorHandler.js";

const router = Router();

// All routes require authentication
router.use(authenticate);

// Get dashboard stats for current user
router.get("/", async (req, res, next) => {
  try {
    const userId = req.user.id;
    const totalClicks = await statsService.getTotalClicks(userId);
    const totalLinks = await statsService.getTotalLinks(userId);
    const clicksThisWeek = await statsService.getClicksThisWeek(userId);
    const clicksLastWeek = await statsService.getClicksLastWeek(userId);
    const topSource = await statsService.getTopSource(userId);
    
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
  } catch (error) {
    next(error);
  }
});

// Get stats for specific link (only if owned by user)
router.get("/link/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { days = 30 } = req.query;
    
    if (!await linkService.isLinkOwner(id, req.user.id)) {
      throw new NotFoundError("Link not found");
    }
    
    const clickHistory = await clickService.getClicksByLinkId(id, Number(days));
    const topReferrers = await clickService.getTopReferrers(id);
    
    res.json({ clickHistory, topReferrers });
  } catch (error) {
    next(error);
  }
});

export default router;
