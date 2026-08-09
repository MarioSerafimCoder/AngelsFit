export type RestProfile = {
  goal: string;
  experience: string;
  limitations: string;
};

export function defaultRestSeconds(profile: RestProfile, safetyCodes: string[] = []) {
  const beginner = profile.experience === "Iniciante" || profile.goal === "Retorno aos treinos";
  const trainedWithoutLimitations = !beginner && safetyCodes.length === 0 && !profile.limitations.trim();
  if (trainedWithoutLimitations) return 30;
  if (profile.goal === "Força") return beginner ? 90 : 150;
  if (profile.goal === "Condicionamento") return beginner ? 60 : 45;
  if (profile.goal === "Mobilidade") return 40;
  if (profile.goal === "Retorno aos treinos") return 75;
  return beginner ? 75 : 90;
}
