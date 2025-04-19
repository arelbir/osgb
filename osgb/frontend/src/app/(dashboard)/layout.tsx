import { ReactNode, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authApi } from "@/lib/api";
import { toast } from "sonner";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // Fetch user profile on initial load to verify token
    const fetchProfile = async () => {
      try {
        await authApi.getProfile();
      } catch (error) {
        console.error("Error fetching profile:", error);
        // If there's an error, the interceptor will handle the logout
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    logout();
    toast.success("Başarıyla çıkış yapıldı");
    router.push("/auth/login");
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-slate-800">
            OSGB Yönetim Sistemi
          </Link>
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/avatar.png" alt={user?.full_name || "Kullanıcı"} />
                    <AvatarFallback>{user?.full_name?.charAt(0) || "K"}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.full_name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.username}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  Çıkış Yap
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-slate-800 text-white p-4 hidden md:block">
          <nav className="space-y-1">
            <Link
              href="/"
              className="block px-4 py-2 rounded-md hover:bg-slate-700 transition-colors"
            >
              Ana Sayfa
            </Link>
            <div className="pt-2">
              <div className="text-xs uppercase text-slate-400 px-4 py-2">
                Hasta Kayıt Kabul
              </div>
              <Link
                href="/patients"
                className="block px-4 py-2 rounded-md hover:bg-slate-700 transition-colors"
              >
                Hasta Listesi
              </Link>
              <Link
                href="/patients/new"
                className="block px-4 py-2 rounded-md hover:bg-slate-700 transition-colors"
              >
                Hasta Kayıt
              </Link>
              <Link
                href="/price-inquiry"
                className="block px-4 py-2 rounded-md hover:bg-slate-700 transition-colors"
              >
                Fiyat Sor
              </Link>
            </div>
            <div className="pt-2">
              <div className="text-xs uppercase text-slate-400 px-4 py-2">
                Laboratuvar İşlemleri
              </div>
              <Link
                href="/lab-results"
                className="block px-4 py-2 rounded-md hover:bg-slate-700 transition-colors"
              >
                Sonuç İşlemleri
              </Link>
              <Link
                href="/external-lab"
                className="block px-4 py-2 rounded-md hover:bg-slate-700 transition-colors"
              >
                Dış Lab Gönderim
              </Link>
              <Link
                href="/external-lab-tracking"
                className="block px-4 py-2 rounded-md hover:bg-slate-700 transition-colors"
              >
                Dış Lab İzlem
              </Link>
            </div>
            <div className="pt-2">
              <div className="text-xs uppercase text-slate-400 px-4 py-2">
                Ön Muhasebe
              </div>
              <Link
                href="/cash-report"
                className="block px-4 py-2 rounded-md hover:bg-slate-700 transition-colors"
              >
                Kasa Raporu
              </Link>
              <Link
                href="/debtor-patients"
                className="block px-4 py-2 rounded-md hover:bg-slate-700 transition-colors"
              >
                Borçlu Hastalar
              </Link>
            </div>
            <div className="pt-2">
              <div className="text-xs uppercase text-slate-400 px-4 py-2">
                İstatistikler
              </div>
              <Link
                href="/reports/daily"
                className="block px-4 py-2 rounded-md hover:bg-slate-700 transition-colors"
              >
                Gün Sonu Raporu
              </Link>
              <Link
                href="/reports/lab"
                className="block px-4 py-2 rounded-md hover:bg-slate-700 transition-colors"
              >
                Lab. Genel
              </Link>
            </div>
            <div className="pt-2">
              <div className="text-xs uppercase text-slate-400 px-4 py-2">
                Genel Ayarlar
              </div>
              <Link
                href="/settings/service-packages"
                className="block px-4 py-2 rounded-md hover:bg-slate-700 transition-colors"
              >
                Hizmet Paketleri
              </Link>
              <Link
                href="/settings/companies"
                className="block px-4 py-2 rounded-md hover:bg-slate-700 transition-colors"
              >
                Firma Tanımları
              </Link>
              <Link
                href="/settings/osgb"
                className="block px-4 py-2 rounded-md hover:bg-slate-700 transition-colors"
              >
                OSGB Tanımları
              </Link>
            </div>
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 p-6 bg-slate-50">{children}</main>
      </div>
    </div>
  );
}
