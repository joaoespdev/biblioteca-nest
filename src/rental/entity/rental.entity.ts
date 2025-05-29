export interface RentalEntity {
  id: number;
  rentedAt: string;
  dueDate: string;
  returnedAt?: string;
  renterId: number;
  createdAt: string;
  updatedAt: string;
}
