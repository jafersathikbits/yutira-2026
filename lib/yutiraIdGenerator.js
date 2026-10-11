import User from '@/models/User';

export function formatYutiraId(n) {
  return `YUTIRA${String(n).padStart(4, '0')}`;
}

export async function generateNextYutiraId() {
  // Sort numerically (not as strings) so YUTIRA10000 comes after YUTIRA9999.
  const [last] = await User.aggregate([
    { $match: { yutiraId: { $regex: /^YUTIRA\d+$/ } } },
    { $project: { n: { $toInt: { $substrCP: ['$yutiraId', 6, 20] } } } },
    { $sort: { n: -1 } },
    { $limit: 1 }
  ]);

  return formatYutiraId((last?.n || 0) + 1);
}

/**
 * Assigns the next free YUTIRA ID to a user and saves it.
 * Retries when two verifications race for the same number (unique index).
 */
export async function assignYutiraId(user, attempts = 5) {
  for (let i = 0; i < attempts; i++) {
    user.yutiraId = await generateNextYutiraId();
    try {
      await user.save();
      return user.yutiraId;
    } catch (err) {
      const isDup = err?.code === 11000 && String(err?.message).includes('yutiraId');
      if (!isDup || i === attempts - 1) throw err;
    }
  }
}
