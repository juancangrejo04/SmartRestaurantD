import { Reservation, ReservationStatus, Table } from '../types';

export class ReservationService {
  private static instance: ReservationService;

  private constructor() {}

  public static getInstance(): ReservationService {
    if (!ReservationService.instance) {
      ReservationService.instance = new ReservationService();
    }
    return ReservationService.instance;
  }

  /**
   * Helper to convert "HH:mm" to total minutes from midnight
   */
  private timeToMinutes(timeStr: string): number {
    const [hours, mins] = timeStr.split(':').map(Number);
    return hours * 60 + (mins || 0);
  }

  /**
   * Validates if a table is available without colliding with an existing active booking.
   * Collision window: 90 minutes before or after.
   */
  public checkTableCollision(
    reservations: Reservation[],
    tableId: string,
    date: string,
    time: string,
    excludeReservationId?: string
  ): { hasCollision: boolean; conflictingReservation?: Reservation } {
    const targetMinutes = this.timeToMinutes(time);
    const WINDOW_MINUTES = 90;

    const activeReservations = reservations.filter(
      (r) =>
        r.tableId === tableId &&
        r.date === date &&
        r.id !== excludeReservationId &&
        (r.status === 'confirmed' || r.status === 'pending')
    );

    for (const res of activeReservations) {
      const resMinutes = this.timeToMinutes(res.time);
      if (Math.abs(targetMinutes - resMinutes) < WINDOW_MINUTES) {
        return { hasCollision: true, conflictingReservation: res };
      }
    }

    return { hasCollision: false };
  }

  /**
   * Creates a new reservation record
   */
  public createReservation(data: {
    branchId: string;
    restaurantId: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    date: string;
    time: string;
    guestsCount: number;
    table: Table;
    notes?: string;
  }): Reservation {
    return {
      id: `res-${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`,
      branchId: data.branchId,
      restaurantId: data.restaurantId,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone,
      date: data.date,
      time: data.time,
      guestsCount: data.guestsCount,
      tableId: data.table.id,
      tableNumber: data.table.number,
      status: 'pending',
      notes: data.notes,
      createdAt: new Date().toISOString(),
    };
  }

  /**
   * Updates status of reservation
   */
  public updateStatus(
    reservations: Reservation[],
    reservationId: string,
    status: ReservationStatus
  ): Reservation[] {
    return reservations.map((r) => (r.id === reservationId ? { ...r, status } : r));
  }
}

export const reservationService = ReservationService.getInstance();
