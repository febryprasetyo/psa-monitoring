"use client";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";

export default function LimitPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <Select
      onValueChange={(e) => {
        const params = new URLSearchParams(searchParams as any);
        params.set("limit", e);
        router.replace(`${window.location.pathname}/?${params.toString()}`);
      }}
    >
      <SelectTrigger className="w-[100px]" data-testid="limit-per-page">
        <SelectValue placeholder={"10"} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value={"10"} data-testid="limit-10">
            10
          </SelectItem>
          <SelectItem value={"20"} defaultChecked>
            20
          </SelectItem>
          <SelectItem value={"50"}>50</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
