import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface DashboardStats {
  todayPatients: number;
  todayServices: number;
  weekPatients: number;
  weekServices: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    todayPatients: 0,
    todayServices: 0,
    weekPatients: 0,
    weekServices: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [recentProtocols, setRecentProtocols] = useState([]);
  const [pendingResults, setPendingResults] = useState([]);

  useEffect(() => {
    // Fetch dashboard statistics
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // In a real implementation, we would fetch this data from the API
        // For now, we'll use mock data
        setTimeout(() => {
          setStats({
            todayPatients: 15,
            todayServices: 117,
            weekPatients: 2050,
            weekServices: 28330,
          });
          
          setRecentProtocols([
            {
              id: 1,
              protocol_number: 'P2025000001',
              patient: { first_name: 'Ahmet', last_name: 'Yılmaz' },
              examination_type: { name: 'İşe Giriş' },
              total_amount: 450
            },
            {
              id: 2,
              protocol_number: 'P2025000002',
              patient: { first_name: 'Ayşe', last_name: 'Demir' },
              examination_type: { name: 'Periyodik Muayene' },
              total_amount: 350
            },
            {
              id: 3,
              protocol_number: 'P2025000003',
              patient: { first_name: 'Mehmet', last_name: 'Kaya' },
              examination_type: { name: 'İşe Giriş' },
              total_amount: 450
            }
          ]);
          
          setPendingResults([
            { name: 'Hemogram', count: 12 },
            { name: 'Biyokimya', count: 8 },
            { name: 'İdrar', count: 5 },
            { name: 'Diğer', count: 3 }
          ]);
          
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast.error("Dashboard verileri yüklenirken bir hata oluştu");
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gösterge Paneli</h1>
        <p className="text-muted-foreground">
          OSGB Yönetim Sistemi istatistikleri ve özet bilgileri
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p>Yükleniyor...</p>
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Bugün Toplam Hasta</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.todayPatients}</div>
                <p className="text-xs text-muted-foreground">
                  Bugün kaydedilen toplam hasta sayısı
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Bugün Toplam Hizmet</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M8 6h13" />
                  <path d="M8 12h13" />
                  <path d="M8 18h13" />
                  <path d="M3 6h.01" />
                  <path d="M3 12h.01" />
                  <path d="M3 18h.01" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.todayServices}</div>
                <p className="text-xs text-muted-foreground">
                  Bugün verilen toplam hizmet sayısı
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Son 7 Gün Toplam Hasta</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <rect width="20" height="14" x="2" y="5" rx="2" />
                  <path d="M2 10h20" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.weekPatients}</div>
                <p className="text-xs text-muted-foreground">
                  Son 7 günde kaydedilen toplam hasta sayısı
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Son 7 Gün Toplam Hizmet</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.weekServices}</div>
                <p className="text-xs text-muted-foreground">
                  Son 7 günde verilen toplam hizmet sayısı
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Son Protokoller</CardTitle>
                <CardDescription>
                  Son 24 saat içinde oluşturulan protokoller
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <table className="w-full caption-bottom text-sm">
                    <thead className="[&_tr]:border-b">
                      <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                          Protokol No
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                          Hasta
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                          Muayene Türü
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                          Tutar
                        </th>
                      </tr>
                    </thead>
                    <tbody className="[&_tr:last-child]:border-0">
                      {recentProtocols.map((protocol) => (
                        <tr key={protocol.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                          <td className="p-4 align-middle">{protocol.protocol_number}</td>
                          <td className="p-4 align-middle">{protocol.patient.first_name} {protocol.patient.last_name}</td>
                          <td className="p-4 align-middle">{protocol.examination_type.name}</td>
                          <td className="p-4 align-middle">₺{protocol.total_amount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Bekleyen Sonuçlar</CardTitle>
                <CardDescription>
                  Onay bekleyen laboratuvar sonuçları
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {pendingResults.map((result, index) => (
                    <div key={index} className="flex items-center">
                      <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">{result.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {result.count} sonuç onay bekliyor
                        </p>
                      </div>
                      <div className="ml-auto font-medium">{result.count}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
