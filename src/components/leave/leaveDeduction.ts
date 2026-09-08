// MOVE-3777 §3.2 — how many leave days a period costs.
//
// This lives in its own module, below both `leaveData` and `leaveLogic`, for
// one reason: the mock dataset has to be able to compute its own `days` values.
// When those were hand-typed they were free to drift from the rule, which is
// the kind of mock data that quietly makes a prototype lie. Now the seed
// applications call the same function the apply drawer does, so a wrong number
// is not expressible.
//
// It takes `workingDaysPerWeek` rather than an employee so nothing here needs
// to know what an employee is — that is what keeps the import graph acyclic.

import dayjs, { type Dayjs } from 'dayjs'

export const ISO = 'YYYY-MM-DD'

/** MOVE-3777 §3.2 — each end of a range carries a half-day marker. */
export type HalfDay = 'AM' | 'PM'

export const LEAVE_PUBLIC_HOLIDAYS: { date: string; name: string }[] = [
  { date: '2025-01-01', name: "New Year's Day" },
  { date: '2025-08-09', name: 'National Day' },
  { date: '2025-12-25', name: 'Christmas Day' },
  { date: '2026-01-01', name: "New Year's Day" },
  { date: '2026-08-09', name: 'National Day' },
  { date: '2026-08-17', name: 'Independence Day' },
  { date: '2026-12-25', name: 'Christmas Day' },
  { date: '2027-01-01', name: "New Year's Day" },
  { date: '2027-08-09', name: 'National Day' },
  { date: '2027-12-25', name: 'Christmas Day' },
]

export const isPublicHoliday = (d: Dayjs) => LEAVE_PUBLIC_HOLIDAYS.some((h) => h.date === d.format(ISO))
export const isWeekendDay = (d: Dayjs) => d.day() === 0 || d.day() === 6

/**
 * How many leave days an application period costs.
 *
 * The rule forks on contracted working days per week. Under 5.5, only weekdays
 * count and public holidays are free. At 5.5 and above, weekends start costing:
 * a *consecutive* Sat+Sun pair costs one day, a lone weekend day costs nothing,
 * and any weekend pair containing a public holiday costs nothing.
 */
export function deductionDays(
  workingDaysPerWeek: number,
  startDate: string,
  endDate: string,
  startHalf: HalfDay,
  endHalf: HalfDay,
): number {
  const start = dayjs(startDate)
  const end = dayjs(endDate)
  if (end.isBefore(start)) return 0

  const sixDayWeek = workingDaysPerWeek >= 5.5

  let total = 0
  const weekendRun: Dayjs[] = []

  const flushWeekend = () => {
    if (!sixDayWeek || weekendRun.length === 0) {
      weekendRun.length = 0
      return
    }
    // Consecutive pairs cost a day each; a pair with a PH in it costs nothing,
    // and a trailing lone day costs nothing either.
    for (let i = 0; i + 1 < weekendRun.length; i += 2) {
      const a = weekendRun[i]
      const b = weekendRun[i + 1]
      if (!isPublicHoliday(a) && !isPublicHoliday(b)) total += 1
    }
    weekendRun.length = 0
  }

  for (let d = start; !d.isAfter(end); d = d.add(1, 'day')) {
    if (isWeekendDay(d)) {
      // Only a Sat immediately followed by a Sun is a "consecutive" pair.
      const prev = weekendRun[weekendRun.length - 1]
      if (prev && d.diff(prev, 'day') !== 1) flushWeekend()
      weekendRun.push(d)
      continue
    }
    flushWeekend()
    // MOVE-3777 — a weekday public holiday deducts nothing.
    if (isPublicHoliday(d)) continue
    total += 1
  }
  flushWeekend()

  // Half-day markers only ever trim weekdays, and only at the ends.
  if (start.isSame(end, 'day')) {
    if (!isWeekendDay(start) && !isPublicHoliday(start) && startHalf === endHalf) return 0.5
    return total
  }
  if (startHalf === 'PM' && !isWeekendDay(start) && !isPublicHoliday(start)) total -= 0.5
  if (endHalf === 'AM' && !isWeekendDay(end) && !isPublicHoliday(end)) total -= 0.5
  return Math.max(0, total)
}
