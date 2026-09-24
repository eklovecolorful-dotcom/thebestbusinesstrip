import type { Itinerary } from "@/lib/trip-builder";

const PARTY_SIZE_LABELS: Record<string, string> = {
  solo: "Solo traveler",
  couple: "Couple",
  family: "Family with kids",
};

function formatTourDate(tourDate: string): string {
  const date = new Date(`${tourDate}T00:00:00`);
  if (Number.isNaN(date.getTime())) return tourDate;
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function renderStops(stops: Itinerary["morning"]): string {
  return stops
    .map(
      (stop) => `
        <tr>
          <td style="padding: 4px 0; vertical-align: top; width: 88px; color: #8a8378; font-size: 13px; font-weight: 500;">${stop.time}</td>
          <td style="padding: 4px 0 16px 0; vertical-align: top;">
            <p style="margin: 0; font-size: 15px; font-weight: 600; color: #201c16;">${stop.title}</p>
            <p style="margin: 4px 0 0 0; font-size: 14px; line-height: 1.55; color: #4a453d;">${stop.description}</p>
          </td>
        </tr>`
    )
    .join("");
}

function renderPeriod(label: string, stops: Itinerary["morning"]): string {
  return `
    <p style="margin: 24px 0 8px 0; font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #c6a15b;">${label}</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
      ${renderStops(stops)}
    </table>`;
}

export function buildBookingConfirmationEmail(input: {
  orderId: string;
  customerName: string;
  tourDate: string;
  partySize: string;
  itinerary: Itinerary;
}): { subject: string; html: string; text: string } {
  const { orderId, customerName, tourDate, partySize, itinerary } = input;
  const formattedDate = formatTourDate(tourDate);
  const partySizeLabel = PARTY_SIZE_LABELS[partySize] ?? partySize;

  const subject = `Booking Request Received — ${itinerary.title}`;

  const html = `<!doctype html>
<html>
  <body style="margin: 0; padding: 0; background-color: #f1ebdc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f1ebdc; padding: 32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 560px; background-color: #ffffff; border-radius: 16px; overflow: hidden;">
            <tr>
              <td style="background-color: #14281c; padding: 32px 40px;">
                <table role="presentation" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="width: 32px; height: 32px; border-radius: 50%; background-color: #1f3d2b; text-align: center; vertical-align: middle; color: #faf7f0; font-size: 13px; font-weight: 600;">TH</td>
                    <td style="padding-left: 10px; color: #faf7f0; font-size: 17px; font-weight: 600;">Taiwan Local Host</td>
                  </tr>
                </table>
                <p style="margin: 20px 0 0 0; color: #c6a15b; font-size: 12px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase;">Booking Request Received</p>
                <h1 style="margin: 8px 0 0 0; color: #faf7f0; font-size: 24px; font-weight: 600; line-height: 1.3;">${itinerary.title}</h1>
              </td>
            </tr>
            <tr>
              <td style="padding: 32px 40px;">
                <p style="margin: 0 0 20px 0; font-size: 15px; line-height: 1.6; color: #201c16;">Hi ${customerName},</p>
                <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.6; color: #201c16;">
                  Thank you for booking with Taiwan Local Host. We've received your request for a private day tour, and our concierge team will reach out within <strong>24 hours</strong> to confirm final availability and details.
                </p>

                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f1ebdc; border-radius: 12px; margin-bottom: 24px;">
                  <tr>
                    <td style="padding: 20px 24px;">
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="padding: 4px 0; font-size: 13px; color: #8a8378;">Order reference</td>
                          <td style="padding: 4px 0; font-size: 13px; color: #201c16; text-align: right; font-weight: 500;">${orderId}</td>
                        </tr>
                        <tr>
                          <td style="padding: 4px 0; font-size: 13px; color: #8a8378;">Preferred date</td>
                          <td style="padding: 4px 0; font-size: 13px; color: #201c16; text-align: right; font-weight: 500;">${formattedDate}</td>
                        </tr>
                        <tr>
                          <td style="padding: 4px 0; font-size: 13px; color: #8a8378;">Party</td>
                          <td style="padding: 4px 0; font-size: 13px; color: #201c16; text-align: right; font-weight: 500;">${partySizeLabel}</td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>

                <p style="margin: 0 0 4px 0; font-size: 13px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #201c16;">Your proposed itinerary</p>
                <p style="margin: 0 0 8px 0; font-size: 14px; line-height: 1.55; color: #4a453d;">${itinerary.summary}</p>

                ${renderPeriod("Morning", itinerary.morning)}
                ${renderPeriod("Afternoon", itinerary.afternoon)}
                ${renderPeriod("Evening", itinerary.evening)}

                <p style="margin: 24px 0 0 0; font-size: 14px; line-height: 1.6; color: #4a453d;">
                  If anything above needs adjusting, just reply to this email — a real local host will get back to you personally.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding: 24px 40px; border-top: 1px solid #f1ebdc;">
                <p style="margin: 0; font-size: 12px; color: #8a8378;">Taiwan Local Host &middot; Taipei, Taiwan</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  const text = `Hi ${customerName},

Thank you for booking with Taiwan Local Host. We've received your request for "${itinerary.title}" and our concierge team will reach out within 24 hours to confirm final availability and details.

Order reference: ${orderId}
Preferred date: ${formattedDate}
Party: ${partySizeLabel}

${itinerary.summary}

If anything needs adjusting, just reply to this email.

— Taiwan Local Host`;

  return { subject, html, text };
}
