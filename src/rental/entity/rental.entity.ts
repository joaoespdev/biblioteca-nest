export interface RentalEntity {
  id: number;
  rented_at: string;
  due_date: string;
  returned_at?: string;
  renter_id: number;
  created_at: string;
  updated_at: string;
}
