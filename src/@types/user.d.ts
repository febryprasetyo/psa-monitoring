interface UserTableData {
  id: number;
  username: string;
  alamat: string;
  nama_dinas: string;
  status: string;
  password: string;
  dinas_id: number;
}

interface UserResponse {
  success: boolean;
  data: {
    values: UserTableData[];
    total: string;
  };
  statusCode?: number;
}

interface UserListResponse {
  success: boolean;
  data: {
    values: UserTableData[];
    total: string;
  };
}
