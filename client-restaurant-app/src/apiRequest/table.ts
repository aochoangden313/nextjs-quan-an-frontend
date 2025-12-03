import http from "../lib/http";
import {
  CreateTableBodyType,
  TableListResType,
  TableResType,
  UpdateTableBodyType,
} from "../schemaValidations/table.schema";

const prefix = "/tables";

const tableApiRequest = {
  // list all table
  list: () => http.get<TableListResType>(`${prefix}`),
  //get table by id
  getTable: (id: number) => http.get<TableResType>(`${prefix}/${id}`),
  //add Table
  addTable: (body: CreateTableBodyType) =>
    http.post<TableResType>(`${prefix}`, body),
  //update table
  updateTable: (id: number, body: UpdateTableBodyType) =>
    http.put<TableResType>(`${prefix}/${id}`, body),
  //delete table
  deleteTable: (id: number) => http.delete<TableResType>(`${prefix}/${id}`),
};

export default tableApiRequest;
