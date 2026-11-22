import { useContext } from "react";
import { flightDataContext } from "./flightDataContext";

export function useFlights() {
  const flightData = useContext(flightDataContext);
  if (!flightData) throw new Error("useFlights must be used inside FlightDataProvider.");
  return flightData;
}