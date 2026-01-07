import { Click } from "../db/database.js";
import mongoose from "mongoose";

export async function recordClick(linkId, referrer, userAgent) {
  await Click.create({
    link_id: linkId,
    referrer,
    user_agent: userAgent
  });
}

export async function getClicksByLinkId(linkId, days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  const objectId = new mongoose.Types.ObjectId(linkId);
  const clicks = await Click.aggregate([
    { 
      $match: { 
        link_id: objectId, 
        clicked_at: { $gte: startDate } 
      } 
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$clicked_at" } },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } },
    { $project: { date: "$_id", count: 1, _id: 0 } }
  ]);
  
  return clicks;
}

export async function getTopReferrers(linkId, limit = 5) {
  const objectId = new mongoose.Types.ObjectId(linkId);
  const referrers = await Click.aggregate([
    { 
      $match: { 
        link_id: objectId, 
        referrer: { $ne: null } 
      } 
    },
    {
      $group: {
        _id: "$referrer",
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } },
    { $limit: limit },
    { $project: { referrer: "$_id", count: 1, _id: 0 } }
  ]);
  
  return referrers;
}
