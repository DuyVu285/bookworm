import axios from "axios";

export interface Review {
  book_id: number;
  review_title: string;
  review_details?: string;
  review_date: string;
  rating_star: number;
}

export interface ReviewResponse {
  reviews: Review[];
  total_items: number;
  total_pages: number;
  start_item: number;
  end_item: number;
  limit: number;
  page: number;
}

export interface ReviewCreate {
  book_id: number;
  review_title: string;
  review_details?: string;
  review_date: string;
  rating_star: number;
}

export interface StarDistribution {
  rating_star: number;
  count: number;
}

export interface StarDistributionResponse {
  reviews: StarDistribution[];
}

const baseURL = import.meta.env.VITE_SERVER_API_URL + "/reviews";

const api = axios.create({ baseURL });

const reviewService = {
  async getReviewsByBookId({
    book_id,
    page,
    limit,
    sort,
    rating = 0,
  }: {
    book_id: number;
    page: number;
    limit: number;
    sort: string;
    rating: number;
  }): Promise<ReviewResponse> {
    try {
      const params = new URLSearchParams({
        book_id: String(book_id),
        page: String(page),
        limit: String(limit),
        sort,
        ...(rating !== undefined && { rating: String(rating) }),
      });

      const response = await api.get<ReviewResponse>(`/?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async createReview(review: ReviewCreate): Promise<Review> {
    try {
      const response = await api.post<Review>("/", review);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getAverageRating(book_id: number): Promise<number> {
    try {
      const response = await api.get<number>(`/average?book_id=${book_id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getStarDistribution(
    book_id: number
  ): Promise<StarDistributionResponse> {
    try {
      const response = await api.get<StarDistributionResponse>(
        `/distribution?book_id=${book_id}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getTotalReviewsByBookId(book_id: number): Promise<number> {
    try {
      const response = await api.get<number>(`/total?book_id=${book_id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default reviewService;
