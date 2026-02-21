/**
 * Format a DB post for the app (GossipItem shape).
 * Adds: date (relative, e.g. "2h ago"), imageUri (alias for media_url).
 */
function formatPost(post) {
  if (!post) return null;
  if (typeof post.get === 'function') post = post.get({ plain: true });
  const p = { ...post };
  p.id = String(p.id);
  p.date = relativeTime(p.created_at);
  const base = process.env.BASE_URL || '';
  p.imageUri = p.media_url ? (p.media_url.startsWith('http') ? p.media_url : base.replace(/\/$/, '') + p.media_url) : null;
  return p;
}

function relativeTime(created_at) {
  if (!created_at) return '';
  const then = new Date(created_at);
  const now = new Date();
  const sec = Math.floor((now - then) / 1000);
  const min = Math.floor(sec / 60);
  const hour = Math.floor(min / 60);
  const day = Math.floor(hour / 24);
  if (day > 0) return `${day}d ago`;
  if (hour > 0) return `${hour}h ago`;
  if (min > 0) return `${min}m ago`;
  return 'Just now';
}

module.exports = { formatPost, relativeTime };
