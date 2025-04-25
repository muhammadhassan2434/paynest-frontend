import { useQuery, QueryKey, QueryFunction } from "@tanstack/react-query";

type Service = {
  id: number;
  name: string;
  logo: string;
  status: string;
  created_at: string;
  updated_at: string;
};

const useFetchServices = (
  queryKey: QueryKey,
  queryFn: QueryFunction<Service[]>
) => {
  return useQuery<Service[]>({
    queryKey,
    queryFn,
    onSuccess: (response: Service[]) => {
      console.log("Fetched services:", response);
    },
    onError: (error: unknown) => {
      console.error(`Error fetching ${String(queryKey)}:`, error);
    },
  });
};

export default useFetchServices;
