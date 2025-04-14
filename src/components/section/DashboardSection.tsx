"use client";
import { getStationList } from "@/services/api/station";
import { Suspense } from "react";
import StasiunCard from "../features/card/StasiunCard";
import CardSkeleton from "../features/skeleton/CardSkeleton";
import { useQuery } from "@tanstack/react-query";
import datas from "@/assets/station.json";
type Props = {
  cookie: string;
};

export default function DashboardSection({ cookie }: Props) {
  // const stationQuery = useQuery({
  //   queryKey: ["station"],
  //   queryFn: () => {
  //     return getStationList(cookie);
  //   },
  // });

  return (
    <section>
      {/* <h1 className="text-3xl font-semibold text-slate-100">List Stasiun</h1> */}
      <div className="grid w-full grid-cols-1 gap-5 py-6 md:grid-cols-2 xl:grid-cols-6">
        {/* {stationQuery?.data?.data?.values ? (
          stationQuery?.data.data.values.map((station: StationTableData) => {
            return (
              <Suspense fallback={<CardSkeleton />} key={station.id}> */}
        {datas.map((data) => (
          <StasiunCard
            key={data.id}
            value={data.value}
            lokasi={data.lokasi}
            id={data.id}
            pressure={data.pressure}
            flowCentral={data.flowCentral}
            flowTabung={data.flowTabung}
            flowTotal={data.flowTotal}
            purity={data.purity}
            running={data.running}
          ></StasiunCard>
        ))}
      </div>
    </section>
  );
}
