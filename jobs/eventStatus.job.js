const cron = require("node-cron");
const Event = require("../models/Event");
const Registration = require("../models/Registration");
const { sendEmail } = require("../services/email.service");

// Run every 5 minutes
cron.schedule("* * * * *", async () => {
  try {
    const now = new Date();

    // Fetch events that are upcoming or ongoing
    const events = await Event.find({
      status: { $in: ["UPCOMING", "ONGOING"] },
    });

    for (const event of events) {
      const startTime = new Date(event.startTime);
      const endTime = new Date(event.endTime);

      // 1️⃣ Update event status
      if (now >= startTime && now <= endTime && event.status !== "ONGOING") {
        event.status = "ONGOING";
        await event.save();
      } else if (now > endTime && event.status !== "COMPLETED") {
        event.status = "COMPLETED";
        await event.save();
      }

      // 2️⃣ Send reminder 1 hour before event
      const diffMinutes = (startTime - now) / 1000 / 60;

      if (diffMinutes <= 60 && diffMinutes >= 0) {
        const registrations = await Registration.find({
          eventId: event._id,
          reminderSent: false,
        }).populate("userId");

        for (const reg of registrations) {
          const user = reg.userId;
          if (!user) continue;

          try {
            // Beautiful email template
            await sendEmail({
              to: user.email,
              subject: `Reminder: "${event.title}" starts soon!`,
              text: `Hi ${user.name}, your event "${event.title}" starts at ${event.startTime}.`,
              html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
                  <div style="background-color: #4CAF50; color: white; padding: 20px; text-align: center;">
                    <h2 style="margin: 0;">Event Reminder</h2>
                  </div>
                  <div style="padding: 20px; color: #333;">
                    <p>Hi <strong>${user.name}</strong>,</p>
                    <p>Your event "<strong>${event.title}</strong>" starts in less than an hour!</p>
                    ${event.image?.url ? `<img src="${event.image.url}" alt="${event.title}" style="width:100%; max-height: 200px; object-fit: cover; border-radius: 8px; margin-bottom: 15px;">` : ""}
                    <table style="width:100%; margin-bottom:15px; border-collapse: collapse;">
                      <tr><td style="padding:8px; font-weight:bold;">Start Time:</td><td style="padding:8px;">${startTime.toLocaleString()}</td></tr>
                      <tr><td style="padding:8px; font-weight:bold;">End Time:</td><td style="padding:8px;">${endTime.toLocaleString()}</td></tr>
                      <tr><td style="padding:8px; font-weight:bold;">Location:</td><td style="padding:8px;">${event.location} (${event.mode})</td></tr>
                      <tr><td style="padding:8px; font-weight:bold;">Available Seats:</td><td style="padding:8px;">${event.availableSeats}</td></tr>
                    </table>
                    <p style="text-align:center;">
                    </p>
                    <p style="font-size:12px; color:#777; margin-top:20px;">This is an automated reminder. Please do not reply.</p>
                  </div>
                </div>
              `,
            });

            // Mark reminder as sent
            reg.reminderSent = true;
            await reg.save();
          } catch (err) {
            console.error(`Failed to send email to ${user.email}`, err);
          }
        }
      }
    }
  } catch (err) {
    console.error("Event cron job error:", err);
  }
});
