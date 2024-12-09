import { MainNav } from "@/components/navigation/MainNav";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      <MainNav />

      {children}
    </main>
  );
}
