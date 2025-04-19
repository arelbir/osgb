import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { paymentApi, protocolApi } from "@/lib/api";
import Link from "next/link";
import { toast } from "sonner";

export default function CashReport() {
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState({
    start_date: "",
    end_date: "",
  });
  const [paymentTypeFilter, setPaymentTypeFilter] = useState("");

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    setIsLoading(true);
    try {
      const params = {};
      if (dateFilter.start_date) params.start_date = dateFilter.start_date;
      if (dateFilter.end_date) params.end_date = dateFilter.end_date;
      if (paymentTypeFilter) params.payment_type_id = paymentTypeFilter;
      
      const data = await paymentApi.getAll(params);
      setPayments(data);
    } catch (error) {
      console.error("Error fetching payments:", error);
      toast.error("Ödeme listesi yüklenirken bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateFilterChange = (e) => {
    const { name, value } = e.target;
    setDateFilter(prev => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    fetchPayments();
  };

  const resetFilters = () => {
    setDateFilter({
      start_date: "",
      end_date: "",
    });
    setSearchTerm("");
    setPaymentTypeFilter("");
    fetchPayments();
  };

  const filteredPayments = payments.filter((payment) => {
    const patientName = `${payment.protocol?.patient?.first_name || ""} ${payment.protocol?.patient?.last_name || ""}`.toLowerCase();
    const protocolNumber = payment.protocol?.protocol_number?.toLowerCase() || "";
    const receiptNumber = payment.receipt_number?.toLowerCase() || "";
    
    return (
      patientName.includes(searchTerm.toLowerCase()) ||
      protocolNumber.includes(searchTerm.toLowerCase()) ||
      receiptNumber.includes(searchTerm.toLowerCase())
    );
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount);
  };

  const calculateTotal = () => {
    return filteredPayments.reduce((total, payment) => total + Number(payment.amount), 0);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Kasa Raporu</h1>
        <p className="text-muted-foreground">
          Tahsilatları görüntüleyin ve yönetin
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ödeme Ara</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <Input
                placeholder="Protokol No, Fiş No veya Hasta Adı"
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Select
                value={paymentTypeFilter}
                onValueChange={setPaymentTypeFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Ödeme Türü" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tümü</SelectItem>
                  <SelectItem value="1">Nakit</SelectItem>
                  <SelectItem value="2">Kredi Kartı</SelectItem>
                  <SelectItem value="3">Havale/EFT</SelectItem>
                </SelectContent>
              </Select>
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
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tarih</TableHead>
                    <TableHead>Protokol No</TableHead>
                    <TableHead>Hasta</TableHead>
                    <TableHead>Fiş No</TableHead>
                    <TableHead>Ödeme Türü</TableHead>
                    <TableHead>Tutar</TableHead>
                    <TableHead>İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center">
                        Ödeme bulunamadı
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPayments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>
                          {new Date(payment.payment_date).toLocaleDateString("tr-TR")}
                        </TableCell>
                        <TableCell>{payment.protocol?.protocol_number}</TableCell>
                        <TableCell>
                          {payment.protocol?.patient?.first_name} {payment.protocol?.patient?.last_name}
                        </TableCell>
                        <TableCell>{payment.receipt_number || "-"}</TableCell>
                        <TableCell>{payment.payment_type?.name || "-"}</TableCell>
                        <TableCell>{formatCurrency(payment.amount)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Link href={`/payments/${payment.id}`}>
                              <Button variant="outline" size="sm">
                                Görüntüle
                              </Button>
                            </Link>
                            <Link href={`/payments/${payment.id}/edit`}>
                              <Button variant="outline" size="sm">
                                Düzenle
                              </Button>
                            </Link>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
              
              <div className="mt-6 flex justify-end">
                <Card className="w-64">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Toplam:</span>
                      <span className="font-bold text-lg">{formatCurrency(calculateTotal())}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
