import { useMemo } from 'react';

export function useHabitRows(entries, statsData) {
  const habitRows = useMemo(() => {
    const scoredEntries = entries.filter(e => e.raw && e.raw.date);
    const len = scoredEntries.length;

    // --- 1. Reflection Consistency: % of last 14 days that have an entry ---
    const last14Days = Array.from({ length: 14 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toDateString();
    });
    const daysWithEntry = last14Days.filter(dayStr =>
      scoredEntries.some(e => new Date(e.raw.date).toDateString() === dayStr)
    ).length;
    const consistencyVal = Math.round((daysWithEntry / 14) * 100);
    const consistencyNote = len > 0 ? `${daysWithEntry} of last 14 days journaled` : 'No entries yet';

    // --- 2. Reflective Depth: avg word count vs 300-word daily goal ---
    const totalWords = statsData.totalWords;
    const avgWords = len > 0 ? Math.round(totalWords / len) : 0;
    const depthVal = Math.min(100, Math.round((avgWords / 300) * 100));
    const depthNote = len > 0 ? `Avg ${avgWords} words per entry (goal: 300)` : 'No data yet';

    // --- 3. Ritual Alignment: what % of entries were written at a consistent time of day ---
    const timeSlots = { Morning: 0, Afternoon: 0, Evening: 0, Night: 0 };
    scoredEntries.forEach(e => {
      const hour = new Date(e.raw.date).getHours();
      if (hour >= 5 && hour < 12) timeSlots.Morning++;
      else if (hour >= 12 && hour < 17) timeSlots.Afternoon++;
      else if (hour >= 17 && hour < 21) timeSlots.Evening++;
      else timeSlots.Night++;
    });
    const dominantSlot = len > 0 ? Object.entries(timeSlots).sort((a, b) => b[1] - a[1])[0] : null;
    const ritualVal = dominantSlot && len > 0 ? Math.round((dominantSlot[1] / len) * 100) : 0;
    const ritualNote = dominantSlot && len > 0
      ? `${dominantSlot[1]} of ${len} entries written in the ${dominantSlot[0]}`
      : 'No data yet';

    // --- 4. Weekly Goal Progress: entries this calendar week vs target of 4 ---
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    const thisWeekEntries = scoredEntries.filter(e => new Date(e.raw.date) >= startOfWeek).length;
    const weeklyGoal = 4;
    const weeklyVal = Math.min(100, Math.round((thisWeekEntries / weeklyGoal) * 100));
    const weeklyNote = len > 0 ? `${thisWeekEntries} of ${weeklyGoal} entries this week` : 'No data yet';

    return [
      ['Reflection Consistency', len > 0 ? consistencyVal : 0, consistencyNote, 'bg-sky-200'],
      ['Reflective Depth', len > 0 ? depthVal : 0, depthNote, 'bg-purple-200'],
      ['Ritual Alignment', len > 0 ? ritualVal : 0, ritualNote, 'bg-sprout'],
      ['Weekly Goal Progress', len > 0 ? weeklyVal : 0, weeklyNote, 'bg-canary']
    ];
  }, [entries, statsData]);

  return { habitRows };
}
