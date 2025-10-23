import "server-only";

import {
  getAnalytics,
  getProductAnalytics,
} from "@/app/actions/analytics-actions";
import { requireBusiness } from "../business/require-busines";
import type { AnalyticsDTO, AnalyticsPeriod } from "./analytics.dto";

export class AnalyticsDAL {
  private constructor() {}

  static async create() {
    await requireBusiness();
    return new AnalyticsDAL();
  }

  async getAnalytics(period: AnalyticsPeriod = "30d"): Promise<AnalyticsDTO> {
    // getAnalytics already requires business, but keep the DAL contract
    return await getAnalytics(period);
  }

  async getProductAnalytics(
    productId: string,
    period: AnalyticsPeriod = "30d",
  ) {
    return await getProductAnalytics(productId, period);
  }
}
