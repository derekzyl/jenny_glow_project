import { logger } from '@modules/logger';
import { INotification } from '@modules/notification/interfaces.notification';
import NOTIFICATIONS from '@modules/notification/model.notification';
import { USERS } from '@modules/user';
import { IUserDoc } from '@modules/user/interfaces.user';
import { Model } from 'mongoose';
import { STAFFS } from '../staff';
import { IStaffDoc } from '../staff/interface.staff';
import { StatisticsI } from './interface.statistics';

// Helper function to get the day name from its number (1 = Sunday, 2 = Monday, etc.)
function getDayName(dayNumber: number): string {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[dayNumber % 7] || 'Unknown';
}

async function getDailyStats<T>(model: Model<T>, otherMatches?: { [day: string]: any }): Promise<{ [day: string]: number }> {
  try {
    const dailyStats = await model.aggregate([
      {
        $match: {
          createdAt: {
            $gte: { $subtract: [new Date(), 604800000] }, // Last 7 days
            $lt: new Date(), // Today
          },
          ...otherMatches,
        }, // Filter documents by date
      },
      {
        $group: {
          _id: {
            $dayOfWeek: { $add: ['$createdAt', 1] }, // Adjust to start from 1 (Monday)
          },
          count: { $sum: 1 }, // Count documents for each day
        },
      },
      {
        $project: {
          _id: 0, // Remove the default "_id" field
          day: { $dayOfWeek: { $add: ['$createdAt', 1] } }, // Get day of the week (adjust to start from 1)
          stats: '$count', // Rename "count" to "stats"
        },
      },
      {
        $sort: { day: 1 }, // Sort by day (optional)
      },
    ]);

    const formattedStats: { [day: string]: number } = {};

    // Map results to the desired object structure
    for (const stat of dailyStats) {
      // Map the day number to its corresponding name
      const dayName = getDayName(stat.day);
      formattedStats[dayName] = stat.stats;
    }

    return formattedStats;
  } catch (err) {
    logger.error('Error getting daily stats:', err);
    throw err; // Re-throw the error for proper handling
  }
}

// Re-throw the error for proper handling

export async function getNotificationCount(): Promise<StatisticsI[]> {
  const [getAll, getUnread, getUn, getR] = await Promise.all([
    NOTIFICATIONS.countDocuments({}),
    NOTIFICATIONS.countDocuments({ viewed: false }),
    getDailyStats<INotification>(NOTIFICATIONS, { viewed: false }),
    getDailyStats<INotification>(NOTIFICATIONS, { viewed: true }),
  ]);

  const va2 = Object.entries(getUn).map(([key, value]) => ({ name: key, unRead: value }));
  const va3 = Object.entries(getR).map(([key, value]) => ({ name: key, read: value }));
  logger.info(`va2 ${JSON.stringify(getUn)}`);

  logger.info(`va3 ${JSON.stringify(getR)}`);

  const va1 = Object.entries(getUn).map(([key, value]) => ({ name: key, unRead: value, read: getR[key] }));
  const read = getAll - getUnread;

  return [
    {
      name: 'unread',
      type: 'notification',
      count: getUnread,
      details: 'Unread notifications',
      weeklyReport: va2,
    },
    {
      name: 'read',
      type: 'notification',
      count: read,
      details: 'Read notifications',
      weeklyReport: va3,
    },
    {
      name: 'total',
      type: 'notification',
      count: getAll,
      details: 'Total notifications',
      weeklyReport: va1,
    },
  ];
}

export async function getStaffCount(): Promise<StatisticsI[]> {
  const getStaff = await STAFFS.countDocuments({});
  const weeklyStats = await getDailyStats<IStaffDoc>(STAFFS);
  const s = Object.entries(weeklyStats).map(([key, value]) => ({ name: key, count: value }));

  return [
    {
      name: 'total',
      type: 'staff',
      count: getStaff,
      details: 'Total staffs',

      weeklyReport: s,
    },
  ];
}

export async function getUserCount(): Promise<StatisticsI[]> {
  const getUser = await USERS.countDocuments({});
  const getIsAuthenticated = await USERS.countDocuments({ isEmailVerified: true });
  const notAuth = getUser - getIsAuthenticated;
  const weeklyIsEmailVerified = await getDailyStats<IUserDoc>(USERS, { isEmailVerified: true });
  const weeklyIsEmailNotVerified = await getDailyStats<IUserDoc>(USERS, { isEmailVerified: false });

  const s = Object.entries(weeklyIsEmailVerified).map(([key, value]) => ({ name: key, verified: value }));
  const t = Object.entries(weeklyIsEmailNotVerified).map(([key, value]) => ({ name: key, notVerified: value }));
  const u = Object.entries(weeklyIsEmailNotVerified).map(([key, value]) => ({
    name: key,
    notVerified: value,
    verified: weeklyIsEmailVerified[key],
  }));

  return [
    {
      name: 'total',
      type: 'user',
      count: getUser,
      details: 'Total users',
      weeklyReport: u,
    },
    {
      name: 'notVerified',
      type: 'user',
      count: notAuth,
      details: 'email not verified',
      weeklyReport: t,
    },
    {
      name: 'verified',
      type: 'user',
      count: getIsAuthenticated,
      weeklyReport: s,
      details: 'email is verified',
    },
  ];
}
