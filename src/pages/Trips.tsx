import { useEffect, useState } from "react";
import { getTripsByUserId } from "../utils/supabaseFunctions";
import type { TripsType } from "../types/trips";
import { TripCard } from "../components/TripCard";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabase";
import { Box, Button, Flex, Heading, Spinner, Stack } from "@chakra-ui/react";

export const Trips = () => {
  const [trips, setTrips] = useState<TripsType[]>();
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data } = await supabase.auth.getUser();

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

  if (loading) {
    return (
      <Flex justify="center" align="center" minH="50vh">
        <Spinner size="xl" color="blue.500" />
      </Flex>
    );
  }

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={6}>
        <Box>
          <Heading size="xl" mb={2}>
            Trips
          </Heading>
        </Box>
        <Stack direction="row" gap={4}>
          <Button colorPalette="blue" onClick={() => navigate("/trips/new")}>
            新しい旅行
          </Button>
        </Stack>
      </Flex>

      <Stack gap={4} mb={8}>
        {trips?.map((trip) => {
          return (
            <Box
              asChild
              key={trip.id}
              display="block"
              _hover={{ textDecor: "none" }}
            >
              <Link
                to={`/trips/${trip.id}`}
                state={{ title: trip.title, is_completed: trip.is_completed }}
              >
                <TripCard
                  title={trip.title}
                  start_date={trip.start_date}
                  end_date={trip.end_date}
                  is_completed={trip.is_completed}
                />
              </Link>
            </Box>
          );
        })}
      </Stack>
    </Box>
  );
};
