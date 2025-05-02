"use client";

import { parseISO, format } from "date-fns";

type Props = {
  dateString: string;
};

const DateFormatter = ({ dateString }: Props) => {
  // Check if dateString is valid
  try {
    const date = parseISO(dateString);
    return <time dateTime={dateString}>{format(date, "LLLL d, yyyy")}</time>;
  } catch (error) {
    // Return the original string if parsing fails
    return <time dateTime={dateString}>{dateString}</time>;
  }
};

export default DateFormatter;
