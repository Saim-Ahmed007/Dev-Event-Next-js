import Event from "@/database/event.model";
import connectDb from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const formData = await req.formData();
    let event;
    try {
      event = Object.fromEntries(formData.entries());
    } catch (error) {
      return NextResponse.json(
        { message: "invalid json data format" },
        { status: 400 },
      );
    }

    const file = formData.get("image");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { message: "Image file is required" },
        { status: 400 },
      );
    }

    const tags = JSON.parse(formData.get('tags') as string)
    const agenda = JSON.parse(formData.get('agenda') as string)

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResult: any = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { resource_type: "image", folder: "DevEvent" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          },
        )
        .end(buffer);
    });

    delete event.image;
    event.image = uploadResult.secure_url;

    const createdEvent = await Event.create({...event, tags: tags, agenda: agenda});
    return NextResponse.json(
      { message: "Event created", event: createdEvent},
      { status: 201 },
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "an error occured" }, { status: 400 });
  }
}

export async function GET(){
  try {
    await connectDb()
    const events = await Event.find().sort({createdAt: -1})
    return NextResponse.json({events}, {status: 201})
  } catch (error) {
    return NextResponse.json({ message: "Events not available" }, { status: 400 });
  }
}
