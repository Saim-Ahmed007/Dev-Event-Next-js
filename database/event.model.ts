import { Document } from "mongodb";
import { model, models, Schema } from "mongoose";

export interface IEvent extends Document{
    title: string,
    slug: string,
    description: string,
    overview: string,
    image: string,
    venue: string,
    location: string,
    date: string,
    time: string,
    mode: string,
    audience: string,
    agenda: string[],
    organizer: string,
    tags: string[],
    createdAt: Date,
    updatedAt: Date
}

const EventSchema = new Schema<IEvent>({
    title: {type: String, required: true, trim: true, maxLength: 100},
    slug: {type: String, unique: true, lowercase: true, trim: true},
    description: {type: String, required: true, trim: true, maxlength: 100},
    overview: {type: String, required: true, trim: true, maxlength: 500},
    image: {type: String, required: true, trim: true},
    venue: {type: String, required: true, trim: true},
    location: {type: String, required: true, trim: true},
    date: {type: String, required: true},
    time: {type: String, required: true},
    mode: {type: String, required: true, 
        enum:{
        values: ['online', 'hybrid', 'offline'],
        message: 'Mode must be either onlne, offline or hybrid',
    },},
    audience: {type: String, required: true, trim: true},
    agenda: {type: [String], required: true,
        validate: {
            validator: (v: string[]) => v.length > 0,
            message: 'At least one agenda item is required'
        }
    },
    organizer: {type: String, required: true, trim: true}, 
    tags: {type: [String], required: true,
        validate: {
            validator: (v: string[]) => v.length > 0,
            message: 'At least one tag item is required'
        }
    } 
},{timestamps: true})

EventSchema.pre('save', function(){
    const event = this as unknown as IEvent
    if(event.isModified('title') || event.isNew){
        event.slug = generateSlug(event.title)
    }
    if(event.isModified('date')){
        event.date = normalizeDate(event.date)
    }
    if(event.isModified('time')){
        event.time = normalizeTime(event.time)
    }
})

function generateSlug(title: string): string {
    return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

function normalizeDate(dateString: string){
    const date = new Date(dateString)
    if(isNaN(date.getTime())){
        throw new Error('Invalid date format')
    }
    return date.toISOString().split('T')[0]
}

function normalizeTime(timeString: string) {
    const timeRegex = /^(\d{1,2}):(\d{2})(\s*(AM|PM))?$/i;
    const match = timeString.trim().match(timeRegex)
    if(!match){
        throw new Error('invalid time format ')
    }

    let hours = parseInt(match[1])
    const minutes = match[2]
    const period = match[4]?.toUpperCase()

    if(period){
        if(period==='PM' && hours !== 12) hours += 12
        if(period==='AM' && hours === 12) hours = 0
    }
    if(hours < 0 || hours > 23 || parseInt(minutes) < 0 || parseInt(minutes) > 59){
        throw new Error('Invalid time values')
    }

    return `${hours.toString().padStart(2, '0')}:${minutes}`
}

EventSchema.index({slug: 1}, {unique: true})
EventSchema.index({date: 1, mode: 1})
const Event = models.Event || model<IEvent>('Event', EventSchema)
export default Event


