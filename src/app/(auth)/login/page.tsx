import Image from "next/image";
import MgmLogo from "@/assets/img/logo-mgm.png";
import LoginForm from "@/components/features/form/LoginForm";

export default function Login() {
  return (
    <main className="flex min-h-screen w-full items-center justify-center overflow-x-hidden bg-white  lg:grid lg:grid-cols-2">
      <section className="col-end-2 w-full space-y-8 px-10 py-10 sm:px-20 lg:col-start-1">
        <div className="mx-auto mb-6 w-fit rounded-xl px-3 py-2">
          <Image
            src={MgmLogo}
            alt="Fastpect logo"
            className="= w-[150px] sm:w-[200px]"
          />
        </div>
        <div className="space-y-2 text-center">
          <h1 className="text-4xl font-semibold text-slate-800 ">
            Selamat datang
          </h1>
          <p className="text-base text-slate-600 ">
            Silahkan login untuk melanjutkan
          </p>
        </div>
        <LoginForm />
      </section>
      <section className="bg-login hidden h-screen w-full bg-slate-500 lg:col-start-2 lg:col-end-3 lg:flex"></section>
    </main>
  );
}
