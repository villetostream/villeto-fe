// schemas/flight-schemas.ts
import { z } from 'zod';

export const flightFormSchema = z.object({
    tripType: z.enum(["oneway", "roundtrip"]),
    fromCity: z.string().min(1, "From city is required"),
    toCity: z.string().min(1, "To city is required"),
    departureDate: z.date().refine((val) => !!val, {
        message: "Transaction date is required",
    }),
    returnDate: z.date().refine((val) => !!val, {
        message: "Transaction date is required",
    }).optional(),
    flightClass: z.string().min(1, "Flight class is required"),
}).refine((data) => {
    if (data.tripType === "roundtrip" && data.returnDate) {
        return data.returnDate >= data.departureDate;
    }
    return true;
}, {
    message: "Return date must be after departure date",
    path: ["returnDate"],
});

export const hotelFormSchema = z.object({
    destinationCity: z.string().min(1, "Destination city is required"),
    hotelName: z.string().min(1, "Hotel name is required"),
    checkInDate: z.date().refine((val) => !!val, {
        message: "Transaction date is required",
    }),
    checkOutDate: z.date().refine((val) => !!val, {
        message: "Transaction date is required",
    }),
    roomType: z.string().min(1, "Room type is required"),
}).refine((data) => data.checkOutDate > data.checkInDate, {
    message: "Check-out date must be after check-in date",
    path: ["checkOutDate"],
});

export type FlightFormData = z.infer<typeof flightFormSchema>;
export type HotelFormData = z.infer<typeof hotelFormSchema>;