import Image from "next/image";
import Link from "next/link";
import { BeakerIcon } from "@heroicons/react/24/solid";
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";

type Props = {
  lokasi: string;
  id: string | number;
  pressure: string | number;
  flowTabung: string | number;
  flowCentral: string | number;
  flowTotal: string | number;
  running: string | number;
  purity: string | number;
  value: string | number;
};

export default function StasiunCard({
  lokasi,
  id,
  pressure,
  flowCentral,
  flowTabung,
  flowTotal,
  running,
  purity,
  value,
}: Props) {
  return (
    <Link href={`/monitoring/${id}`} data-testid="station-card">
      <div className="bg-card h-full w-full overflow-hidden rounded-lg px-5 py-2">
        <div className="flex items-center justify-between gap-5">
          <h2 className="line-clamp-1 text-lg font-semibold text-slate-100">
            {lokasi}
          </h2>
          <div className="h-5 w-5">
            {value != 0 ? (
              <ArrowUpCircle className=" text-green-500" />
            ) : (
              <ArrowDownCircle className="text-red-500" />
            )}
          </div>
        </div>
        <div className="flex items-center justify-between gap-5 text-slate-300">
          <p className="">{value != 0 ? "Running" : "Off"}</p>
          <p className=" text-end  ">{value != 0 ? running : "00"} H</p>
        </div>
        <div className="line-space mt-2"></div>
        <div className="space-y-1">
          <p className="text-slate-300">
            Purity : <span className="font-semibold">{purity}</span>{" "}
          </p>
          <p className="text-slate-300 ">
            O2 tank: <span className="font-semibold">{pressure}</span>
          </p>
          <p className="text-slate-300 ">
            Flow meter central :{" "}
            <span className="font-semibold">{flowCentral}</span>
          </p>
          <p className="text-slate-300 ">
            Flow meter tabung :{" "}
            <span className="font-semibold">{flowTabung}</span>
          </p>
          <p className="text-slate-300 ">
            Total flow : <span className="font-semibold">{flowTotal}</span>
          </p>
        </div>
      </div>
    </Link>
  );
}
