/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useEffect, useState } from "react";
import { getStationList } from "@/services/api/station";
import StasiunCard from "../features/card/StasiunCard";
import MonitoringSkeleton from "../features/skeleton/MonitoringSkeleton";
import { Button } from "../ui/button";
type Props = {
  cookie: string;
};

const ITEMS_PER_PAGE = 12;

export default function DashboardSection({ cookie }: Props) {
  const [stations, setStations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const result = await getStationList(cookie);
      if (Array.isArray(result.data)) {
        setStations(result.data);
      } else {
        setStations([]); // fallback supaya aman
      }
    } catch (error) {
      console.error("Failed to fetch station data", error);
    } finally {
      setLoading(false);
    }
  };

  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(stations.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentMachines = stations.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  useEffect(() => {
    fetchData();

    const interval = setInterval(() => {
      fetchData();
    }, 300000); // 5 minutes

    return () => clearInterval(interval);
  }, []);

  return (
    <section>
      <div className="grid w-full grid-cols-1 gap-5 py-6 md:grid-cols-2 xl:grid-cols-6">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <MonitoringSkeleton key={i} />
            ))
          : stations.map((station) => (
              <div
                key={station.id}
                className="animate-fade-in transition-all duration-500"
              >
                <StasiunCard
                  id={station.id_mesin}
                  lokasi={station.nama_dinas || "Lokasi tidak tersedia"}
                  value={station.status}
                  pressure={station.o2_tank || "-"}
                  flowCentral={station.flow_meter || "-"}
                  flowTabung={station.flow_meter2 || "-"}
                  flowTotal={station.total_flow || "-"}
                  purity={station.oxygen_purity || "-"}
                  running={station.running_time}
                />
              </div>
            ))}
      </div>
      {/* <div className="mt-6 flex justify-center space-x-2">
        <Button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
        >
          Prev
        </Button>
        <span className="rounded-lg bg-blue-600 px-4 py-2 text-white">
          {currentPage} / {totalPages}
        </span>
        <Button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
        >
          Next
        </Button>
      </div> */}

      {stations.length > ITEMS_PER_PAGE && (
        <div className="fixed bottom-0 left-0 flex w-full items-center justify-center space-x-4 border-t border-gray-200 bg-white/80 py-4 backdrop-blur">
          <Button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            Prev
          </Button>
          <span className="rounded-lg bg-blue-100 px-4 py-2 text-blue-800">
            {currentPage} / {totalPages}
          </span>
          <Button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </section>
  );
}
