import dayjs from "dayjs";
import updateLocale from "dayjs/plugin/updateLocale";
import weekOfYear from "dayjs/plugin/weekOfYear";
import weekday from "dayjs/plugin/weekday";
import relativeTime from "dayjs/plugin/relativeTime";
import isLeapYear from "dayjs/plugin/isLeapYear";
import isoWeeksInYear from "dayjs/plugin/isoWeeksInYear";
import utc from "dayjs/plugin/utc";
import localizedFormat from "dayjs/plugin/localizedFormat";
import "dayjs/locale/hr";

dayjs.extend(localizedFormat);
dayjs.extend(updateLocale);
dayjs.extend(weekday);
dayjs.extend(weekOfYear);
dayjs.extend(relativeTime);
dayjs.extend(isoWeeksInYear);
dayjs.extend(isLeapYear);
dayjs.extend(utc);

// dayjs.updateLocale("en", {
//   weekStart: 1,
//   weekdays: [
//     "Monday",
//     "Tuesday",
//     "Wednesday",
//     "Thursday",
//     "Friday",
//     "Saturday",
//     "Sunday",
//   ],
// });

dayjs.locale("hr");

export default dayjs;
