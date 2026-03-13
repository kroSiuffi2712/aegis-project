# app/schemas/route_matrix.py

from pydantic import BaseModel


class RouteSummary(BaseModel):
    lengthInMeters: int
    travelTimeInSeconds: int
    trafficDelayInSeconds: int


class RouteResponse(BaseModel):
    routeSummary: RouteSummary


class MatrixCell(BaseModel):
    statusCode: int
    response: RouteResponse


class MatrixResult(BaseModel):
    matrix: list[list[MatrixCell]]