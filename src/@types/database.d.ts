interface payload {
  IDStasiun: string;
  Tanggal: string;
  Jam: string;
  Suhu: string;
  DHL: string;
  TDS: string;
  Salinitas: string;
  DO: string;
  PH: string;
  Turbidity: string;
  Kedalaman: string;
  SwSG: string;
  Nitrat: string;
  Amonia: string;
  ORP: string;
  COD: string;
  BOD: string;
  TSS: string;
}

interface DatabaseData {
  // Menyesuaikan dengan struktur data yang ada dalam values
  id_mesin: string;
  waktu_mesin: string;
  oxygen_purity: number;
  o2_tank: number;
  flow_meter: number;
  flow_meter2: number;
  total_flow: number;
  running_time: number;
}

interface DatabaseResponse {
  success: boolean;
  statusCode?: number;
  total: string; // Total sebagai string berdasarkan respon API
  limit: string; // Limit sebagai string berdasarkan respon API
  offset: string; // Offset sebagai string berdasarkan respon API
  data: DatabaseData[] | []; // Bisa berupa array DatabaseData atau array kosong
}

type DatabaseExport = BlobPart;
