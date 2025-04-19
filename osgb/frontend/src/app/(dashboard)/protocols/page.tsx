import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState, useEffect } from "react";
import { protocolApi } from "@/lib/api";
import Link from "next/link";
import { toast } from "sonner";

export default function ProtocolList() {
  const [protocols, setProtocols] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState({
    start_date: "",
    end_date: "",
  });

  useEffect(() => {
    fetchProtocols();
  }, []);

  const fetchProtocols = async () => {
    setIsLoading(true);
    try {
      const params = {};
      if (dateFilter.start_date) params.start_date = dateFilter.start_date;
      if (dateFilter.end_date) params.end_date = dateFilter.end_date;
      
      const data = await protocolApi.getAll(params);
      setProtocols(data);
    } catch (error) {
      console.error("Error fetching protocols:", error);
      toast.error("Protokol listesi yüklenirken bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateFilterChange = (e) => {
    const { name, value } = e.target;
    setDateFilter(prev => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    fetchProtocols();
  };

  const resetFilters = () => {
    setDateFilter({
      start_date: "",
      end_date: "",
    });
    setSearchTerm("");
    fetchProtocols();
  };

  const filteredProtocols = protocols.filter((protocol) => {
    const patientName = `${protocol.patient?.first_name || ""} ${protocol.patient?.last_name || ""}`.toLowerCase();
    const protocolNumber = protocol.protocol_number?.toLowerCase() || "";
    
    return (
      patientName.includes(searchTerm.toLowerCase()) ||
      protocolNumber.includes(searchTerm.toLowerCase())
    );
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Protokoller</h1>
          <p className="text-muted-foreground">
            Sistemde kayıtlı tüm protokolleri görüntüleyin ve yönetin
          </p>
        </div>
        <Link href="/protocols/new">
          <Button>Yeni Protokol Oluştur</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Protokol Ara</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <Input
                placeholder="Protokol No veya Hasta Adı"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <Input
                type="date"
                name="start_date"
                placeholder="Başlangıç Tarihi"
                value={dateFilter.start_date}
                onChange={handleDateFilterChange}
              />
            </div>
            <div>
              <Input
                type="date"
                name="end_date"
                placeholder="Bitiş Tarihi"
                value={dateFilter.end_date}
                onChange={handleDateFilterChange}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={applyFilters}>Filtrele</Button>
              <Button variant="outline" onClick={resetFilters}>Sıfırla</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-24">
              <p>Yükleniyor...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Protokol No</TableHead>
                  <TableHead>Tarih</TableHead>
                  <TableHead>Hasta</TableHead>
                  <TableHead>Muayene Türü</TableHead>
                  <TableHead>Firma</TableHead>
                  <TableHead>Toplam Tutar</TableHead>
                  <TableHead>Ödenen</TableHead>
                  <TableHead>Durum</TableHead>
                  <TableHead>İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProtocols.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center">
                      Protokol bulunamadı
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProtocols.map((protocol) => (
                    <TableRow key={protocol.id}>
                      <TableCell>{protocol.protocol_number}</TableCell>
                      <TableCell>
                        {new Date(protocol.protocol_date).toLocaleDateString("tr-TR")}
                      </TableCell>
                      <TableCell>
                        {protocol.patient?.first_name} {protocol.patient?.last_name}
                      </TableCell>
                      <TableCell>{protocol.examination_type?.name}</TableCell>
                      <TableCell>{protocol.company?.name || "-"}</TableCell>
                      <TableCell>{formatCurrency(protocol.total_amount)}</TableCell>
                      <TableCell>{formatCurrency(protocol.paid_amount)}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          protocol.status === 'active' ? 'bg-green-100 text-green-800' :
                          protocol.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {protocol.status === 'active' ? 'Aktif' :
                           protocol.status === 'cancelled' ? 'İptal' : 'Beklemede'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Link href={`/protocols/${protocol.id}`}>
                            <Button variant="outline" size="sm">
                              Görüntüle
                            </Button>
                          </Link>
                          <Link href={`/protocols/${protocol.id}/edit`}>
                            <Button variant="outline" size="sm">
                              Düzenle
                            </Button>
                          </Link>
                          <Link href={`/payments/new?protocol_id=${protocol.id}`}>
                            <Button variant="outline" size="sm">
                              Ödeme Al
                            </Button>
                          </Link>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
