import { Document, model, models, Schema, Types } from "mongoose";
import Event from "./event.model";

export interface IBooking extends Document{
    eventId: Types.ObjectId,
    email: string,
    createdAt: string,
    updatedAt: string
}

const BookingSchema = new Schema<IBooking>({
    eventId: {type: Schema.Types.ObjectId, ref: 'Event', required: true},
    email: {type: String, required: true, trim: true, lowercase: true, 
        validate: {
            validator: function (email: string){
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(email); 
            },
            message: "Please enter a valid email address",
        }
    }
},{timestamps: true})

// BookingSchema.pre('save', async function (next){
//     const booking = this as IBooking
//     if(booking.isModified('eventId') || booking.isNew){
//         try {
//             const eventExist = await Event.findById(booking.eventId).select('_id')
//             if(!eventExist){
//                 const error = new Error(`Event with Id ${booking.eventId} does not exist`)
//                 error.name = 'validation error'
//                 return next(error)
//             }

//         } catch {
//             const validationError = new Error(`Invalid Event Id format or database error`)
//                 validationError.name = 'validation error'
//                 return next(validationError)
//         }
// }
//     next()
// })

//pre hook function
BookingSchema.pre('save', async function () {
  const booking = this as IBooking;
  if (booking.isModified('eventId') || booking.isNew) {
    try {
      const eventExist = await Event.findById(booking.eventId).select('_id');

      if (!eventExist) {
        throw new Error(`Event with Id ${booking.eventId} does not exist`);
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new Error('Invalid Event Id format or database error');
    }
  }
});

BookingSchema.index({eventId: 1})
BookingSchema.index({eventId:1, createdAt: -1})
BookingSchema.index({email: 1})

const Booking = models.Booking || model<IBooking>('Booking', BookingSchema)
export default Booking