import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { patientApi, companyApi } from "@/lib/api";
import { toast } from "sonner";

export default function NewPatient() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [companyUnits, setCompanyUnits] = useState([]);
  const [formData, setFormData] = useState({
    tc_identity_number: "",
    registration_number: "",
    passport_number: "",
    first_name: "",
    last_name: "",
    birth_date: "",
    gender: "",
    mother_name: "",
    father_name: "",
    mobile_phone: "",
    home_phone: "",
    email: "",
    address: "",
    notes: "",
    company_id: "",
    company_unit_id: "",
  });

  useEffect(() => {
    fetchCompanies();
  }, []);

  useEffect(() => {
    if (formData.company_id) {
      fetchCompanyUnits(formData.company_id);
    } else {
      setCompanyUnits([]);
      setFormData(prev => ({ ...prev, company_unit_id: "" }));
    }
  }, [formData.company_id]);

  const fetchCompanies = async () => {
    try {
      const data = await companyApi.getAll({ is_active: true });
      setCompanies(data);
    } catch (error) {
      console.error("Error fetching companies:", error);
      toast.error("Firmalar yüklenirken bir hata oluştu");
    }
  };

  const fetchCompanyUnits = async (companyId) => {
    try {
      const data = await companyApi.getCompanyUnits(companyId);
      setCompanyUnits(data);
    } catch (error) {
      console.error("Error fetching company units:", error);
      toast.error("Firma birimleri yüklenirken bir hata oluştu");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await patientApi.create(formData);
      toast.success("Hasta başarıyla kaydedildi");
      router.push("/patients");
    } catch (error) {
      console.error("Error creating patient:", error);
      toast.error("Hasta kaydedilirken bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Yeni Hasta Kaydı</h1>
        <p className="text-muted-foreground">
          Sisteme yeni hasta eklemek için formu doldurun
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Kişisel Bilgiler</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tc_identity_number">TC Kimlik No</Label>
                <Input
                  id="tc_identity_number"
                  name="tc_identity_number"
                  value={formData.tc_identity_number}
                  onChange={handleChange}
                  placeholder="TC Kimlik No"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="registration_number">Sicil No</Label>
                <Input
                  id="registration_number"
                  name="registration_number"
                  value={formData.registration_number}
                  onChange={handleChange}
                  placeholder="Sicil No"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="passport_number">Pasaport No</Label>
                <Input
                  id="passport_number"
                  name="passport_number"
                  value={formData.passport_number}
                  onChange={handleChange}
                  placeholder="Pasaport No"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">Ad *</Label>
                <Input
                  id="first_name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  placeholder="Ad"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Soyad *</Label>
                <Input
                  id="last_name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder="Soyad"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="birth_date">Doğum Tarihi</Label>
                <Input
                  id="birth_date"
                  name="birth_date"
                  type="date"
                  value={formData.birth_date}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Cinsiyet *</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => handleSelectChange("gender", value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Cinsiyet Seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Erkek</SelectItem>
                    <SelectItem value="female">Kadın</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="mother_name">Anne Adı</Label>
                <Input
                  id="mother_name"
                  name="mother_name"
                  value={formData.mother_name}
                  onChange={handleChange}
                  placeholder="Anne Adı"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="father_name">Baba Adı</Label>
                <Input
                  id="father_name"
                  name="father_name"
                  value={formData.father_name}
                  onChange={handleChange}
                  placeholder="Baba Adı"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>İletişim Bilgileri</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="mobile_phone">Cep Telefonu</Label>
                <Input
                  id="mobile_phone"
                  name="mobile_phone"
                  value={formData.mobile_phone}
                  onChange={handleChange}
                  placeholder="Cep Telefonu"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="home_phone">Ev Telefonu</Label>
                <Input
                  id="home_phone"
                  name="home_phone"
                  value={formData.home_phone}
                  onChange={handleChange}
                  placeholder="Ev Telefonu"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-posta</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="E-posta"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Adres</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Adres"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Firma Bilgileri</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company_id">Firma</Label>
                <Select
                  value={formData.company_id}
                  onValueChange={(value) => handleSelectChange("company_id", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Firma Seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Firma Seçilmedi</SelectItem>
                    {companies.map((company) => (
                      <SelectItem key={company.id} value={company.id.toString()}>
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="company_unit_id">Firma Birimi</Label>
                <Select
                  value={formData.company_unit_id}
                  onValueChange={(value) => handleSelectChange("company_unit_id", value)}
                  disabled={!formData.company_id || companyUnits.length === 0}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Birim Seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Birim Seçilmedi</SelectItem>
                    {companyUnits.map((unit) => (
                      <SelectItem key={unit.id} value={unit.id.toString()}>
                        {unit.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Ek Bilgiler</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="notes">Notlar</Label>
              <Input
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Notlar"
              />
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/patients")}
          >
            İptal
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Kaydediliyor..." : "Kaydet"}
          </Button>
        </div>
      </form>
    </div>
  );
}
