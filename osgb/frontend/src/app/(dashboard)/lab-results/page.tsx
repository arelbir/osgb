import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { labResultApi } from "@/lib/api";
import Link from "next/link";
import { toast } from "sonner";

export default function LabResults() {
  const [labResults, setLabResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState({
    start_date: "",
    end_date: "",
  });

  useEffect(() => {
    fetchLabResults();
  }, []);

  const fetchLabResults = async () => {
    setIsLoading(true);
    try {
      const params = {};
      if (statusFilter !== "all") params.status = statusFilter;
      if (dateFilter.start_date) params.start_date = dateFilter.start_date;
      if (dateFilter.end_date) params.end_date = dateFilter.end_date;
      
      const data = await labResultApi.getAll(params);
      setLabResults(data);
    } catch (error) {
      console.error("Error fetching lab results:", error);
      toast.error("Laboratuvar sonuçları yüklenirken bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateFilterChange = (e) => {
    const { name, value } = e.target;
    setDateFilter(prev => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    fetchLabResults();
  };

  const resetFilters = () => {
    setDateFilter({
      start_date: "",
      end_date: "",
    });
    setSearchTerm("");
    setStatusFilter("all");
    fetchLabResults();
  };

  const handleAcceptSample = async (id) => {
    try {
      await labResultApi.acceptSample(id);
      toast.success("Numune kabul edildi");
      fetchLabResults();
    } catch (error) {
      console.error("Error accepting sample:", error);
      toast.error("Numune kabul edilirken bir hata oluştu");
    }
  };

  const handleApproveSample = async (id) => {
    try {
      await labResultApi.approveSample(id);
      toast.success("Sonuç onaylandı");
      fetchLabResults();
    } catch (error) {
      console.error("Error approving sample:", error);
      toast.error("Sonuç onaylanırken bir hata oluştu");
    }
  };

  const filteredLabResults = labResults.filter((result) => {
    const patientName = `${result.protocol?.patient?.first_name || ""} ${result.protocol?.patient?.last_name || ""}`.toLowerCase();
    const protocolNumber = result.protocol?.protocol_number?.toLowerCase() || "";
    
    return (
      patientName.includes(searchTerm.toLowerCase()) ||
      protocolNumber.includes(searchTerm.toLowerCase())
    );
  });

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Beklemede';
      case 'accepted': return 'Kabul Edildi';
      case 'rejected': return 'Reddedildi';
      case 'in_progress': return 'İşlemde';
      case 'completed': return 'Tamamlandı';
      case 'approved': return 'Onaylandı';
      default: return status;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-blue-100 text-blue-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'in_progress': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'approved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Laboratuvar Sonuçları</h1>
        <p className="text-muted-foreground">
          Laboratuvar sonuçlarını görüntüleyin ve yönetin
        </p>
      </div>

      <Tabs defaultValue="all" onValueChange={setStatusFilter}>
        <TabsList className="grid grid-cols-5 w-full max-w-md">
          <TabsTrigger value="all">Tümü</TabsTrigger>
          <TabsTrigger value="pending">Bekleyen</TabsTrigger>
          <TabsTrigger value="accepted">Kabul Edilen</TabsTrigger>
          <TabsTrigger value="completed">Tamamlanan</TabsTrigger>
          <TabsTrigger value="approved">Onaylanan</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Sonuç Ara</CardTitle>
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
                  <TableHead>Hasta</TableHead>
                  <TableHead>Tarih</TableHead>
                  <TableHead>Test</TableHead>
                  <TableHead>Durum</TableHead>
                  <TableHead>İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLabResults.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      Sonuç bulunamadı
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLabResults.map((result) => (
                    <TableRow key={result.id}>
                      <TableCell>{result.protocol?.protocol_number}</TableCell>
                      <TableCell>
                        {result.protocol?.patient?.first_name} {result.protocol?.patient?.last_name}
                      </TableCell>
                      <TableCell>
                        {new Date(result.created_at).toLocaleDateString("tr-TR")}
                      </TableCell>
                      <TableCell>{result.test_name}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusClass(result.status)}`}>
                          {getStatusText(result.status)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Link href={`/lab-results/${result.id}`}>
                            <Button variant="outline" size="sm">
                              Görüntüle
                            </Button>
                          </Link>
                          {result.status === 'pending' && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleAcceptSample(result.id)}
                            >
                              Kabul Et
                            </Button>
                          )}
                          {result.status === 'completed' && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleApproveSample(result.id)}
                            >
                              Onayla
                            </Button>
                          )}
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
