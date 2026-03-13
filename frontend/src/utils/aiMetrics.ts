export const calculateEffectiveness = (
  reliability: number,
  confidence: number,
  operationalRiskIndex: number
): number => {
  return (
    reliability * 0.5 +
    confidence * 0.3 +
    (1 - operationalRiskIndex) * 0.2
  );
};