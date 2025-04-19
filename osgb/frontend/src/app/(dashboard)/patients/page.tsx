import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState, useEffect } from "react";
import { patientApi } from "@/lib/api";
import Link from "next/link";
import { toast } from "sonner";

export default function PatientList() {
  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    setIsLoading(true);
    try {
      const data = await patientApi.getAll();
      setPatients(data);
    } catch (error) {
      console.error("Error fetching patients:", error);
      toast.error("Hasta listesi yüklenirken bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPatients = patients.filter((patient) => {
    const fullName = `${patient.first_name} ${patient.last_name}`.toLowerCase();
    const tcNo = patient.tc_identity_number || "";
    return (
      fullName.includes(searchTerm.toLowerCase()) ||
      tcNo.includes(searchTerm)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Hasta Listesi</h1>
          <p className="text-muted-foreground">
            Sistemde kayıtlı tüm hastaları görüntüleyin ve yönetin
          </p>
        </div>
        <Link href="/patients/new">
          <Button>Yeni Hasta Ekle</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Hasta Ara</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input
              placeholder="TC Kimlik No veya Ad Soyad ile ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
            <Button variant="outline" onClick={fetchPatients}>
              Yenile
            </Button>
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
                  <TableHead>TC Kimlik No</TableHead>
                  <TableHead>Ad Soyad</TableHead>
                  <TableHead>Doğum Tarihi</TableHead>
                  <TableHead>Telefon</TableHead>
                  <TableHead>Firma</TableHead>
                  <TableHead>İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPatients.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      Hasta bulunamadı
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPatients.map((patient) => (
                    <TableRow key={patient.id}>
                      <TableCell>{patient.tc_identity_number || "-"}</TableCell>
                      <TableCell>
                        {patient.first_name} {patient.last_name}
                      </TableCell>
                      <TableCell>
                        {patient.birth_date
                          ? new Date(patient.birth_date).toLocaleDateString("tr-TR")
                          : "-"}
                      </TableCell>
                      <TableCell>{patient.mobile_phone || "-"}</TableCell>
                      <TableCell>
                        {patient.company ? patient.company.name : "-"}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Link href={`/patients/${patient.id}`}>
                            <Button variant="outline" size="sm">
                              Görüntüle
                            </Button>
                          </Link>
                          <Link href={`/patients/${patient.id}/edit`}>
                            <Button variant="outline" size="sm">
                              Düzenle
                            </Button>
                          </Link>
                          <Link href={`/protocols/new?patient_id=${patient.id}`}>
                            <Button variant="outline" size="sm">
                              Protokol Oluştur
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
