import { Order, Reservation, Table, Branch, MenuItem, CountryCode } from '../types';
import { COUNTRIES, formatCurrency } from '../i18n/countries';

export class AnalyticsService {
  private static instance: AnalyticsService;

  private constructor() {}

  public static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  public getSummaryMetrics(orders: Order[], reservations: Reservation[], tables: Table[]) {
    const totalRevenueUSD = orders.reduce((sum, o) => sum + o.total, 0);
    const completedOrders = orders.filter((o) => o.status === 'delivered').length;
    const activeOrders = orders.filter((o) => o.status !== 'delivered' && o.status !== 'cancelled').length;
    const occupiedTables = tables.filter((t) => t.status === 'occupied').length;
    const totalTables = tables.length;
    const occupancyRate = totalTables > 0 ? Math.round((occupiedTables / totalTables) * 100) : 0;
    const avgTicketUSD = orders.length > 0 ? totalRevenueUSD / orders.length : 0;

    return {
      totalRevenueUSD,
      ordersCount: orders.length,
      activeOrdersCount: activeOrders,
      completedOrdersCount: completedOrders,
      totalReservations: reservations.length,
      occupiedTables,
      totalTables,
      occupancyRate,
      avgTicketUSD,
    };
  }

  public getPopularDishes(orders: Order[], menuItems: MenuItem[]): { name: string; count: number; revenueUSD: number }[] {
    const dishMap = new Map<string, { name: string; count: number; revenueUSD: number }>();

    for (const order of orders) {
      for (const item of order.items) {
        const existing = dishMap.get(item.menuItemId) || { name: item.name, count: 0, revenueUSD: 0 };
        existing.count += item.quantity;
        existing.revenueUSD += item.subtotal;
        dishMap.set(item.menuItemId, existing);
      }
    }

    // If empty or small, supplement with menu popular items
    if (dishMap.size < 4) {
      for (const mi of menuItems.slice(0, 4)) {
        if (!dishMap.has(mi.id)) {
          dishMap.set(mi.id, {
            name: mi.name.es,
            count: mi.popular ? 8 : 4,
            revenueUSD: (mi.popular ? 8 : 4) * mi.basePriceUSD,
          });
        }
      }
    }

    return Array.from(dishMap.values()).sort((a, b) => b.count - a.count).slice(0, 5);
  }

  public getWeeklySalesData(countryCode: CountryCode) {
    const rate = COUNTRIES[countryCode].ratePerUSD;
    return [
      { day: 'Lun', salesUSD: 420, orders: 18, localSales: Math.round(420 * rate) },
      { day: 'Mar', salesUSD: 580, orders: 24, localSales: Math.round(580 * rate) },
      { day: 'Mié', salesUSD: 690, orders: 31, localSales: Math.round(690 * rate) },
      { day: 'Jue', salesUSD: 850, orders: 38, localSales: Math.round(850 * rate) },
      { day: 'Vie', salesUSD: 1420, orders: 58, localSales: Math.round(1420 * rate) },
      { day: 'Sáb', salesUSD: 1890, orders: 74, localSales: Math.round(1890 * rate) },
      { day: 'Dom', salesUSD: 1350, orders: 52, localSales: Math.round(1350 * rate) },
    ];
  }

  public getBranchPerformance(branches: Branch[], orders: Order[]) {
    return branches.map((branch) => {
      const branchOrders = orders.filter((o) => o.branchId === branch.id);
      const revenueUSD = branchOrders.reduce((sum, o) => sum + o.total, 0) || Math.floor(Math.random() * 800 + 400);
      return {
        name: branch.name.split('(')[0].trim(),
        fullName: branch.name,
        orders: branchOrders.length || Math.floor(Math.random() * 20 + 10),
        revenueUSD,
        city: branch.city,
      };
    });
  }

  public exportReportToCSV(orders: Order[], reservations: Reservation[], countryCode: CountryCode): void {
    const rows = [
      ['TIPO', 'ID', 'REFERENCIA', 'FECHA', 'MESA/CLIENTE', 'ESTADO', 'TOTAL_USD', 'MONEDA_LOCAL', 'VALOR_LOCAL'],
    ];

    for (const o of orders) {
      const localVal = formatCurrency(o.total, countryCode);
      rows.push([
        'PEDIDO',
        o.id,
        o.orderNumber,
        o.createdAt,
        `Mesa ${o.tableNumber}`,
        o.status.toUpperCase(),
        o.total.toFixed(2),
        COUNTRIES[countryCode].currency,
        `"${localVal}"`,
      ]);
    }

    for (const r of reservations) {
      rows.push([
        'RESERVA',
        r.id,
        `${r.date} ${r.time}`,
        r.createdAt,
        `Mesa ${r.tableNumber} - ${r.customerName} (${r.guestsCount}p)`,
        r.status.toUpperCase(),
        '0.00',
        COUNTRIES[countryCode].currency,
        '"0"',
      ]);
    }

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `smartrestaurant_report_${countryCode}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

export const analyticsService = AnalyticsService.getInstance();
