"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { saveAs } from "file-saver";
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
import { Download, Trash } from "lucide-react";
import { toast } from "../ui/use-toast";
import { getStationList } from "@/services/api/station";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { exportHistory, getHistoryList } from "@/services/api/history";
import { ReusablePagination } from "../features/pagination";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import ExportForm from "../features/export/ExportForm";

type Props = {
  cookie: string;
  searchParams: {
    page?: string;
    limit?: string;
  };
};

export default function HistorySection({ cookie, searchParams }: Props) {
  const today = new Date();
  const threeMonthsAgo = subMonths(today, 3);
  const [startDate, setStartDate] = useState<Date | undefined>(threeMonthsAgo);
  const [endDate, setEndDate] = useState<Date | undefined>(today);
  const [startHour, setStartHour] = useState<Date | undefined>(today);
  const [endHour, setEndHour] = useState<Date | undefined>(today);
  const [stationFilter, setStationFilter] = useState<string>("all");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const page = searchParams?.page || "1";
  const limit = searchParams?.limit || "10";

  const dateQueryKey =
    startDate && endDate
      ? {
          startDate: format(parseISO(startDate.toISOString()), "yyyy-MM-dd"),
          endDate: format(parseISO(endDate.toISOString()), "yyyy-MM-dd"),
        }
      : null;
  const hourQueryKey =
    dateQueryKey && startHour && endHour ? { startHour, endHour } : null;

  const dbQuery = useQuery({
    queryKey: [
      "history",
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
    queryFn: () => {
      return getHistoryList({
        cookie,
        startHour,
        endHour,
        startDate,
        endDate,
        stationFilter,
        page,
        limit,
      });
    },
    refetchInterval: false,
  });

  const stationQuery = useQuery({
    queryKey: ["station"],
    queryFn: () => {
      return getStationList(cookie);
    },
  });

  const handleResetFilter = () => {
    setStartDate(threeMonthsAgo);
    setEndDate(today);
    setStartHour(undefined);
    setEndHour(undefined);
    setStationFilter("all");
  };

  return (
    <section className="space-y-5">
      <div className="flex w-full items-start justify-between">
        <h1 className="text-3xl font-semibold">History</h1>
        <div className="flex w-full flex-wrap-reverse items-end justify-end gap-5">
          <LimitPage />
          <Select
            value={stationFilter}
            onValueChange={(value: string) => {
              setStationFilter(value);
            }}
            defaultValue="all"
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Pilih Stasiun" />
            </SelectTrigger>
            {/* <SelectContent>
              <SelectGroup>
                <SelectItem value="all" defaultChecked>
                  Semua Stasiun
                </SelectItem>
                {stationQuery?.data?.data?.values.map(
                  (item: { nama_stasiun: string }, index: number) => (
                    <SelectItem key={index} value={item.nama_stasiun}>
                      {item.nama_stasiun}
                    </SelectItem>
                  ),
                )}
              </SelectGroup>
            </SelectContent> */}
          </Select>
          <ExportForm
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            token={cookie}
            type="history"
          />
        </div>
      </div>
      <div className="flex flex-wrap justify-end gap-5">
        <div className="flex items-end">
          <Button variant="destructive" size="sm" onClick={handleResetFilter}>
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
      {/* <div className="rounded-xl bg-white p-5 shadow dark:bg-darkSecondary">
        {dbQuery?.data?.success && (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>No</TableHead>
                  <TableHead className="min-w-[180px]">Nama Stasiun</TableHead>
                  <TableHead className="min-w-[150px]">Tanggal</TableHead>
                  <TableHead>Jam</TableHead>
                  <TableHead className="min-w-[100px]">Suhu</TableHead>
                  <TableHead>DO</TableHead>
                  <TableHead>Tur</TableHead>
                  <TableHead>CT</TableHead>
                  <TableHead>PH</TableHead>
                  <TableHead>ORP</TableHead>
                  <TableHead>BOD</TableHead>
                  <TableHead>COD</TableHead>
                  <TableHead>TSS</TableHead>
                  <TableHead>N</TableHead>
                  <TableHead>NO3 3</TableHead>
                  <TableHead>NO2</TableHead>
                  <TableHead>Depth</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dbQuery?.data?.data?.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      {" "}
                      {page == "1"
                        ? index + 1
                        : (parseInt(page) - 1) * parseInt(limit) + (index + 1)}
                    </TableCell>
                    <TableCell>{item.nama_stasiun}</TableCell>
                    <TableCell>{format(item.time, "yyyy-MM-dd")}</TableCell>
                    <TableCell>{format(item.time, "HH:mm")}</TableCell>
                    <TableCell>{item.temperature}</TableCell>
                    <TableCell>{item.do_}</TableCell>
                    <TableCell>{item.tur}</TableCell>
                    <TableCell>{item.ct}</TableCell>
                    <TableCell>{item.ph}</TableCell>
                    <TableCell>{item.orp}</TableCell>
                    <TableCell>{item.bod}</TableCell>
                    <TableCell>{item.cod}</TableCell>
                    <TableCell>{item.tss}</TableCell>
                    <TableCell>{item.n}</TableCell>
                    <TableCell>{item.no3_3}</TableCell>
                    <TableCell>{item.no2}</TableCell>
                    <TableCell>{item.depth}</TableCell>
                  </TableRow>
                )) ?? <></>}
              </TableBody>
            </Table>
            <div className="overflow-auto " id="pagination">
              <ReusablePagination
                currentPage={parseInt(page)}
                limit={parseInt(limit)}
                totalData={parseInt(dbQuery?.data?.totalData)}
              />
            </div>
          </>
        )}
        {dbQuery?.isPending && (
          <div className="flex h-[400px] animate-pulse items-center justify-center">
            <p className="text-lg">Memuat data...</p>
          </div>
        )}
        {!dbQuery?.data?.success && !dbQuery?.isPending && (
          <div className="flex h-[400px] items-center justify-center">
            <p className="text-red-500">
              Gagal memuat data: {dbQuery?.error?.message || "Network Error"} ,
              Coba muat ulang halaman
            </p>
          </div>
        )}
      </div> */}
    </section>
  );
}
