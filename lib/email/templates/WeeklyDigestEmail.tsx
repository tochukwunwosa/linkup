import { Button, Link, Section, Text } from "@react-email/components";
import * as React from "react";
import { EmailLayout } from "../components/EmailLayout";
import { colors } from "../emailTheme";

export interface DigestEmailEvent {
  title: string;
  url: string;
  when: string;
  where: string;
  price: string;
}

interface WeeklyDigestEmailProps {
  stateLabel: string;
  weekLabel: string;
  events: DigestEmailEvent[];
  moreCount: number;
  browseUrl: string;
  unsubscribeUrl: string;
}

export const WeeklyDigestEmail = ({
  stateLabel = "Lagos",
  weekLabel = "Mon 2 Nov – Sun 8 Nov",
  events = [],
  moreCount = 0,
  browseUrl = "https://techlinkup.xyz/location/lagos",
  unsubscribeUrl = "https://techlinkup.xyz/email-alerts/unsubscribe?token=example",
}: WeeklyDigestEmailProps) => {
  return (
    <EmailLayout
      previewText={`${events.length} tech event${events.length === 1 ? "" : "s"} this week in ${stateLabel}`}
      accentColor={colors.blue}
      headerSubtitleColor={colors.blueSubtitle}
      headerTitle={`This week in ${stateLabel}`}
      headerSubtitle={`${weekLabel} · times in WAT`}
    >
      {events.map((event) => (
        <Section
          key={event.url}
          style={{
            border: "1px solid #cfd1d4",
            borderLeftWidth: "4px",
            borderLeftColor: colors.blue,
          }}
          className="bg-brand-card rounded-md px-5 pt-4 pb-3 mb-4"
        >
          <Link
            href={event.url}
            className="text-brand-dark text-[16px] font-semibold leading-6 no-underline"
          >
            {event.title}
          </Link>
          <Text className="m-0 mt-2 text-brand-muted text-[14px] leading-[22px]">
            {event.when}
            <br />
            {event.where} · {event.price}
          </Text>
        </Section>
      ))}

      {moreCount > 0 && (
        <Text className="m-0 mb-4 text-brand-muted text-[14px] leading-[22px]">
          Plus {moreCount} more event{moreCount === 1 ? "" : "s"} this week.
        </Text>
      )}

      <Section className="text-center py-1">
        <Button
          href={browseUrl}
          style={{
            display: "inline-block",
            backgroundColor: colors.blue,
            color: "#ffffff",
            textDecoration: "none",
            padding: "13px 36px",
            borderRadius: "6px",
            fontSize: "15px",
            fontWeight: "600",
          }}
        >
          See all events
        </Button>
      </Section>

      <Text className="m-0 mt-6 text-brand-muted text-[12px] leading-5 text-center">
        You&apos;re getting this because you signed up for weekly tech events in{" "}
        {stateLabel}.{" "}
        <Link href={unsubscribeUrl} style={{ color: colors.muted, textDecoration: "underline" }}>
          Unsubscribe
        </Link>
      </Text>
    </EmailLayout>
  );
};

export default WeeklyDigestEmail;
