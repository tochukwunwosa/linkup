import { Button, Section, Text } from "@react-email/components";
import * as React from "react";
import { EmailLayout } from "../components/EmailLayout";
import { colors } from "../emailTheme";

interface DigestConfirmEmailProps {
  stateLabel: string;
  includeOnline: boolean;
  confirmUrl: string;
}

export const DigestConfirmEmail = ({
  stateLabel = "Lagos",
  includeOnline = true,
  confirmUrl = "https://techlinkup.xyz/api/digest/confirm?token=example",
}: DigestConfirmEmailProps) => {
  return (
    <EmailLayout
      previewText="Confirm your weekly tech events email"
      accentColor={colors.blue}
      headerSubtitleColor={colors.blueSubtitle}
      headerTitle="Confirm your email"
      headerSubtitle="One click and you're in"
    >
      <Text className="m-0 mb-4 text-brand-dark text-[16px] leading-6 font-semibold">
        Hi there,
      </Text>
      <Text className="m-0 mb-6 text-brand-muted text-[15px] leading-6">
        Please confirm that you&apos;d like a weekly email every Monday with tech
        events in <strong>{stateLabel}</strong>
        {includeOnline ? " and online" : ""}.
      </Text>

      <Section className="text-center py-1">
        <Button
          href={confirmUrl}
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
          Confirm my email
        </Button>
      </Section>

      <Text className="m-0 mt-6 text-brand-muted text-[13px] leading-5">
        This link works for 7 days. If you didn&apos;t ask for this, you can
        ignore this email and you won&apos;t hear from us again.
      </Text>
    </EmailLayout>
  );
};

export default DigestConfirmEmail;
