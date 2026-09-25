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

function formatAmount(cents: number): string {
  return `$${(cents / 100).toFixed(2)} USD`;
}

function formatTourDateZh(tourDate: string): string {
  const date = new Date(`${tourDate}T00:00:00`);
  if (Number.isNaN(date.getTime())) return tourDate;
  return date.toLocaleDateString("zh-TW", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });
}

const PARTY_SIZE_LABELS_BILINGUAL: Record<string, string> = {
  solo: "Solo traveler / 單獨旅行",
  couple: "Couple / 兩人同行",
  family: "Family with kids / 親子家庭",
  unspecified: "Not specified / 未提供",
};

function renderPeriodBilingual(labelEn: string, labelZh: string, stops: Itinerary["morning"]): string {
  return renderPeriod(`${labelEn} / ${labelZh}`, stops);
}

export function buildPaymentConfirmedEmail(input: {
  orderId: string;
  customerName: string;
  tourDate: string;
  partySize: string;
  itinerary: Itinerary;
  amountPaidCents: number;
}): { subject: string; html: string; text: string } {
  const { orderId, customerName, tourDate, partySize, itinerary, amountPaidCents } = input;
  const formattedDateEn = formatTourDate(tourDate);
  const formattedDateZh = formatTourDateZh(tourDate);
  const partySizeLabel = PARTY_SIZE_LABELS_BILINGUAL[partySize] ?? partySize;
  const amountPaid = formatAmount(amountPaidCents);

  const subject = `Payment Confirmed / 付款已確認 — ${itinerary.title}`;

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
                <p style="margin: 20px 0 0 0; color: #c6a15b; font-size: 12px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase;">Payment Confirmed / 付款已確認</p>
                <h1 style="margin: 8px 0 0 0; color: #faf7f0; font-size: 24px; font-weight: 600; line-height: 1.3;">${itinerary.title}</h1>
              </td>
            </tr>
            <tr>
              <td style="padding: 32px 40px;">
                <p style="margin: 0 0 4px 0; font-size: 15px; line-height: 1.6; color: #201c16;">Hi ${customerName},</p>
                <p style="margin: 0 0 20px 0; font-size: 15px; line-height: 1.6; color: #201c16;">
                  Your payment has been received and your day is officially locked in. We look forward to hosting you — your local host will be in touch before your tour date with final meeting details.
                </p>
                <p style="margin: 0 0 4px 0; font-size: 15px; line-height: 1.6; color: #201c16;">${customerName} 您好，</p>
                <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.6; color: #201c16;">
                  我們已收到您的付款，行程日期正式鎖定。期待為您服務——您的在地達人將在出發日期前與您聯繫，確認最終集合細節。
                </p>

                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f1ebdc; border-radius: 12px; margin-bottom: 24px;">
                  <tr>
                    <td style="padding: 20px 24px;">
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="padding: 4px 0; font-size: 13px; color: #8a8378;">Order reference / 訂單編號</td>
                          <td style="padding: 4px 0; font-size: 13px; color: #201c16; text-align: right; font-weight: 500;">${orderId}</td>
                        </tr>
                        <tr>
                          <td style="padding: 4px 0; font-size: 13px; color: #8a8378;">Tour date / 出發日期</td>
                          <td style="padding: 4px 0; font-size: 13px; color: #201c16; text-align: right; font-weight: 500;">${formattedDateEn}<br />${formattedDateZh}</td>
                        </tr>
                        <tr>
                          <td style="padding: 4px 0; font-size: 13px; color: #8a8378;">Party / 同行人數</td>
                          <td style="padding: 4px 0; font-size: 13px; color: #201c16; text-align: right; font-weight: 500;">${partySizeLabel}</td>
                        </tr>
                        <tr>
                          <td style="padding: 4px 0; font-size: 13px; color: #8a8378;">Amount paid / 已付金額</td>
                          <td style="padding: 4px 0; font-size: 13px; color: #201c16; text-align: right; font-weight: 500;">${amountPaid}</td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>

                <p style="margin: 0 0 4px 0; font-size: 13px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #201c16;">Your itinerary / 您的行程</p>
                <p style="margin: 0 0 8px 0; font-size: 14px; line-height: 1.55; color: #4a453d;">${itinerary.summary}</p>

                ${renderPeriodBilingual("Morning", "上午", itinerary.morning)}
                ${renderPeriodBilingual("Afternoon", "下午", itinerary.afternoon)}
                ${renderPeriodBilingual("Evening", "晚上", itinerary.evening)}

                <p style="margin: 24px 0 4px 0; font-size: 14px; line-height: 1.6; color: #4a453d;">
                  Questions before your trip? Just reply to this email — a real local host will get back to you personally.
                </p>
                <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #4a453d;">
                  出發前有任何問題嗎？直接回覆這封信即可，我們的在地達人會親自為您解答。
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

Your payment has been received and your day is officially locked in. Your local host will be in touch before your tour date with final meeting details.

${customerName} 您好，

我們已收到您的付款，行程日期正式鎖定。您的在地達人將在出發日期前與您聯繫，確認最終集合細節。

Order reference / 訂單編號: ${orderId}
Tour date / 出發日期: ${formattedDateEn} / ${formattedDateZh}
Party / 同行人數: ${partySizeLabel}
Amount paid / 已付金額: ${amountPaid}

${itinerary.summary}

Questions before your trip? Just reply to this email.
出發前有任何問題嗎？直接回覆這封信即可。

— Taiwan Local Host`;

  return { subject, html, text };
}
