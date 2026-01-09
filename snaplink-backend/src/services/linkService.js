import { nanoid } from "nanoid";
import bcrypt from "bcryptjs";
import { Link, Click } from "../db/database.js";

export async function createLink(originalUrl, customSlug = null, expiresAt = null, userId = null, password = null, qrStyle = null) {
  const slug = customSlug || nanoid(6);
  const linkData = {
    slug,
    original_url: originalUrl,
    expires_at: expiresAt,
    user_id: userId
  };
  
  if (password) {
    linkData.password_hash = bcrypt.hashSync(password, 10);
  }
  
  if (qrStyle) {
    linkData.qr_style = qrStyle;
  }
  
  const link = await Link.create(linkData);
  return {
    id: link._id,
    slug: link.slug,
    original_url: link.original_url,
    clicks: link.clicks,
    created_at: link.created_at,
    expires_at: link.expires_at,
    user_id: link.user_id,
    has_password: !!link.password_hash,
    qr_style: link.qr_style
  };
}

export async function getLinkBySlug(slug) {
  const link = await Link.findOne({ slug });
  if (!link) return null;
  return {
    id: link._id,
    slug: link.slug,
    original_url: link.original_url,
    clicks: link.clicks,
    created_at: link.created_at,
    expires_at: link.expires_at,
    user_id: link.user_id,
    password_hash: link.password_hash,
    has_password: !!link.password_hash,
    qr_style: link.qr_style
  };
}

export async function getAllLinks(limit = 50, offset = 0) {
  const links = await Link.find().sort({ created_at: -1 }).skip(offset).limit(limit);
  return links.map(link => ({
    id: link._id,
    slug: link.slug,
    original_url: link.original_url,
    clicks: link.clicks,
    created_at: link.created_at,
    expires_at: link.expires_at,
    user_id: link.user_id,
    has_password: !!link.password_hash,
    qr_style: link.qr_style
  }));
}

export async function getLinksByUserId(userId, limit = 50, offset = 0) {
  const links = await Link.find({ user_id: userId }).sort({ created_at: -1 }).skip(offset).limit(limit);
  return links.map(link => ({
    id: link._id,
    slug: link.slug,
    original_url: link.original_url,
    clicks: link.clicks,
    created_at: link.created_at,
    expires_at: link.expires_at,
    user_id: link.user_id,
    has_password: !!link.password_hash,
    qr_style: link.qr_style
  }));
}

export async function updateLink(id, updates, userId = null) {
  const updateObj = {};
  if (updates.slug) updateObj.slug = updates.slug;
  if (updates.expiresAt !== undefined) updateObj.expires_at = updates.expiresAt;
  if (updates.originalUrl) updateObj.original_url = updates.originalUrl;
  if (updates.password !== undefined) {
    updateObj.password_hash = updates.password ? bcrypt.hashSync(updates.password, 10) : null;
  }
  if (updates.qrStyle) updateObj.qr_style = updates.qrStyle;

  const query = userId ? { _id: id, user_id: userId } : { _id: id };
  const link = await Link.findOneAndUpdate(query, updateObj, { new: true });
  if (!link) return null;
  return {
    id: link._id,
    slug: link.slug,
    original_url: link.original_url,
    clicks: link.clicks,
    created_at: link.created_at,
    expires_at: link.expires_at,
    user_id: link.user_id,
    has_password: !!link.password_hash,
    qr_style: link.qr_style
  };
}

export async function getLinkById(id) {
  const link = await Link.findById(id);
  if (!link) return null;
  return {
    id: link._id,
    slug: link.slug,
    original_url: link.original_url,
    clicks: link.clicks,
    created_at: link.created_at,
    expires_at: link.expires_at,
    user_id: link.user_id,
    has_password: !!link.password_hash,
    qr_style: link.qr_style
  };
}

export async function deleteLink(id, userId = null) {
  if (userId) {
    const link = await getLinkById(id);
    if (!link || link.user_id?.toString() !== userId.toString()) return false;
  }
  await Click.deleteMany({ link_id: id });
  await Link.findByIdAndDelete(id);
  return true;
}

export async function bulkDelete(ids, userId = null) {
  if (ids.length === 0) return;
  
  if (userId) {
    await Click.deleteMany({ link_id: { $in: ids } });
    await Link.deleteMany({ _id: { $in: ids }, user_id: userId });
  } else {
    await Click.deleteMany({ link_id: { $in: ids } });
    await Link.deleteMany({ _id: { $in: ids } });
  }
}

export async function incrementClicks(id) {
  await Link.findByIdAndUpdate(id, { $inc: { clicks: 1 } });
}

export async function slugExists(slug) {
  const link = await Link.findOne({ slug });
  return !!link;
}

export async function isLinkOwner(linkId, userId) {
  const link = await Link.findOne({ _id: linkId, user_id: userId });
  return !!link;
}

export function verifyLinkPassword(password, passwordHash) {
  return bcrypt.compareSync(password, passwordHash);
}
