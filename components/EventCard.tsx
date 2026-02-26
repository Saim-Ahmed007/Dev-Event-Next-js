import Image from "next/image";
import Link from "next/link";

interface Props {
    title: string,
    image: string,
    slug: string,
    location: string,
    date: string,
    time: string
}

const EventCard = ({title, image, slug, location, date, time}: Props) => {
    return (
        <Link href={`/events/${slug}`}>
            <Image src={image} alt={title} width={410} height={300} className="poster mb-2"/>
            <div className="flex flex-row gap-2 my-1">
            <Image src="/icons/pin.svg" alt="location" width={14} height={14}/>
            <p className="text-sm text-zinc-400">{location}</p>
            </div>
            <p className="title">{title}</p>
            <div className="datetime flex gap-6 my-1">
                <div className="flex gap-2">
                    <Image src="/icons/calendar.svg" alt="date" width={14} height={14}/>
                    <p>{date}</p>
                </div>
                <div className="flex gap-2">
                    <Image src="/icons/clock.svg" alt="date" width={14} height={14}/>
                    <p>{time}</p>
                </div>
            </div>
            
        </Link>
    );
};

export default EventCard;