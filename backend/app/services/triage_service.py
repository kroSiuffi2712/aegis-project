class TriageService:

    def calculate_risk_score(self, triage_result):

        criticality = triage_result.get("criticality_level", 3)
        confidence = triage_result.get("confidence", 0.8)
        metrics = triage_result.get("critical_metrics", [])

        base_score_map = {
            1: 90,
            2: 75,
            3: 55,
            4: 35
        }

        base_score = base_score_map.get(criticality, 50)

        metrics_score = sum(
            metric.get("risk_delta", 0) * 10
            for metric in metrics
        )

        risk_score = (base_score + metrics_score) * confidence

        return round(min(risk_score, 100), 2)

    def generate_risk_projection(self, triage_result):

        metrics = triage_result.get("critical_metrics", [])

        # fallback
        if not metrics:
            metrics = [
                {"parameter": "General Condition", "risk_delta": 0.3},
                {"parameter": "Unknown Symptoms", "risk_delta": 0.2}
            ]
        print("METRICS USED:", metrics)
        projection = []

        for minute in [0, 5, 10]:

            factors = []

            for metric in metrics:

                base_level = metric.get("risk_delta", 0) * 5
                escalation = minute * 0.2

                level = min(base_level + escalation, 5)

                factors.append({
                    "parameter": metric.get("parameter"),
                    "level": round(level, 2)
                })

            projection.append({
                "minute": minute,
                "factors": factors
            })

        return projection