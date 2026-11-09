import { Restaurant, Branch, Table, TableStatus, TableZone, CountryCode } from '../types';

export class RestaurantService {
  private static instance: RestaurantService;

  private constructor() {}

  public static getInstance(): RestaurantService {
    if (!RestaurantService.instance) {
      RestaurantService.instance = new RestaurantService();
    }
    return RestaurantService.instance;
  }

  public getAvailableTables(tables: Table[], branchId: string): Table[] {
    return tables.filter((t) => t.branchId === branchId && t.status === 'available');
  }

  public getTableOccupancyRate(tables: Table[], branchId?: string): number {
    const targetTables = branchId ? tables.filter((t) => t.branchId === branchId) : tables;
    if (targetTables.length === 0) return 0;
    const occupied = targetTables.filter((t) => t.status === 'occupied').length;
    return Math.round((occupied / targetTables.length) * 100);
  }

  public updateTableStatus(
    tables: Table[],
    tableId: string,
    newStatus: TableStatus,
    currentOrderId?: string
  ): Table[] {
    return tables.map((t) => {
      if (t.id === tableId) {
        return {
          ...t,
          status: newStatus,
          currentOrderId: newStatus === 'available' ? undefined : (currentOrderId ?? t.currentOrderId),
        };
      }
      return t;
    });
  }

  public createNewTable(params: {
    branchId: string;
    existingTables: Table[];
    capacity: number;
    zone: TableZone;
  }): Table {
    const branchTables = params.existingTables.filter((t) => t.branchId === params.branchId);
    const nextNumber = branchTables.length > 0 ? Math.max(...branchTables.map((t) => t.number)) + 1 : 1;
    return {
      id: `tbl-${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`,
      branchId: params.branchId,
      number: nextNumber,
      capacity: params.capacity,
      zone: params.zone,
      status: 'available',
    };
  }

  public createRestaurant(data: Omit<Restaurant, 'id'>): Restaurant {
    return {
      id: `rest-${Date.now().toString(36)}`,
      ...data,
    };
  }

  public createBranch(data: Omit<Branch, 'id'>): Branch {
    return {
      id: `branch-${Date.now().toString(36)}`,
      ...data,
    };
  }
}

export const restaurantService = RestaurantService.getInstance();
