package helper

import (
	"time"
)

func IsDate(dateString string) (string, bool) {
	layout := "2006-01-02"
	date, err := time.Parse(layout, dateString)
	if err != nil {
		return "Error parsing date string", false
	}

	if date.Year() < 1000 || date.Year() > 9999 {
		return "Invalid year", false
	}
	if date.Month() < 1 || date.Month() > 12 {
		return "Invalid month", false
	}
	if date.Day() < 1 || date.Day() > 31 {
		return "Invalid day", false
	}

	return date.Format(layout), true
}

func FormatDate(dateString string) time.Time {
	layout := "2006-01-02"
	date, err := time.Parse(layout, dateString)
	if err != nil {
		return date
	}

	return date
}

func CountRangeDate(stringDate1, stringDate2 string) int {
	layout := "2006-01-02"
	date1, _ := time.Parse(layout, stringDate1)
	date2, _ := time.Parse(layout, stringDate2)

	diff := date2.Sub(date1)
	days := int(diff.Hours() / 24)

	return days
}
