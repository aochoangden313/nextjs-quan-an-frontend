import { number } from "zod";
import http from "../lib/http";
import {
  CreateDishBodyType,
  DishListResType,
  DishListWithPaginationResType,
  DishResType,
  UpdateDishBodyType,
} from "../schemaValidations/dish.schema";
const prefix = "/dishes";

const dishApiRequest = {
  //list all dish
  list: () => http.get<DishListResType>(`${prefix}`),
  // list dish with pagination
  listWithPagnation: () =>
    http.get<DishListWithPaginationResType>(`${prefix}/pagination`),
  // get dish detail by id
  getDish: (id: number) => http.get<DishResType>(`${prefix}/${id}`),
  // Add new dish
  addDish: (body: CreateDishBodyType) =>
    http.post<DishResType>(`${prefix}`, body),
  // update Dish
  updateDish: (id: number, body: UpdateDishBodyType) =>
    http.put<DishResType>(`${prefix}/${id}`, body),
  // delete Delete
  deleteDish: (id: number) => http.delete<DishResType>(`${prefix}/${id}`),
};

export default dishApiRequest;
