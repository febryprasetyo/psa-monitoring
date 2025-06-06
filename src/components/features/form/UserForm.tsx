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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addUserList, editUserList } from "@/services/api/user";
import { useAuthStore } from "@/services/store";

const formSchema = z.object({
  username: z.string({
    required_error: "Username harus diisi",
  }),
  password: z.string({
    required_error: "Password harus diisi",
  }),
  nama_dinas: z.string({
    required_error: "Nama Dinas harus diisi",
  }),
  alamat: z.string({
    required_error: "Alamat Key harus diisi",
  }),
});

type props = {
  setIsOpen: Function;
  action: "edit" | "add";
  value?: UserTableData;
};

export default function UserForm({ setIsOpen, action, value }: props) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: value?.username,
      alamat: value?.alamat || "",
      nama_dinas: value?.nama_dinas || "",
      password: value?.password || "",
    },
  });

  const accessToken = useAuthStore((state) => state?.user?.token?.access_token);

  const queryClient = useQueryClient();

  const addStationMutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      if (action === "edit") {
        return await editUserList(
          { id: value?.id || "", ...data },
          accessToken as string,
        );
      } else if (action === "add") {
        return await addUserList(data, accessToken as string);
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
          action === "edit"
            ? "Data berhasil diubah"
            : "Data berhasil ditambahkan",
        variant: "default",
      });
      form.reset();
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["user"],
      });
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    addStationMutation.mutate(values);
    setIsOpen(false);
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col items-end justify-center space-y-5"
      >
        <div className="w-full space-y-3">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Masukan Username..." />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    {...field}
                    placeholder="Masukan Password..."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="nama_dinas"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Nama Dinas</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Masukan Nama Dinss..." />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="alamat"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Alamat</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Masukan Alamat..." />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* <FormField
            control={form.control}
            name="secret_key"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Secret Key</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Masukan Secret Key..." />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}
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
            {action == "add" ? "Tambah Data" : "Edit Data"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
