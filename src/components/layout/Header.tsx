"use client";
import { usePathname } from "next/navigation";
import logofastpec from "@/assets/img/FASTPEC OMS-white.png";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import ThemeToogle from "../features/theme/ThemeToogle";
import { useAuthStore, useExpandedStore } from "@/services/store";
import Image from "next/image";
import { Button } from "../ui/button";
import { ChevronsRightIcon } from "lucide-react";
import HeaderSkeleton from "../features/skeleton/HeaderSkeleton";

type Props = {};

export default function Header({}: Props) {
  const pathname = usePathname();
  const isExpanded = useExpandedStore((state: Expanded) => state.isExpanded);
  const setExpanded = useExpandedStore((state: Expanded) => state.setExpanded);

  const user = useAuthStore((state) => state?.user);

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
            className="bg-transparent text-slate-700 transition-all hover:bg-slate-100 hover:text-slate-700 dark:text-white dark:hover:bg-dark_accent"
            size="icon"
            onClick={() => {
              setExpanded(true);
            }}
          >
            <ChevronsRightIcon size={25} />
          </Button>
        ) : null}

        {user?.user_data?.username ? (
          <>
            <Image
              src={logofastpec}
              alt="FASTPEC OMS Logo"
              width={150}
              height={50}
            />
            {/* <div>
              <p className="text-slate-600 dark:text-slate-300">
                Selamat datang ,
              </p>
              <strong className="text-lg font-semibold text-slate-800 dark:text-white">
                {user?.user_data?.username}
              </strong>
            </div> */}
          </>
        ) : (
          <HeaderSkeleton />
        )}
      </div>
      <div className="flex gap-5">{/* <ThemeToogle /> */}</div>
    </header>
  );
}
