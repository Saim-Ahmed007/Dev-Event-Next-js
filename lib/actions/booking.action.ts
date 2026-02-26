'use server'

import Booking from "@/database/booking.model"
import connectDb  from '@/lib/mongodb';

export const createBooking = async({eventId, slug, email}: {eventId: string, slug: string, email: string}) => {
    try {
        await connectDb()
        await Booking.create({eventId, slug, email})
        return {success: true}
    } catch (error) {
        console.error('create booking failed', error)
        return {success: false}
    }
}