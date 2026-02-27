import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import * as React from "react";
import { colors, emailTailwindConfig } from "../emailTheme";

interface EmailLayoutProps {
  previewText: string;
  accentColor: string;
  headerSubtitleColor: string;
  headerTitle: string;
  headerSubtitle?: string;
  children: React.ReactNode;
}

export function EmailLayout({
  previewText,
  accentColor,
  headerSubtitleColor,
  headerTitle,
  headerSubtitle,
  children,
}: EmailLayoutProps) {
  const year = new Date().getFullYear();

  return (
    <Html lang="en">
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind config={emailTailwindConfig}>
        <Body className="bg-brand-bg font-sans">
          <Container className="mx-auto my-10 max-w-[560px] bg-brand-card rounded-lg overflow-hidden">
            {/* Header */}
            <Section
              style={{ backgroundColor: accentColor }}
              className="px-7.5 py-[36px] text-center"
            >
              <Img
                src="https://techlinkup.xyz/logo.png"
                alt="TechLinkUp"
                width="140"
                height="140"
                className="block w-35 h-12.5 mx-auto mb-4"
              />
              <Heading
                as="h1"
                className="m-0 text-white text-[26px] font-bold leading-tight"
              >
                {headerTitle}
              </Heading>
              {headerSubtitle && (
                <Text
                  className="mt-2 mb-0 text-[15px]"
                  style={{ color: headerSubtitleColor }}
                >
                  {headerSubtitle}
                </Text>
              )}
            </Section>

            {/* Content slot */}
            <Section className="px-[30px] py-9">{children}</Section>

            {/* Footer */}
            <Section className="bg-brand-bg px-[30px] py-6 text-center border-t border-brand-border">
              <Text className="m-0 text-brand-muted text-[13px]">
                This is an automated message &middot;{" "}
                <a
                  href="https://techlinkup.xyz"
                  className="text-brand-muted underline"
                >
                  techlinkup.xyz
                </a>
              </Text>
              <Text
                className="mt-2 mb-0 text-[12px]"
                style={{ color: colors.gray400 }}
              >
                &copy; {year} TechLinkUp. All rights reserved.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
