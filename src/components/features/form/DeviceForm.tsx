"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addDeviceList, editDeviceList } from "@/services/api/device";
import { useAuthStore } from "@/services/store";
import { getUserList } from "@/services/api/user";

const formSchema = z.object({
  id_mesin: z.string({ required_error: "ID Mesin harus diisi" }),
  dinas_id: z.string({ required_error: "Dinas ID harus diisi" }),
  manufacture: z.string({ required_error: "Dinas ID harus diisi" }),
});

type Props = {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  action: "add" | "edit";
  value?: DeviceTableData;
  cookie?: string;
};

export default function DeviceForm({
  setIsOpen,
  value,
  action,
  cookie,
}: Props) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id_mesin: value?.id_mesin?.toString() || "", // Default empty string if not available
      dinas_id: value?.dinas_id?.toString() || "", // Default empty string if not available
      manufacture: value?.manufacture?.toString() || "", // Default empty string if not available
    },
  });

  const accessToken = useAuthStore((state) => state?.user?.token?.access_token);
  const queryClient = useQueryClient();

  const DeviceMutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      if (action == "edit") {
        const res = await editDeviceList(
          value?.id || "",
          {
            ...data,
            dinas_id: Number(data.dinas_id),
            id_mesin: data.id_mesin,
          },
          accessToken as string,
        );
        return res;
      } else if (action == "add") {
        const res = await addDeviceList(
          { ...data, dinas_id: Number(data.dinas_id) },
          accessToken as string,
        );
        return res;
      }
    },

    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },

    onSuccess: () => {
      toast({
        title: "Berhasil",
        description:
          action === "edit" ? "Data berhasil diubah" : "Data berhasil ditambah",
        variant: "default",
      });
      form.reset();
      queryClient.invalidateQueries({
        queryKey: ["device"],
      });
    },
  });

  // if (isLoading) {
  //   return <div>Loading...</div>;
  // }

  // if (isError) {
  //   return <div>Error loading user list.</div>;
  // }

  // const dinasOptions = Array.isArray(userListData?.data?.values)
  //   ? userListData.data.values.map((user) => ({
  //       value: user.dinas_id,
  //       label: user.nama_dinas,
  //     }))
  //   : [];

  const onsubmit = (data: z.infer<typeof formSchema>) => {
    DeviceMutation.mutate(data);
    setIsOpen(false);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onsubmit)}
        className="flex flex-col items-end justify-center space-y-5"
      >
        <div className="w-full space-y-3">
          <FormField
            control={form.control}
            name="id_mesin"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>ID Mesin</FormLabel>
                <FormControl>
                  <Input placeholder="ID Mesin" type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dinas_id"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>ID Dinas</FormLabel>
                <FormControl>
                  <Input placeholder="Dinas_id" type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="manufacture"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Manufacture</FormLabel>
                <FormControl>
                  <Input placeholder="manufacture" type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex gap-3 pt-5">
          <Button
            className="w-44"
            variant="destructive"
            onClick={() => setIsOpen(false)}
          >
            Batal
          </Button>

          <Button type="submit" className="w-44">
            {action === "add" ? "Tambah Data" : "Edit Data"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
