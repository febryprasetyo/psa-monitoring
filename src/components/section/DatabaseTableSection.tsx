"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getDatabaseList } from "@/services/api/database";
import { getStationList } from "@/services/api/station"; // Asumsi endpoint ini ada
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import LimitPage from "@/components/features/limitPage/LimitPage";
import { DatePicker } from "../features/form/DatePicker";
import { format, parseISO, subMonths } from "date-fns";
import { Button } from "../ui/button";
import { Trash } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import ExportForm from "../features/export/ExportForm";
import { ReusablePagination } from "../features/pagination";

type Props = {
  cookie: string;
  limit: string;
  page: string;
};

export default function DatabaseTableSection({ cookie, limit, page }: Props) {
  const today = new Date();
  const threeMonthsAgo = subMonths(today, 3);
  const [startDate, setStartDate] = useState<Date | undefined>(threeMonthsAgo);
  const [endDate, setEndDate] = useState<Date | undefined>(today);
  const [startHour, setStartHour] = useState<Date | undefined>(today);
  const [endHour, setEndHour] = useState<Date | undefined>(today);
  const [stationFilter, setStationFilter] = useState<string>("all");
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const dateQueryKey =
    startDate && endDate
      ? {
          startDate: format(parseISO(startDate.toISOString()), "yyyy-MM-dd"),
          endDate: format(parseISO(endDate.toISOString()), "yyyy-MM-dd"),
        }
      : null;

  const hourQueryKey =
    dateQueryKey && startHour && endHour ? { startHour, endHour } : null;

  const monitoringQuery = useQuery({
    queryKey: ["monitoring", cookie],
    queryFn: () => getStationList(cookie), // Harus return list nama_dinas + id_mesin
  });

  const dbQuery = useQuery({
    queryKey: [
      "database",
      {
        startDate: dateQueryKey?.startDate || null,
        endDate: dateQueryKey?.endDate || null,
        startHour: hourQueryKey?.startHour || null,
        endHour: hourQueryKey?.endHour || null,
        stationFilter,
        page,
        limit,
      },
    ],
    queryFn: () =>
      getDatabaseList({
        cookie,
        startHour,
        endHour,
        startDate,
        endDate,
        stationFilter: stationFilter === "all" ? "" : stationFilter, // Jika filter "all", kirimkan string kosong
        page,
        limit,
      }),
    refetchInterval: false,
  });

  const handleResetFilter = () => {
    setStartDate(threeMonthsAgo);
    setEndDate(today);
    setStartHour(undefined);
    setEndHour(undefined);
    setStationFilter("all");
  };

  console.log("dbQuery", dbQuery?.data?.data?.values);
  const totaldata = dbQuery?.data?.total ? parseInt(dbQuery?.data?.total) : 0;
  console.log(totaldata);
  return (
    <section className="space-y-5">
      <div className="flex w-full items-start justify-between">
        <h1 className="text-3xl font-semibold">History</h1>
        <div className="flex w-full flex-wrap-reverse items-end justify-end gap-5">
          <LimitPage />
          <Select
            value={stationFilter}
            onValueChange={(value: string) => setStationFilter(value)}
            defaultValue="all"
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Pilih Dinas" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">Semua Dinas</SelectItem>
                {monitoringQuery?.data?.data?.map(
                  (
                    item: { id_mesin: string; nama_dinas: string },
                    idx: number,
                  ) => (
                    <SelectItem key={idx} value={item.id_mesin}>
                      {item.nama_dinas}
                    </SelectItem>
                  ),
                )}
              </SelectGroup>
            </SelectContent>
          </Select>
          <ExportForm
            token={cookie}
            type="database"
            isOpen={isOpen}
            setIsOpen={setIsOpen}
          />
        </div>
      </div>

      <div className="flex flex-wrap justify-end gap-5">
        <div className="flex items-end">
          <Button
            variant="destructive"
            size="sm"
            onClick={handleResetFilter}
            data-testid="reset-filter"
          >
            <Trash className="mr-2 h-4 w-4" />
            Clear Filter
          </Button>
        </div>
        <div className="w-[280px]">
          <DatePicker
            date={startDate}
            setDate={setStartDate}
            placeholder="Tanggal Awal"
            label="Dari :"
            hour={startHour}
            setHour={setStartHour}
          />
        </div>
        <div className="w-[280px]">
          <DatePicker
            date={endDate}
            setDate={setEndDate}
            placeholder="Tanggal Akhir"
            label="Sampai :"
            hour={endHour}
            setHour={setEndHour}
          />
        </div>
      </div>

      <div className="rounded-xl bg-white p-5 shadow ">
        {dbQuery?.isLoading && (
          <div className="flex h-[400px] animate-pulse items-center justify-center">
            <p className="text-lg">Memuat data...</p>
          </div>
        )}
        {dbQuery?.data?.success && (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>No</TableHead>
                  <TableHead>ID Mesin</TableHead>
                  <TableHead>Nama Dinas</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Oxygen Purity</TableHead>
                  <TableHead>O2 Tank</TableHead>
                  <TableHead>Flow Meter</TableHead>
                  <TableHead>Flow Meter 2</TableHead>
                  <TableHead>Total Flow</TableHead>
                  <TableHead>Running Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.isArray(dbQuery?.data?.data?.values) &&
                  dbQuery?.data?.data?.values.map((row: any, index: number) => (
                    <TableRow key={index}>
                      <TableCell>
                        {(parseInt(page) - 1) * parseInt(limit) + index + 1}
                      </TableCell>
                      <TableCell>{row.id_mesin}</TableCell>
                      <TableCell>{row.nama_dinas}</TableCell>
                      <TableCell>
                        {format(
                          parseISO(row.waktu_mesin),
                          "dd/MM/yyyy HH:mm:ss",
                        )}
                      </TableCell>
                      <TableCell>{row.oxygen_purity ?? "-"}</TableCell>
                      <TableCell>{row.o2_tank ?? "-"}</TableCell>
                      <TableCell>{row.flow_meter ?? "-"}</TableCell>
                      <TableCell>{row.flow_meter2 ?? "-"}</TableCell>
                      <TableCell>{row.total_flow ?? "-"}</TableCell>
                      <TableCell>{row.running_time ?? "-"}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            <div className="mt-5">
              <ReusablePagination
                currentPage={parseInt(page)}
                totalData={Number(dbQuery?.data?.total)}
                limit={parseInt(limit)}
              />
            </div>
          </>
        )}
        {!dbQuery?.data?.success && !dbQuery?.isLoading && (
          <div className="flex h-[400px] items-center justify-center">
            <p className="text-red-500">
              Gagal memuat data: {dbQuery?.error?.message || "Network Error"}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
