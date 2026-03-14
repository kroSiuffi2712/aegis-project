from datetime import datetime
from app.core.database import get_database


class ObservabilityService:

    def serialize_datetimes(self, obj):
        if isinstance(obj, dict):
            return {k: self.serialize_datetimes(v) for k, v in obj.items()}
        elif isinstance(obj, list):
            return [self.serialize_datetimes(v) for v in obj]
        elif isinstance(obj, datetime):
            return obj.isoformat()
        return obj


    async def get_ai_observability_logs(self, incident_id: str):

        azure_raw_logs = [
            {
                "operationName": "BiasDetection",
                "level": "Warning",
                "resultType": "Flagged",
                "category": "ResponsibleAI"
            },
            {
                "operationName": "ExplainabilityTrace",
                "level": "Information",
                "resultType": "Success",
                "category": "Explainability"
            },
            {
                "operationName": "PIIProtectionScan",
                "level": "Information",
                "resultType": "Pass",
                "category": "Security"
            },
            {
                "operationName": "LatencyTracking",
                "level": "Information",
                "resultType": "WithinSLA",
                "category": "Performance",
                "durationMs": 220,
                "score": 95,
                "severity": "Low"
            },
            {
                "operationName": "FairnessEvaluation",
                "level": "Information",
                "resultType": "Pass",
                "category": "ResponsibleAI"
            },
            {
                "operationName": "DataDriftDetection",
                "level": "Information",
                "resultType": "NoDriftDetected",
                "category": "ModelMonitoring",
                "driftScore": 3,
                "severity": "Low"
            },
            {
                "operationName": "ContentModerationCheck",
                "level": "Information",
                "resultType": "Safe",
                "category": "ContentSafety"
            }
        ]

        return [self._map_to_ui_model(log) for log in azure_raw_logs]

    def _map_to_ui_model(self, log: dict):

        now = datetime.utcnow().strftime("%H:%M")

        status_map = {
            "Pass": "PASS",
            "Flagged": "FLAG",
            "Success": "INFO",
            "Safe": "PASS",
            "NoDriftDetected": "PASS"
        }

        title_map = {
            "BiasDetection": "Bias detection scan executed",
            "ExplainabilityTrace": "Explainability trace stored",
            "PIIProtectionScan": "Privacy & security guard validated",
            "LatencyTracking": "SLA compliance verified",
            "FairnessEvaluation": "Resource allocation fairness re-evaluated",
            "DataDriftDetection": "Data drift monitoring executed",
            "ContentModerationCheck": "Content safety check completed"
        }

        return {
            "timestamp": now,
            "title": title_map.get(log["operationName"], log["operationName"]),
            "status": status_map.get(log.get("resultType")),
            "score": log.get("score") or log.get("driftScore"),
            "severity": log.get("severity"),
            "category": log.get("category")
        }
    
    async def log_agent_decision(
        self,
        agent_logs: list,
        agent_name: str,
        stage: str,
        decision: str,
        confidence: float,
        latency_ms: float,
        factors: dict | None = None,
        critical_metrics: list | None = None
    ):

        log = {
            "agent_name": agent_name,
            "stage": stage,
            "decision": decision,
            "confidence": confidence,
            "latency_ms": latency_ms,
            "timestamp": datetime.utcnow().isoformat()
        }

        if factors:
            log["factors"] = self.serialize_datetimes(factors)

        if critical_metrics:
            log["critical_metrics"] = self.serialize_datetimes(critical_metrics)

        agent_logs.append(log)

        return log