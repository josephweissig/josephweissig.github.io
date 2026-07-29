import { DateTime } from 'luxon';

const ordinalDay = (day) => {
    return day > 0
        ? ['th', 'st', 'nd', 'rd'][
            (day > 3 && day < 21) || day % 10 > 3 ? 0 : day % 10
        ]
        : '';
};

export const dateFilter = (value) => {
    const dateObj = DateTime.fromISO(value, { zone: 'utc' });

    return dateObj.toFormat(
        `d'${ordinalDay(dateObj.day)} of ' MMMM yyyy`,
    );
};