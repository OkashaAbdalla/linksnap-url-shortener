import { Link, Click } from "../db/database.js";
import mongoose from "mongoose";

export async function getTotalClicks(userId = null) {
  if (userId) {
    const result = await Link.aggregate([
      { $match: { user_id: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: null, total: { $sum: "$clicks" } } }
    ]);
    return result[0]?.total || 0;
  }
  const result = await Link.aggregate([
    { $group: { _id: null, total: { $sum: "$clicks" } } }
  ]);
  return result[0]?.total || 0;
}

export async function getTotalLinks(userId = null) {
  if (userId) {
    return await Link.countDocuments({ user_id: userId });
  }
  return await Link.countDocuments();
}

export async function getClicksThisWeek(userId = null) {
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  
  if (userId) {
    const userLinks = await Link.find({ user_id: userId }).select("_id");
    const linkIds = userLinks.map(l => l._id);
    return await Click.countDocuments({ 
      link_id: { $in: linkIds }, 
      clicked_at: { $gte: weekAgo } 
    });
  }
  return await Click.countDocuments({ clicked_at: { $gte: weekAgo } });
}

export async function getClicksLastWeek(userId = null) {
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const twoWeeksAgo = new Date();
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
  
  if (userId) {
    const userLinks = await Link.find({ user_id: userId }).select("_id");
    const linkIds = userLinks.map(l => l._id);
    return await Click.countDocuments({ 
      link_id: { $in: linkIds }, 
      clicked_at: { $gte: twoWeeksAgo, $lt: weekAgo } 
    });
  }
  return await Click.countDocuments({ 
    clicked_at: { $gte: twoWeeksAgo, $lt: weekAgo } 
  });
}

export async function getTopSource(userId = null) {
  let matchStage = { referrer: { $ne: null } };
  
  if (userId) {
    const userLinks = await Link.find({ user_id: userId }).select("_id");
    const linkIds = userLinks.map(l => l._id);
    matchStage.link_id = { $in: linkIds };
  }
  
  const result = await Click.aggregate([
    { $match: matchStage },
    { $group: { _id: "$referrer", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 1 },
    { $project: { referrer: "$_id", count: 1, _id: 0 } }
  ]);
  
  return result[0] || null;
}
