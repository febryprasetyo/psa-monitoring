"use client";
import { usePathname } from "next/navigation";
import logoMgm from "@/assets/img/logo-mgm.png";
import { useEffect, useState } from "react";
import { useAuthStore, useExpandedStore } from "@/services/store";
import Image from "next/image";
import { Button } from "../ui/button";
import { ChevronsRightIcon } from "lucide-react";
import HeaderSkeleton from "../features/skeleton/HeaderSkeleton";
import ThemeToogle from "../features/theme/ThemeToogle";

type Props = {};

export default function Header({}: Props) {
  const pathname = usePathname();
  const isExpanded = useExpandedStore((state: Expanded) => state.isExpanded);
  const setExpanded = useExpandedStore((state: Expanded) => state.setExpanded);

  const user = useAuthStore((state) => state?.user);
  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    if (pathname.includes("/monitoring")) {
      return;
    }

    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      );
    };

    updateTime(); // Set awal
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval); // Clear saat unmount
  }, [pathname]);

  if (pathname.includes("/monitoring")) {
    return null;
  }

  return (
    <header
      className={`flex w-full items-center justify-between px-5 py-5 transition-none sm:px-10 ${
        isExpanded ? "pl-20 sm:pl-24" : ""
      }`}
    >
      <div className="flex items-center gap-5">
        {!isExpanded ? (
          <Button
            className="bg-transparent text-slate-700 transition-all hover:bg-slate-100 hover:text-slate-700 dark:text-slate-700 dark:hover:bg-slate-100"
            size="icon"
            onClick={() => {
              setExpanded(true);
            }}
          >
            <ChevronsRightIcon size={25} />
          </Button>
        ) : null}

        {user?.user_data?.username ? (
          <div className="flex w-full items-center gap-5">
            <div className="flex-shrink-0">
              <Image
                src={logoMgm}
                alt="FASTPEC OMS Logo"
                width={150}
                height={50}
              />
            </div>
          </div>
        ) : (
          <HeaderSkeleton />
        )}
      </div>
      <div className="">
        <p className="text-center text-4xl font-extrabold text-blue-950">
          PSA MONITORING
        </p>
      </div>
      <div className="z-10 flex items-center gap-5">
        <p className="ttext-center text-2xl font-extrabold text-slate-700">
          {currentTime}
          {/* <ThemeToogle /> */}
        </p>
      </div>
    </header>
  );
}
