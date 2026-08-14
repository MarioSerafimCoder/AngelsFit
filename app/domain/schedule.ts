const WEEK_DAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export function resolveEffectiveSchedule(preferredDays: string[] | undefined, effectiveDays: number): string[] {
  const target = Math.min(7, Math.max(1, Math.round(effectiveDays || 3)));
  const preferred = [...new Set((preferredDays || []).filter((day) => WEEK_DAYS.includes(day)))];
  if (preferred.length === target) return preferred;
  if (preferred.length > target) {
    const selected: string[] = [];
    for (let index = 0; index < target; index += 1) selected.push(preferred[Math.floor(index * preferred.length / target)]);
    return [...new Set(selected)];
  }
  const selected = [...preferred];
  const candidates = WEEK_DAYS.slice(1).concat(WEEK_DAYS[0]).filter((day) => !selected.includes(day));
  while (selected.length < target && candidates.length) {
    const ranked = candidates.map((day) => {
      const dayIndex = WEEK_DAYS.indexOf(day);
      const distances = selected.length ? selected.map((other) => { const difference = Math.abs(dayIndex - WEEK_DAYS.indexOf(other)); return Math.min(difference, 7 - difference); }) : [3];
      return { day, distance: Math.min(...distances) };
    }).sort((left, right) => right.distance - left.distance || WEEK_DAYS.indexOf(left.day) - WEEK_DAYS.indexOf(right.day));
    const next = ranked[0]?.day;
    if (!next) break;
    selected.push(next);
    candidates.splice(candidates.indexOf(next), 1);
  }
  return selected.sort((left, right) => WEEK_DAYS.indexOf(left) - WEEK_DAYS.indexOf(right));
}

export function resolveSequenceSelection(sequenceOffset: number, postponed = false): { sequenceAdvance: number; action: "recommended" | "manually_advanced" } {
  if (postponed || sequenceOffset <= 0) return { sequenceAdvance: 1, action: "recommended" };
  return { sequenceAdvance: sequenceOffset + 1, action: "manually_advanced" };
}
