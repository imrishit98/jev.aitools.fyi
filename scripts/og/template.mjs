import React from "react";

/** @typedef {'home' | 'hub' | 'learn' | 'listing' | 'default'} OgVariant */

export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;

/** Brand palette aligned with site dark theme (approx oklch tokens). */
export const palette = {
  bg: "#121820",
  bgDeep: "#0c1118",
  card: "#1a222c",
  cardBorder: "rgba(232, 244, 248, 0.12)",
  foreground: "#eef6f8",
  muted: "#94a3b8",
  primary: "#6ecfc4",
  primarySoft: "rgba(110, 207, 196, 0.18)",
  grid: "rgba(255, 255, 255, 0.045)",
  glow: "rgba(86, 180, 168, 0.35)",
};

/**
 * @param {object} props
 * @param {OgVariant} [props.variant]
 * @param {string} props.title
 * @param {string} [props.subtitle]
 * @param {string} [props.badge]
 * @param {string} [props.eyebrow]
 */
export function OgImage({
  variant = "default",
  title,
  subtitle,
  badge,
  eyebrow = "Jev Directory",
}) {
  const showHeroTitle = variant === "home";
  const displayTitle = truncate(title, variant === "listing" ? 72 : 56);
  const displaySubtitle = subtitle ? truncate(subtitle, 110) : undefined;

  return React.createElement(
    "div",
    {
      style: {
        width: OG_WIDTH,
        height: OG_HEIGHT,
        display: "flex",
        flexDirection: "column",
        position: "relative",
        backgroundColor: palette.bgDeep,
        fontFamily: "DM Sans",
      },
    },
    React.createElement("div", {
      style: {
        position: "absolute",
        inset: 0,
        backgroundImage: `radial-gradient(ellipse 90% 70% at 50% -15%, ${palette.glow}, transparent 58%), linear-gradient(${palette.grid} 1px, transparent 1px), linear-gradient(90deg, ${palette.grid} 1px, transparent 1px)`,
        backgroundSize: "100% 100%, 56px 56px, 56px 56px",
      },
    }),
    React.createElement(
      "div",
      {
        style: {
          position: "relative",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "56px 72px",
        },
      },
      React.createElement(
        "div",
        {
          style: {
            display: "flex",
            flexDirection: "column",
            gap: 28,
            padding: "48px 52px",
            borderRadius: 14,
            border: `1px solid ${palette.cardBorder}`,
            backgroundColor: palette.card,
            boxShadow: "0 24px 80px rgba(0,0,0,0.45)",
          },
        },
        React.createElement(
          "div",
          {
            style: {
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            },
          },
          React.createElement(
            "div",
            {
              style: {
                display: "flex",
                flexDirection: "column",
                gap: 6,
              },
            },
            React.createElement(
              "span",
              {
                style: {
                  fontSize: 18,
                  fontWeight: 700,
                  letterSpacing: "0.32em",
                  color: palette.primary,
                  textTransform: "uppercase",
                },
              },
              "aitools.fyi",
            ),
            React.createElement(
              "span",
              {
                style: {
                  fontFamily: "Faculty Glyphic",
                  fontSize: 28,
                  color: palette.muted,
                },
              },
              eyebrow,
            ),
          ),
          badge
            ? React.createElement(
                "div",
                {
                  style: {
                    padding: "10px 18px",
                    borderRadius: 999,
                    backgroundColor: palette.primarySoft,
                    border: `1px solid ${palette.primary}55`,
                    color: palette.primary,
                    fontSize: 22,
                    fontWeight: 600,
                    maxWidth: 340,
                    textAlign: "right",
                  },
                },
                truncate(badge, 36),
              )
            : null,
        ),
        showHeroTitle
          ? React.createElement(
              "div",
              {
                style: {
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                },
              },
              React.createElement(
                "span",
                {
                  style: {
                    fontFamily: "Faculty Glyphic",
                    fontSize: 72,
                    lineHeight: 1.05,
                    color: palette.foreground,
                  },
                },
                displayTitle,
              ),
              displaySubtitle
                ? React.createElement(
                    "span",
                    {
                      style: {
                        fontSize: 30,
                        lineHeight: 1.35,
                        color: palette.muted,
                        fontWeight: 400,
                      },
                    },
                    displaySubtitle,
                  )
                : null,
            )
          : React.createElement(
              "div",
              {
                style: {
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                },
              },
              React.createElement(
                "span",
                {
                  style: {
                    fontFamily: "Faculty Glyphic",
                    fontSize: variant === "listing" ? 58 : 64,
                    lineHeight: 1.08,
                    color: palette.foreground,
                  },
                },
                displayTitle,
              ),
              displaySubtitle
                ? React.createElement(
                    "span",
                    {
                      style: {
                        fontSize: 28,
                        lineHeight: 1.35,
                        color: palette.muted,
                        fontWeight: 400,
                      },
                    },
                    displaySubtitle,
                  )
                : null,
            ),
      ),
      React.createElement(
        "div",
        {
          style: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 28,
            paddingLeft: 8,
            paddingRight: 8,
          },
        },
        React.createElement(
          "span",
          {
            style: {
              fontSize: 22,
              color: palette.muted,
              fontWeight: 500,
            },
          },
          "TypeSafe Jev · System One",
        ),
        React.createElement(
          "span",
          {
            style: {
              fontSize: 22,
              color: palette.primary,
              fontWeight: 600,
            },
          },
          "jev.aitools.fyi",
        ),
      ),
    ),
  );
}

function truncate(text, max) {
  const clean = String(text)
    .replace(/\u2014/g, "-")
    .replace(/\u2013/g, "-")
    .replace(/\s+/g, " ")
    .trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1).trim()}…`;
}
