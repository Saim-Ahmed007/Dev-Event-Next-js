import BookEvent from "@/components/BookEvent";
import EventCard from "@/components/EventCard";
import { IEvent } from "@/database/event.model";
import { getSimillarEventsBySlug } from "@/lib/actions/event.actions";
import { cacheLife } from "next/cache";
import Image from "next/image";
import { notFound } from "next/navigation";
const BASE_URL = process.env.NEXT_PUBLIC_URL

const EventDetailsItem = ({icon, alt, label} : {icon: string, alt: string, label: string}) => (
    <div className="flex gap-2 items-center">
        <Image src={icon} alt={alt} width={17} height={17}/>
        <p>{label}</p>
    </div>
)

const EventAgenda = ({agendaItem}: {agendaItem: string[]}) => (
    <div className="agenda">
        <h2 className="text-xl font-semibold">Agenda</h2>
        <ul>
            {agendaItem.map((item) => (
                <li key={item}>{item}</li>
            ))}
        </ul>

    </div>
)

const EventTags = ({tags}: {tags: string[]}) => (
    <div className="flex flex-row gap-1.5 flex-wrap">
        {tags.map((tag) => (
            <div className="pill" key={tag}>{tag}</div>
        ))}
    </div>
)

const EventDetails = async({params}: {params: Promise<{slug: string}>}) => {
    'use cache'
    cacheLife('hours')
    const {slug} = await params
    const request = await fetch(`${BASE_URL}/api/events/${slug}`,{next: {revalidate: 60}}) 
    const data = await request.json()
    const event = data.event
    if (!event?.description) return notFound()
    const { description, image, overview, date, time, location, mode, agenda, audience, organizer, tags} = event
    const bookings = 10
    const simillarEvents: IEvent[] = await getSimillarEventsBySlug(slug)
    
    return (
        <section className="event">
            <div className="header">
                <h1>{slug}</h1>
                <p className="my-4">{description}</p>
            </div>
            <div className="details flex flex-col sm:flex-row gap-10">
            {/* left side event content */}
            <div className="details flex flex-col gap-6">
            <Image src={image} alt="event banner" width={800} height={800} className="banner"/>
            <section className="flex-col gap-2">
                <p className="text-xl font-semibold">Overview</p>
                <p>{overview}</p>
            </section>
            <section className="flex-col gap-2">
                <p className="text-xl font-semibold">Event Details</p>
                <EventDetailsItem icon="/icons/calendar.svg" alt="calendar" label={date}/>
                <EventDetailsItem icon="/icons/clock.svg" alt="clock" label={time}/>
                <EventDetailsItem icon="/icons/pin.svg" alt="pin" label={location}/>
                <EventDetailsItem icon="/icons/mode.svg" alt="mode" label={mode}/>
                <EventDetailsItem icon="/icons/audience.svg" alt="audience" label={audience}/>
            </section>
            <EventAgenda agendaItem={agenda}/>

            <section>
                <h2 className="text-lg font-semibold">Organizer</h2>
                <p>{organizer}</p>
            </section>

            <EventTags tags={tags}/>
            </div>
            {/* right side booking content */}
            <aside className="booking">
                <div className="bg-dark-100 border-dark-200 card-shadow flex w-full flex-col gap-6 rounded-[10px] border px-5 py-6">
                    <p className="text-lg font-semibold">Book Now</p>
                    {bookings > 0? (
                        <p className="text-sm">Join {bookings} people have already booked their spot </p>
                    ): (
                        <p className="taxt-sm">Be the first to book your spot</p>
                    )}
                    <BookEvent eventId={event._id} slug={event.slug}/>
                </div>
                
            </aside>
            </div>
            <div className="flex flex-col w-full gap-4 pt-20">
                <h2>Simillar Events</h2>
                <div className="events">
                    {simillarEvents.length > 0 && 
                    simillarEvents.map((simillarEvent: IEvent) => (
                        <EventCard key={simillarEvent.title} {...simillarEvent}/>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default EventDetails;