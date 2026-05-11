import { useEffect, useState } from "react";
import { getTripsByUserId } from "../utils/supabaseFunctions";
import type { TripsType } from "../types/trips";
import { TripCard } from "../components/TripCard";
import { Link, useNavigate } from "react-router-dom";

const user_id = "f1bdb7e9-102b-403a-9e7e-62801081d3a6";

export const Trips = () => {
  const [trips, setTrips] = useState<TripsType[]>();
  const navigate = useNavigate();
  useEffect(() => {
    const getTrips = async () => {
      try {
        const tripDatas = await getTripsByUserId(user_id);
        setTrips(tripDatas);
      } catch (e) {
        console.log(e);
      }
    };
    getTrips();
  }, []);

  return (
    <>
      <p>Trips</p>
      {trips?.map((trip) => {
        return (
          <Link to={`${trip.id}`} key={trip.id} state={trip.title}>
            <TripCard
              title={trip.title}
              start_date={trip.start_date}
              end_date={trip.end_date}
              is_completed={trip.is_completed}
            />
          </Link>
        );
      })}

      <button onClick={() => navigate("/trips/new")}>新しい旅行</button>
    </>
  );
};
