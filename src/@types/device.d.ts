interface DeviceTableData {
  id: string | number;
  created_at: string;
  updated_at: string;
  id_mesin: string;
  id_lama: string;
  nama_dinas: string;
  nama_stasiun: string;
  created_by: number;
  dinas_id: number;
  alamat: string;
  manufacture: string;
}

interface DeviceTableResponse {
  success: boolean;
  statusCode?: number;
  data: {
    values: DeviceTableData[];
    total: string;
  };
}
