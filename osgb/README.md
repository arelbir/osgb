# OSGB Yönetim Sistemi

Ortak Sağlık Güvenlik Birimi (OSGB) Yönetim Sistemi, hasta kayıtları, protokoller, laboratuvar sonuçları ve ödemeleri yönetmek için geliştirilmiş bir web uygulamasıdır.

## Özellikler

- Hasta kayıt ve yönetimi
- Protokol oluşturma ve takibi
- Laboratuvar sonuçları yönetimi
- Ödeme işlemleri ve kasa raporları
- Firma ve birim yönetimi

## Teknolojiler

- **Backend:** TypeScript, Express, TypeORM, PostgreSQL
- **Frontend:** Next.js, React, shadcn UI, Tailwind CSS
- **Deployment:** Docker, Docker Compose

## Kurulum

Detaylı kurulum talimatları için  dosyasını inceleyebilirsiniz.

## Kullanım

- Test etmek için: [1;33mOSGB Yönetim Sistemi Test Ediliyor...[0m
[1;33mBackend bağımlılıkları kontrol ediliyor...[0m
[0;32mBackend bağımlılıkları zaten kurulu.[0m
[1;33mPostgreSQL bağlantısı kontrol ediliyor...[0m
PostgreSQL bağlantısı başarılı
[0;32mPostgreSQL bağlantısı başarılı[0m
[1;33mVeritabanı şeması oluşturuluyor...[0m
[0;31mVeritabanı şeması oluşturulurken hata oluştu.[0m
- Geliştirme ortamında çalıştırmak için: [1;33mOSGB Yönetim Sistemi Başlatılıyor...[0m
[1;33mPostgreSQL bağlantısı kontrol ediliyor...[0m
PostgreSQL bağlantısı başarılı
[0;32mPostgreSQL bağlantısı başarılı[0m
[1;33mBackend uygulaması başlatılıyor...[0m
[0;32mBackend uygulaması başlatıldı (PID: 9660)[0m
[1;33mBackend'in başlaması bekleniyor...[0m

> backend@1.0.0 dev
> ts-node src/index.ts

[0;31mBackend başlatılamadı. Lütfen logları kontrol edin.[0m
- Dağıtım hazırlığı için: [1;33mOSGB Yönetim Sistemi Dağıtım Hazırlığı...[0m
[1;33mBackend için production build oluşturuluyor...[0m

> backend@1.0.0 build
> tsc

src/controllers/AuthController.ts(29,25): error TS2769: No overload matches this call.
  Overload 1 of 5, '(payload: string | object | Buffer<ArrayBufferLike>, secretOrPrivateKey: null, options?: (SignOptions & { algorithm: "none"; }) | undefined): string', gave the following error.
    Argument of type 'string' is not assignable to parameter of type 'null'.
  Overload 2 of 5, '(payload: string | object | Buffer<ArrayBufferLike>, secretOrPrivateKey: Buffer<ArrayBufferLike> | Secret | PrivateKeyInput | JsonWebKeyInput, options?: SignOptions | undefined): string', gave the following error.
    Type 'string' is not assignable to type 'number | StringValue | undefined'.
  Overload 3 of 5, '(payload: string | object | Buffer<ArrayBufferLike>, secretOrPrivateKey: Buffer<ArrayBufferLike> | Secret | PrivateKeyInput | JsonWebKeyInput, callback: SignCallback): void', gave the following error.
    Object literal may only specify known properties, and 'expiresIn' does not exist in type 'SignCallback'.
src/controllers/LabResultController.ts(215,11): error TS2322: Type 'null' is not assignable to type 'SampleStatus'.
src/controllers/LabResultController.ts(216,11): error TS2322: Type 'null' is not assignable to type 'number'.
src/controllers/LabResultController.ts(235,11): error TS2322: Type 'null' is not assignable to type 'SampleRejectionReason'.
src/controllers/LabResultController.ts(236,11): error TS2322: Type 'null' is not assignable to type 'number'.
src/controllers/LabResultController.ts(268,11): error TS2322: Type 'null' is not assignable to type 'ExternalLab'.
src/controllers/LabResultController.ts(269,11): error TS2322: Type 'null' is not assignable to type 'number'.
src/controllers/PatientController.ts(109,7): error TS2322: Type 'Date | undefined' is not assignable to type 'Date'.
  Type 'undefined' is not assignable to type 'Date'.
src/controllers/PatientController.ts(221,11): error TS2322: Type 'null' is not assignable to type 'Company'.
src/controllers/PatientController.ts(222,11): error TS2322: Type 'null' is not assignable to type 'number'.
src/controllers/PatientController.ts(239,11): error TS2322: Type 'null' is not assignable to type 'CompanyUnit'.
src/controllers/PatientController.ts(240,11): error TS2322: Type 'null' is not assignable to type 'number'.
src/controllers/PaymentController.ts(225,11): error TS2322: Type 'null' is not assignable to type 'PaymentType'.
src/controllers/PaymentController.ts(226,11): error TS2322: Type 'null' is not assignable to type 'number'.
src/controllers/PaymentController.ts(245,11): error TS2322: Type 'null' is not assignable to type 'CashRegister'.
src/controllers/PaymentController.ts(246,11): error TS2322: Type 'null' is not assignable to type 'number'.
src/controllers/ProtocolController.ts(286,11): error TS2322: Type 'null' is not assignable to type 'Company'.
src/controllers/ProtocolController.ts(287,11): error TS2322: Type 'null' is not assignable to type 'number'.
src/index.ts(42,16): error TS2769: No overload matches this call.
  Overload 1 of 6, '(port: number, hostname: string, backlog: number, callback?: ((error?: Error | undefined) => void) | undefined): Server<typeof IncomingMessage, typeof ServerResponse>', gave the following error.
    Argument of type 'string | 5000' is not assignable to parameter of type 'number'.
      Type 'string' is not assignable to type 'number'.
  Overload 2 of 6, '(port: number, hostname: string, callback?: ((error?: Error | undefined) => void) | undefined): Server<typeof IncomingMessage, typeof ServerResponse>', gave the following error.
    Argument of type 'string | 5000' is not assignable to parameter of type 'number'.
      Type 'string' is not assignable to type 'number'.
src/routes/auth.ts(8,23): error TS2769: No overload matches this call.
  The last overload gave the following error.
    Argument of type '(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>) => Promise<...>' is not assignable to parameter of type 'Application<Record<string, any>>'.
      Type '(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>) => Promise<...>' is missing the following properties from type 'Application<Record<string, any>>': init, defaultConfiguration, engine, set, and 63 more.
src/routes/auth.ts(11,26): error TS2769: No overload matches this call.
  The last overload gave the following error.
    Argument of type '(req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>' is not assignable to parameter of type 'RequestHandlerParams<ParamsDictionary, any, any, ParsedQs, Record<string, any>>'.
      Type '(req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>' is not assignable to type 'RequestHandler<ParamsDictionary, any, any, ParsedQs, Record<string, any>>'.
        Type 'Promise<Response<any, Record<string, any>> | undefined>' is not assignable to type 'void | Promise<void>'.
          Type 'Promise<Response<any, Record<string, any>> | undefined>' is not assignable to type 'Promise<void>'.
            Type 'Response<any, Record<string, any>> | undefined' is not assignable to type 'void'.
              Type 'Response<any, Record<string, any>>' is not assignable to type 'void'.
src/routes/auth.ts(12,24): error TS2769: No overload matches this call.
  The last overload gave the following error.
    Argument of type '(req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>' is not assignable to parameter of type 'RequestHandlerParams<ParamsDictionary, any, any, ParsedQs, Record<string, any>>'.
      Type '(req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>' is not assignable to type 'RequestHandler<ParamsDictionary, any, any, ParsedQs, Record<string, any>>'.
        Type 'Promise<Response<any, Record<string, any>> | undefined>' is not assignable to type 'void | Promise<void>'.
          Type 'Promise<Response<any, Record<string, any>> | undefined>' is not assignable to type 'Promise<void>'.
            Type 'Response<any, Record<string, any>> | undefined' is not assignable to type 'void'.
              Type 'Response<any, Record<string, any>>' is not assignable to type 'void'.
src/routes/companies.ts(8,12): error TS2769: No overload matches this call.
  The last overload gave the following error.
    Argument of type '(req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>' is not assignable to parameter of type 'PathParams'.
src/routes/companies.ts(11,17): error TS2769: No overload matches this call.
  The last overload gave the following error.
    Argument of type '(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>) => Promise<...>' is not assignable to parameter of type 'Application<Record<string, any>>'.
      Type '(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>) => Promise<...>' is missing the following properties from type 'Application<Record<string, any>>': init, defaultConfiguration, engine, set, and 63 more.
src/routes/companies.ts(14,20): error TS2769: No overload matches this call.
  The last overload gave the following error.
    Argument of type '(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>) => Promise<...>' is not assignable to parameter of type 'Application<Record<string, any>>'.
      Type '(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>) => Promise<...>' is missing the following properties from type 'Application<Record<string, any>>': init, defaultConfiguration, engine, set, and 63 more.
src/routes/companies.ts(17,18): error TS2769: No overload matches this call.
  The last overload gave the following error.
    Argument of type '(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>) => Promise<...>' is not assignable to parameter of type 'Application<Record<string, any>>'.
      Type '(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>) => Promise<...>' is missing the following properties from type 'Application<Record<string, any>>': init, defaultConfiguration, engine, set, and 63 more.
src/routes/companies.ts(20,20): error TS2769: No overload matches this call.
  The last overload gave the following error.
    Argument of type '(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>) => Promise<...>' is not assignable to parameter of type 'Application<Record<string, any>>'.
      Type '(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>) => Promise<...>' is missing the following properties from type 'Application<Record<string, any>>': init, defaultConfiguration, engine, set, and 63 more.
src/routes/companies.ts(23,23): error TS2769: No overload matches this call.
  The last overload gave the following error.
    Argument of type '(req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>' is not assignable to parameter of type 'RequestHandlerParams<ParamsDictionary, any, any, ParsedQs, Record<string, any>>'.
      Type '(req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>' is not assignable to type 'RequestHandler<ParamsDictionary, any, any, ParsedQs, Record<string, any>>'.
        Type 'void | Response<any, Record<string, any>>' is not assignable to type 'void | Promise<void>'.
          Type 'Response<any, Record<string, any>>' is not assignable to type 'void | Promise<void>'.
src/routes/companies.ts(26,33): error TS2769: No overload matches this call.
  The last overload gave the following error.
    Argument of type '(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>) => Promise<...>' is not assignable to parameter of type 'Application<Record<string, any>>'.
      Type '(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>) => Promise<...>' is missing the following properties from type 'Application<Record<string, any>>': init, defaultConfiguration, engine, set, and 63 more.
src/routes/companies.ts(27,34): error TS2769: No overload matches this call.
  The last overload gave the following error.
    Argument of type '(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>) => Promise<...>' is not assignable to parameter of type 'Application<Record<string, any>>'.
      Type '(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>) => Promise<...>' is missing the following properties from type 'Application<Record<string, any>>': init, defaultConfiguration, engine, set, and 63 more.
src/routes/lab-results.ts(8,12): error TS2769: No overload matches this call.
  The last overload gave the following error.
    Argument of type '(req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>' is not assignable to parameter of type 'PathParams'.
src/routes/lab-results.ts(11,17): error TS2769: No overload matches this call.
  The last overload gave the following error.
    Argument of type '(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>) => Promise<...>' is not assignable to parameter of type 'Application<Record<string, any>>'.
      Type '(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>) => Promise<...>' is missing the following properties from type 'Application<Record<string, any>>': init, defaultConfiguration, engine, set, and 63 more.
src/routes/lab-results.ts(14,20): error TS2769: No overload matches this call.
  The last overload gave the following error.
    Argument of type '(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>) => Promise<...>' is not assignable to parameter of type 'Application<Record<string, any>>'.
      Type '(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>) => Promise<...>' is missing the following properties from type 'Application<Record<string, any>>': init, defaultConfiguration, engine, set, and 63 more.
src/routes/lab-results.ts(17,18): error TS2769: No overload matches this call.
  The last overload gave the following error.
    Argument of type '(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>) => Promise<...>' is not assignable to parameter of type 'Application<Record<string, any>>'.
      Type '(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>) => Promise<...>' is missing the following properties from type 'Application<Record<string, any>>': init, defaultConfiguration, engine, set, and 63 more.
src/routes/lab-results.ts(20,20): error TS2769: No overload matches this call.
  The last overload gave the following error.
    Argument of type '(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>) => Promise<...>' is not assignable to parameter of type 'Application<Record<string, any>>'.
      Type '(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>) => Promise<...>' is missing the following properties from type 'Application<Record<string, any>>': init, defaultConfiguration, engine, set, and 63 more.
src/routes/lab-results.ts(23,23): error TS2769: No overload matches this call.
  The last overload gave the following error.
    Argument of type '(req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>' is not assignable to parameter of type 'RequestHandlerParams<ParamsDictionary, any, any, ParsedQs, Record<string, any>>'.
      Type '(req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>' is not assignable to type 'RequestHandler<ParamsDictionary, any, any, ParsedQs, Record<string, any>>'.
        Type 'void | Response<any, Record<string, any>>' is not assignable to type 'void | Promise<void>'.
          Type 'Response<any, Record<string, any>>' is not assignable to type 'void | Promise<void>'.
src/routes/lab-results.ts(26,28): error TS2769: No overload matches this call.
  The last overload gave the following error.
    Argument of type '(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>) => Promise<...>' is not assignable to parameter of type 'Application<Record<string, any>>'.
      Type '(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>) => Promise<...>' is missing the following properties from type 'Application<Record<string, any>>': init, defaultConfiguration, engine, set, and 63 more.
src/routes/lab-results.ts(27,29): error TS2769: No overload matches this call.
  The last overload gave the following error.
    Argument of type '(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>) => Promise<...>' is not assignable to parameter of type 'Application<Record<string, any>>'.
      Type '(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>) => Promise<...>' is missing the following properties from type 'Application<Record<string, any>>': init, defaultConfiguration, engine, set, and 63 more.
src/routes/patients.ts(8,12): error TS2769: No overload matches this call.
  The last overload gave the following error.
    Argument of type '(req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>' is not assignable to parameter of type 'PathParams'.
src/routes/patients.ts(11,17): error TS2769: No overload matches this call.
  The last overload gave the following error.
    Argument of type '(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>) => Promise<...>' is not assignable to parameter of type 'Application<Record<string, any>>'.
      Type '(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>) => Promise<...>' is missing the following properties from type 'Application<Record<string, any>>': init, defaultConfiguration, engine, set, and 63 more.
src/routes/patients.ts(14,20): error TS2769: No overload matches this call.
  The last overload gave the following error.
    Argument of type '(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>) => Promise<...>' is not assignable to parameter of type 'Application<Record<string, any>>'.
      Type '(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>) => Promise<...>' is missing the following properties from type 'Application<Record<string, any>>': init, defaultConfiguration, engine, set, and 63 more.
src/routes/patients.ts(17,18): error TS2769: No overload matches this call.
  The last overload gave the following error.
    Argument of type '(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>) => Promise<...>' is not assignable to parameter of type 'Application<Record<string, any>>'.
      Type '(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>) => Promise<...>' is missing the following properties from type 'Application<Record<string, any>>': init, defaultConfiguration, engine, set, and 63 more.
src/routes/patients.ts(20,20): error TS2769: No overload matches this call.
  The last overload gave the following error.
    Argument of type '(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>) => Promise<...>' is not assignable to parameter of type 'Application<Record<string, any>>'.
      Type '(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>) => Promise<...>' is missing the following properties from type 'Application<Record<string, any>>': init, defaultConfiguration, engine, set, and 63 more.
src/routes/patients.ts(23,23): error TS2769: No overload matches this call.
  The last overload gave the following error.
    Argument of type '(req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>' is not assignable to parameter of type 'RequestHandlerParams<ParamsDictionary, any, any, ParsedQs, Record<string, any>>'.
      Type '(req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>' is not assignable to type 'RequestHandler<ParamsDictionary, any, any, ParsedQs, Record<string, any>>'.
        Type 'void | Response<any, Record<string, any>>' is not assignable to type 'void | Promise<void>'.
          Type 'Response<any, Record<string, any>>' is not assignable to type 'void | Promise<void>'.
src/routes/payments.ts(8,12): error TS2769: No overload matches this call.
  The last overload gave the following error.
    Argument of type '(req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>' is not assignable to parameter of type 'PathParams'.
src/routes/payments.ts(11,17): error TS2769: No overload matches this call.
  The last overload gave the following error.
    Argument of type '(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>) => Promise<...>' is not assignable to parameter of type 'Application<Record<string, any>>'.
      Type '(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>) => Promise<...>' is missing the following properties from type 'Application<Record<string, any>>': init, defaultConfiguration, engine, set, and 63 more.
src/routes/payments.ts(14,20): error TS2769: No overload matches this call.
  The last overload gave the following error.
    Argument of type '(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>) => Promise<...>' is not assignable to parameter of type 'Application<Record<string, any>>'.
      Type '(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>) => Promise<...>' is missing the following properties from type 'Application<Record<string, any>>': init, defaultConfiguration, engine, set, and 63 more.
src/routes/payments.ts(17,18): error TS2769: No overload matches this call.
  The last overload gave the following error.
    Argument of type '(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>) => Promise<...>' is not assignable to parameter of type 'Application<Record<string, any>>'.
      Type '(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>) => Promise<...>' is missing the following properties from type 'Application<Record<string, any>>': init, defaultConfiguration, engine, set, and 63 more.
src/routes/payments.ts(20,20): error TS2769: No overload matches this call.
  The last overload gave the following error.
    Argument of type '(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>) => Promise<...>' is not assignable to parameter of type 'Application<Record<string, any>>'.
      Type '(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>) => Promise<...>' is missing the following properties from type 'Application<Record<string, any>>': init, defaultConfiguration, engine, set, and 63 more.
src/routes/payments.ts(23,23): error TS2769: No overload matches this call.
  The last overload gave the following error.
    Argument of type '(req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>' is not assignable to parameter of type 'RequestHandlerParams<ParamsDictionary, any, any, ParsedQs, Record<string, any>>'.
      Type '(req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>' is not assignable to type 'RequestHandler<ParamsDictionary, any, any, ParsedQs, Record<string, any>>'.
        Type 'void | Response<any, Record<string, any>>' is not assignable to type 'void | Promise<void>'.
          Type 'Response<any, Record<string, any>>' is not assignable to type 'void | Promise<void>'.
src/routes/protocols.ts(8,12): error TS2769: No overload matches this call.
  The last overload gave the following error.
    Argument of type '(req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>' is not assignable to parameter of type 'PathParams'.
src/routes/protocols.ts(11,17): error TS2769: No overload matches this call.
  The last overload gave the following error.
    Argument of type '(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>) => Promise<...>' is not assignable to parameter of type 'Application<Record<string, any>>'.
      Type '(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>) => Promise<...>' is missing the following properties from type 'Application<Record<string, any>>': init, defaultConfiguration, engine, set, and 63 more.
src/routes/protocols.ts(14,20): error TS2769: No overload matches this call.
  The last overload gave the following error.
    Argument of type '(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>) => Promise<...>' is not assignable to parameter of type 'Application<Record<string, any>>'.
      Type '(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>) => Promise<...>' is missing the following properties from type 'Application<Record<string, any>>': init, defaultConfiguration, engine, set, and 63 more.
src/routes/protocols.ts(17,18): error TS2769: No overload matches this call.
  The last overload gave the following error.
    Argument of type '(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>) => Promise<...>' is not assignable to parameter of type 'Application<Record<string, any>>'.
      Type '(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>) => Promise<...>' is missing the following properties from type 'Application<Record<string, any>>': init, defaultConfiguration, engine, set, and 63 more.
src/routes/protocols.ts(20,20): error TS2769: No overload matches this call.
  The last overload gave the following error.
    Argument of type '(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>) => Promise<...>' is not assignable to parameter of type 'Application<Record<string, any>>'.
      Type '(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>) => Promise<...>' is missing the following properties from type 'Application<Record<string, any>>': init, defaultConfiguration, engine, set, and 63 more.
src/routes/protocols.ts(23,23): error TS2769: No overload matches this call.
  The last overload gave the following error.
    Argument of type '(req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>' is not assignable to parameter of type 'RequestHandlerParams<ParamsDictionary, any, any, ParsedQs, Record<string, any>>'.
      Type '(req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>' is not assignable to type 'RequestHandler<ParamsDictionary, any, any, ParsedQs, Record<string, any>>'.
        Type 'void | Response<any, Record<string, any>>' is not assignable to type 'void | Promise<void>'.
          Type 'Response<any, Record<string, any>>' is not assignable to type 'void | Promise<void>'.
[0;31mBackend build işlemi sırasında hata oluştu.[0m

## Giriş Bilgileri

- Kullanıcı adı: admin
- Şifre: admin123
