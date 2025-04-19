-- OSGB Yönetim Sistemi Veritabanı Şeması

-- Kullanıcılar tablosu
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    role VARCHAR(20) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Firmalar tablosu
CREATE TABLE companies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    tax_number VARCHAR(20),
    address TEXT,
    phone VARCHAR(20),
    email VARCHAR(100),
    contact_person VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Firma birimleri tablosu
CREATE TABLE company_units (
    id SERIAL PRIMARY KEY,
    company_id INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    address TEXT,
    phone VARCHAR(20),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- OSGB tanımları tablosu
CREATE TABLE osgb_definitions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Dış laboratuvarlar tablosu
CREATE TABLE external_labs (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    address TEXT,
    phone VARCHAR(20),
    email VARCHAR(100),
    contact_person VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Hastalar tablosu
CREATE TABLE patients (
    id SERIAL PRIMARY KEY,
    tc_identity_number VARCHAR(11) UNIQUE,
    registration_number VARCHAR(20),
    passport_number VARCHAR(20),
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    birth_date DATE,
    gender VARCHAR(10) NOT NULL,
    mother_name VARCHAR(50),
    father_name VARCHAR(50),
    mobile_phone VARCHAR(20),
    home_phone VARCHAR(20),
    email VARCHAR(100),
    address TEXT,
    notes TEXT,
    company_id INTEGER REFERENCES companies(id),
    company_unit_id INTEGER REFERENCES company_units(id),
    photo_url VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Muayene türleri tablosu
CREATE TABLE examination_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Hizmet grupları tablosu
CREATE TABLE service_groups (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Hizmetler tablosu
CREATE TABLE services (
    id SERIAL PRIMARY KEY,
    service_group_id INTEGER REFERENCES service_groups(id),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Hizmet paketleri tablosu
CREATE TABLE service_packages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Hizmet paketi detayları tablosu
CREATE TABLE service_package_details (
    id SERIAL PRIMARY KEY,
    service_package_id INTEGER NOT NULL REFERENCES service_packages(id) ON DELETE CASCADE,
    service_id INTEGER NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Protokoller tablosu (Hasta kayıtları)
CREATE TABLE protocols (
    id SERIAL PRIMARY KEY,
    protocol_number VARCHAR(20) NOT NULL UNIQUE,
    patient_id INTEGER NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    examination_type_id INTEGER NOT NULL REFERENCES examination_types(id),
    company_id INTEGER REFERENCES companies(id),
    protocol_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    receipt_number VARCHAR(20),
    ledger_number VARCHAR(20),
    total_amount DECIMAL(10, 2) NOT NULL,
    discount_amount DECIMAL(10, 2) DEFAULT 0,
    paid_amount DECIMAL(10, 2) DEFAULT 0,
    remaining_amount DECIMAL(10, 2) GENERATED ALWAYS AS (total_amount - discount_amount - paid_amount) STORED,
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Protokol hizmetleri tablosu
CREATE TABLE protocol_services (
    id SERIAL PRIMARY KEY,
    protocol_id INTEGER NOT NULL REFERENCES protocols(id) ON DELETE CASCADE,
    service_id INTEGER NOT NULL REFERENCES services(id),
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Numune durumları tablosu
CREATE TABLE sample_statuses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Numune reddetme nedenleri tablosu
CREATE TABLE sample_rejection_reasons (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Laboratuvar sonuçları tablosu
CREATE TABLE lab_results (
    id SERIAL PRIMARY KEY,
    protocol_service_id INTEGER NOT NULL REFERENCES protocol_services(id) ON DELETE CASCADE,
    barcode_number VARCHAR(50),
    result TEXT,
    result_text TEXT,
    reference_range VARCHAR(100),
    unit VARCHAR(20),
    is_abnormal BOOLEAN DEFAULT FALSE,
    sample_status_id INTEGER REFERENCES sample_statuses(id),
    rejection_reason_id INTEGER REFERENCES sample_rejection_reasons(id),
    request_date TIMESTAMP,
    acceptance_date TIMESTAMP,
    acceptance_by INTEGER REFERENCES users(id),
    barcode_date TIMESTAMP,
    approval_date TIMESTAMP,
    approved_by INTEGER REFERENCES users(id),
    rejection_date TIMESTAMP,
    rejected_by INTEGER REFERENCES users(id),
    external_lab_id INTEGER REFERENCES external_labs(id),
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Rapor şablonları tablosu
CREATE TABLE report_templates (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    type VARCHAR(20) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Göz raporu şablonları tablosu
CREATE TABLE eye_report_templates (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Dış laboratuvar gönderim tablosu
CREATE TABLE external_lab_submissions (
    id SERIAL PRIMARY KEY,
    protocol_service_id INTEGER NOT NULL REFERENCES protocol_services(id) ON DELETE CASCADE,
    external_lab_id INTEGER NOT NULL REFERENCES external_labs(id),
    submission_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expected_return_date TIMESTAMP,
    return_date TIMESTAMP,
    status VARCHAR(20) NOT NULL DEFAULT 'submitted',
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Ödeme tipleri tablosu
CREATE TABLE payment_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Kasa tablosu
CREATE TABLE cash_registers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tahsilatlar tablosu
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    protocol_id INTEGER NOT NULL REFERENCES protocols(id) ON DELETE CASCADE,
    payment_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    receipt_number VARCHAR(20),
    cash_register_id INTEGER REFERENCES cash_registers(id),
    payment_type_id INTEGER REFERENCES payment_types(id),
    amount DECIMAL(10, 2) NOT NULL,
    description TEXT,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Web sonuç kullanıcıları tablosu
CREATE TABLE web_result_users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    patient_id INTEGER REFERENCES patients(id),
    company_id INTEGER REFERENCES companies(id),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Örnek veri ekleme
INSERT INTO users (username, password, full_name, email, role) 
VALUES ('admin', '$2b$10$X7VYVy9H5NvNvUYP8fOzB.vH.1QBtW3Rh1TwSRfBEqOaFkNS9gBmy', 'Admin User', 'admin@example.com', 'admin');

INSERT INTO examination_types (name, description) 
VALUES 
('İşe Giriş Muayenesi', 'İşe yeni başlayan çalışanlar için yapılan sağlık muayenesi'),
('Periyodik Muayene', 'Düzenli aralıklarla yapılan kontrol muayenesi'),
('İşten Çıkış Muayenesi', 'İşten ayrılan çalışanlar için yapılan sağlık muayenesi');

INSERT INTO service_groups (name, description) 
VALUES 
('Laboratuvar Testleri', 'Kan, idrar vb. laboratuvar testleri'),
('Radyoloji', 'Röntgen, ultrason vb. görüntüleme hizmetleri'),
('Muayene', 'Doktor muayeneleri');

INSERT INTO sample_statuses (name, description) 
VALUES 
('Beklemede', 'Numune henüz işleme alınmadı'),
('Kabul Edildi', 'Numune kabul edildi ve işleme alındı'),
('Reddedildi', 'Numune çeşitli nedenlerle reddedildi'),
('Sonuçlandı', 'Numune analizi tamamlandı');

INSERT INTO payment_types (name, description) 
VALUES 
('Nakit', 'Nakit ödeme'),
('Kredi Kartı', 'Kredi kartı ile ödeme'),
('Havale/EFT', 'Banka havalesi veya EFT ile ödeme');

INSERT INTO cash_registers (name, description) 
VALUES 
('Ana Kasa', 'Merkez şubedeki ana kasa');
