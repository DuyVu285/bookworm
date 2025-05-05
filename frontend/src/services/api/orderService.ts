import axios from "axios";

interface OrderItemInput {
  book_id: number;
  quantity: number;
  price: number;
}

interface OrderWithItemsCreate {
  user_id: number;
  order_date: string;
  order_amount: number;
  items: OrderItemInput[];
}

interface OrderItem {
  id: number;
  order_id: number;
  book_id: number;
  quantity: number;
  price: number;
}

interface OrderWithItemsResponse {
  id: number;
  user_id: number;
  order_date: string;
  order_amount: number;
  items: OrderItem[];
}

const baseURL = import.meta.env.VITE_SERVER_API_URL + "/orders";

const api = axios.create({ baseURL });

const orderService = {
  async placeOrder(
    orderData: OrderWithItemsCreate
  ): Promise<OrderWithItemsResponse> {
    try {
      const response = await api.post<OrderWithItemsResponse>(
        "/place-order",
        orderData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default orderService;
