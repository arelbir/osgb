import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { patientApi, protocolApi } from "@/lib/api";
import { toast } from "sonner";

export default function NewProtocol() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [patients, setPatients] = useState([]);
  const [examinationTypes, setExaminationTypes] = useState([
    { id: 1, name: "İşe Giriş Muayenesi" },
    { id: 2, name: "Periyodik Muayene" },
    { id: 3, name: "İş Dönüş Muayenesi" },
    { id: 4, name: "Genel Sağlık Kontrolü" }
  ]);
  const [services, setServices] = useState([
    { id: 1, name: "Hemogram", price: 50 },
    { id: 2, name: "Biyokimya", price: 120 },
    { id: 3, name: "İdrar Tahlili", price: 40 },
    { id: 4, name: "Akciğer Grafisi", price: 80 },
    { id: 5, name: "EKG", price: 60 },
    { id: 6, name: "Odyometri", price: 70 },
    { id: 7, name: "Solunum Fonksiyon Testi", price: 90 }
  ]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    patient_id: "",
    examination_type_id: "",
    company_id: "",
    protocol_date: new Date().toISOString().split('T')[0],
    receipt_number: "",
    ledger_number: "",
    total_amount: 0,
    discount_amount: 0,
    services: []
  });

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    // Calculate total amount based on selected services
    const total = selectedServices.reduce((sum, service) => sum + Number(service.price), 0);
    setFormData(prev => ({ ...prev, total_amount: total }));
  }, [selectedServices]);

  const fetchPatients = async () => {
    try {
      const data = await patientApi.getAll();
      setPatients(data);
    } catch (error) {
      console.error("Error fetching patients:", error);
      toast.error("Hasta listesi yüklenirken bir hata oluştu");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));

    // If patient is selected, set company from patient data
    if (name === "patient_id") {
      const patient = patients.find(p => p.id.toString() === value);
      if (patient && patient.company_id) {
        setFormData(prev => ({ ...prev, company_id: patient.company_id.toString() }));
      } else {
        setFormData(prev => ({ ...prev, company_id: "" }));
      }
    }
  };

  const handleAddService = (service) => {
    if (!selectedServices.some(s => s.id === service.id)) {
      setSelectedServices(prev => [...prev, { ...service, price: service.price }]);
    }
  };

  const handleRemoveService = (serviceId) => {
    setSelectedServices(prev => prev.filter(service => service.id !== serviceId));
  };

  const handleServicePriceChange = (serviceId, price) => {
    setSelectedServices(prev => 
      prev.map(service => 
        service.id === serviceId ? { ...service, price } : service
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Prepare services data
      const servicesData = selectedServices.map(service => ({
        service_id: service.id,
        price: Number(service.price)
      }));

      // Prepare protocol data
      const protocolData = {
        ...formData,
        services: servicesData
      };

      await protocolApi.create(protocolData);
      toast.success("Protokol başarıyla oluşturuldu");
      router.push("/protocols");
    } catch (error) {
      console.error("Error creating protocol:", error);
      toast.error("Protokol oluşturulurken bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPatients = patients.filter(patient => {
    const fullName = `${patient.first_name} ${patient.last_name}`.toLowerCase();
    const tcNo = patient.tc_identity_number || "";
    return fullName.includes(searchTerm.toLowerCase()) || tcNo.includes(searchTerm);
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Yeni Protokol Oluştur</h1>
        <p className="text-muted-foreground">
          Yeni bir protokol oluşturmak için formu doldurun
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Hasta Bilgileri</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="searchPatient">Hasta Ara</Label>
              <Input
                id="searchPatient"
                placeholder="TC Kimlik No veya Ad Soyad ile ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="patient_id">Hasta Seçin *</Label>
              <Select
                value={formData.patient_id}
                onValueChange={(value) => handleSelectChange("patient_id", value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Hasta Seçin" />
                </SelectTrigger>
                <SelectContent>
                  {filteredPatients.map((patient) => (
                    <SelectItem key={patient.id} value={patient.id.toString()}>
                      {patient.first_name} {patient.last_name} {patient.tc_identity_number ? `(${patient.tc_identity_number})` : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="examination_type_id">Muayene Türü *</Label>
              <Select
                value={formData.examination_type_id}
                onValueChange={(value) => handleSelectChange("examination_type_id", value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Muayene Türü Seçin" />
                </SelectTrigger>
                <SelectContent>
                  {examinationTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id.toString()}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="protocol_date">Protokol Tarihi *</Label>
              <Input
                id="protocol_date"
                name="protocol_date"
                type="date"
                value={formData.protocol_date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="receipt_number">Fiş No</Label>
                <Input
                  id="receipt_number"
                  name="receipt_number"
                  value={formData.receipt_number}
                  onChange={handleChange}
                  placeholder="Fiş No"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ledger_number">Defter No</Label>
                <Input
                  id="ledger_number"
                  name="ledger_number"
                  value={formData.ledger_number}
                  onChange={handleChange}
                  placeholder="Defter No"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Hizmetler</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Mevcut Hizmetler</h3>
                <div className="border rounded-md p-4 h-64 overflow-y-auto">
                  <div className="space-y-2">
                    {services.map((service) => (
                      <div key={service.id} className="flex justify-between items-center">
                        <span>{service.name} - {service.price} ₺</span>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleAddService(service)}
                        >
                          Ekle
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Seçilen Hizmetler</h3>
                <div className="border rounded-md p-4 h-64 overflow-y-auto">
                  {selectedServices.length === 0 ? (
                    <p className="text-muted-foreground">Henüz hizmet seçilmedi</p>
                  ) : (
                    <div className="space-y-2">
                      {selectedServices.map((service) => (
                        <div key={service.id} className="flex justify-between items-center">
                          <span>{service.name}</span>
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              value={service.price}
                              onChange={(e) => handleServicePriceChange(service.id, e.target.value)}
                              className="w-24"
                              min="0"
                            />
                            <span>₺</span>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handleRemoveService(service.id)}
                            >
                              Kaldır
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="discount_amount">İndirim Tutarı</Label>
                <div className="flex items-center">
                  <Input
                    id="discount_amount"
                    name="discount_amount"
                    type="number"
                    value={formData.discount_amount}
                    onChange={handleChange}
                    min="0"
                  />
                  <span className="ml-2">₺</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="total_amount">Toplam Tutar</Label>
                <div className="flex items-center">
                  <Input
                    id="total_amount"
                    name="total_amount"
                    type="number"
                    value={formData.total_amount}
                    onChange={handleChange}
                    min="0"
                    required
                  />
                  <span className="ml-2">₺</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/protocols")}
          >
            İptal
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Oluşturuluyor..." : "Protokol Oluştur"}
          </Button>
        </div>
      </form>
    </div>
  );
}
