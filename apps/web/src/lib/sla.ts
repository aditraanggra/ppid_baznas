import Holidays from 'date-holidays'
import { addDays, isWeekend, startOfDay } from 'date-fns'

const hd = new Holidays('ID') // Indonesian public holidays

/**
 * Check whether a given date is a working day in Indonesia.
 * Excludes: Saturdays, Sundays, and national holidays.
 */
export function isWorkingDay(date: Date): boolean {
  if (isWeekend(date)) return false
  const holiday = hd.isHoliday(date)
  return holiday === false
}

/**
 * Add N working days to a start date.
 * Skips weekends and Indonesian national holidays.
 *
 * @param startDate - The reference date (e.g. tanggalDiterima)
 * @param workingDays - Number of working days to add
 * @returns The resulting deadline date
 */
export function addWorkingDays(startDate: Date, workingDays: number): Date {
  let current = startOfDay(new Date(startDate))
  let added = 0

  while (added < workingDays) {
    current = addDays(current, 1)
    if (isWorkingDay(current)) {
      added++
    }
  }

  return current
}

/**
 * Calculate SLA deadline for a permohonan.
 * Base rule: 10 working days from tanggalDiterima (UU KIP No.14/2008 Pasal 22)
 */
export function calculateDeadline(tanggalDiterima: Date): Date {
  return addWorkingDays(tanggalDiterima, 10)
}

/**
 * Calculate extended deadline (perpanjangan).
 * Extension rule: +7 additional working days from original deadline.
 */
export function calculatePerpanjangan(originalDeadline: Date): Date {
  return addWorkingDays(originalDeadline, 7)
}

/**
 * Get SLA status for a permohonan.
 * Used to drive dashboard alerts and reminder emails.
 */
export type SLAStatus = 'aman' | 'mendekati' | 'hari_ini' | 'lewat'

export function getSLAStatus(deadline: Date): SLAStatus {
  const today  = startOfDay(new Date())
  const due    = startOfDay(deadline)
  const diffMs = due.getTime() - today.getTime()
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays < 0)  return 'lewat'
  if (diffDays === 0) return 'hari_ini'
  if (diffDays <= 2) return 'mendekati'   // H-2 trigger for reminder email
  return 'aman'
}
