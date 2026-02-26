import Event from "@/database/event.model"
import connectDb from "../mongodb"

export const getSimillarEventsBySlug = async (slug: string) => {
    try {
        await connectDb()
        const event = await Event.findOne({ slug })
        if (!event) return []

        return await Event.find({
            _id: { $ne: event._id },
            tags: { $in: event.tags }
        }).lean()

    } catch {
        return []
    }
}