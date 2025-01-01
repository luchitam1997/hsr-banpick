import { CreateForm } from "@/components/CreateForm";

export default function Home() {
  return (
    <main className="w-screen h-screen flex items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold text-primary">
          Welcome to Honkai Star Rail All Stars Championship
        </h1>
        <CreateForm />
      </div>
    </main>
  );
}
