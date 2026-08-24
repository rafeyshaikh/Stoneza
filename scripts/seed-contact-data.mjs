import dotenv from "dotenv";
import { connectDB } from "../lib/databaseConnection.js";
import Pages from "../models/Pages.model.js";

dotenv.config();

async function seedContactData() {
  try {
    console.log("Connecting to MongoDB Atlas...");
    await connectDB();
    console.log("Connected successfully.\n");

    let pagesDoc = await Pages.findOne();
    if (!pagesDoc) {
      pagesDoc = new Pages({});
    }

    if (!pagesDoc.contactUs) {
      pagesDoc.contactUs = {};
    }

    // 1. Hero & Cards
    pagesDoc.contactUs.hero = {
      bgImage: "https://res.cloudinary.com/chlmognp/image/upload/v1785340267/stoneza/homepage/hero/newslide4-ms69hw8o.png",
    };

    pagesDoc.contactUs.cards = {
      whatsappPhone: "+91 78771 08154",
      whatsappHref: "https://wa.me/917877108154",
      emailAddress: "sales@stoneza.in",
      officeLocation: "Bhilwara, Rajasthan",
      workingHours: "Mon–Sat, 9:30–18:30 IST",
      gstin: "08AAWCA2095G1Z9",
      cin: "U14100RJ2021PTC076892",
    };

    // 2. Speak to someone directly (People Directory)
    pagesDoc.contactUs.peopleSection = {
      people: [
        {
          name: "Saniya",
          role: "Sales — first point of contact",
          title: "Sales Consultant",
          description:
            "Start here for quotations, samples, availability and lead times. Saniya works with architects, contractors and homeowners across India and will pull in technical support where a drawing needs it.",
          phone: "+91 78771 08154",
          whatsapp: "+91 78771 08154",
          email: "saniya@stoneza.in",
          hours: "Mon–Sat, 9:30–18:30 IST",
          linkedIn: "",
          tag: "Quotations · Samples · Lead times",
        },
        {
          name: "Kanishk Ostwal",
          role: "Direct line",
          title: "Director — Anantay Exports Pvt. Ltd.",
          description:
            "For large projects, specification support, partnership and distribution enquiries, export programmes, or anything that has not been resolved to your satisfaction. Reach out directly — it comes to me, not to a queue.",
          phone: "+91 99500 36866",
          whatsapp: "+91 99500 36866",
          email: "kanishk.ostwal@stoneza.in",
          hours: "Mon–Sat, 9:30–18:30 IST",
          linkedIn: "https://www.linkedin.com/company/thestoneza",
          tag: "Projects · Specification · Partnerships · Export",
        },
      ],
    };

    // 3. What happens next (Four steps, no chasing)
    pagesDoc.contactUs.whatHappensNext = {
      eyebrow: "What happens next",
      title: "Four steps, no chasing",
      steps: [
        {
          number: "01",
          text: "A consultant reads what you sent and comes back with the stones that fit — including ones you did not ask about, if they suit the job better.",
        },
        {
          number: "02",
          text: "You get a firm quotation against the actual requirement, with lead time. Not an indicative range that changes later.",
        },
        {
          number: "03",
          text: "Physical samples go out free — wet and dry, because every stone darkens in rain and no photograph shows it.",
        },
        {
          number: "04",
          text: "On approval, one consultant carries the order through production, dispatch and delivery. You are not handed between departments.",
        },
      ],
      specifyingNote: {
        title: "Specifying rather than buying?",
        description:
          "Ask for the specification pack — technical datasheets, Stoneza spec codes and physical samples for the stones on your drawing. Written into a BOQ, a spec code names the stone, finish and thickness, so what arrives is what you drew.",
      },
    };

    // 4. Location map
    pagesDoc.contactUs.location = {
      mapEmbedUrl:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d115682.49392576307!2d74.57076418854448!3d25.348612140417937!2m3!1f0!0f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3968c237a505b38d%3A0xb3cf51d8b72445b2!2sBhilwara%2C%20Rajasthan!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
    };

    pagesDoc.markModified("contactUs");
    await pagesDoc.save();

    console.log("Successfully seeded Contact Us page data in MongoDB Atlas.");
    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
}

seedContactData();
