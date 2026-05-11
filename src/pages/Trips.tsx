import { useEffect, useState } from "react";
import { getTripsByUserId } from "../utils/supabaseFunctions";
import type { TripsType } from "../types/trips";
import { TripCard } from "../components/TripCard";
import { Link, useNavigate } from "react-router-dom";
import { Footer } from "../components/Footer";
import { supabase } from "../utils/supabase";
import type { User } from "@supabase/supabase-js";
import { SignOut } from "../components/SignOut";

export const Trips = () => {
  const [user, setUser] = useState<User | null>(null);
  const [trips, setTrips] = useState<TripsType[]>();
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      try {
        if (data.user) {
          const tripDatas = await getTripsByUserId(data.user?.id);
          setTrips(tripDatas);
        }
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <p>loading...</p>;

  return (
    <>
      <div>
        <p>Trips</p>
        <p>ログイン中のユーザー：{user?.email}</p>
      </div>
      {trips?.map((trip) => {
        return (
          <Link
            to={`${trip.id}`}
            key={trip.id}
            state={{ title: trip.title, is_completed: trip.is_completed }}
          >
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
      <SignOut />
      <Footer />
    </>
  );
};
