"use client";

import { useEffect, useState } from "react";
import Joyride, { Step, CallBackProps, STATUS, ACTIONS } from "react-joyride";
import { usePathname } from "next/navigation";
import { useThemeStore } from "@/src/store/theme";

async function waitForElement(
  selectors: string[],
  timeout = 8000
): Promise<string | null> {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    for (const sel of selectors) {
      if (document.querySelector(sel)) return sel;
    }
    await new Promise((r) => requestAnimationFrame(r));
  }
  return null;
}

export default function GuidedTour() {
  const pathname = usePathname();
  const [run, setRun] = useState(false);
  const [steps, setSteps] = useState<Step[]>([]);
  const { theme } = useThemeStore();

  const getTourKey = () => `tour_${pathname}`;

  const getPageConfig = () => {
    if (pathname === "/dashboard")
      return {
        title: "Dashboard Overview",
        desc: "Access articles, stats, working hours, and settings from here.",
        selectors: [".dashboard-cards", ".dashboard-main", "main"],
      };
    if (pathname === "/dashboard/articles")
      return {
        title: "Articles",
        desc: "Manage and organize all knowledge articles here.",
        selectors: [".articles-section", "table", "main"],
      };
    if (pathname === "/dashboard/articles/new")
      return {
        title: "Create New Article",
        desc: "Fill out the form below to create a new article.",
        selectors: [".article-form", "form", "main"],
      };
    if (pathname.startsWith("/dashboard/articles/edit"))
      return {
        title: "Edit Article",
        desc: "Modify and update your existing article content here.",
        selectors: [".article-form", "form", "main"],
      };
    if (pathname === "/dashboard/stats")
      return {
        title: "Statistics",
        desc: "View analytics and content performance here.",
        selectors: [".stats-section", ".recharts-wrapper", "canvas", "main"],
      };
    if (pathname === "/dashboard/hours")
      return {
        title: "Working Hours",
        desc: "Manage weekly schedules and team working hours here.",
        selectors: [".p-8.shadow-inner", ".working-hours-section", "main"],
      };
    if (pathname === "/dashboard/settings")
      return {
        title: "Settings",
        desc: "Customize your profile, language, and theme preferences here.",
        selectors: [".settings-section", "form", "main"],
      };
    return null;
  };

  useEffect(() => {
    const startTour = async () => {
      const cfg = getPageConfig();
      if (!cfg) return;

      const key = getTourKey();
      if (sessionStorage.getItem(key) === "true") return;

      const found = await waitForElement(cfg.selectors, 8000);
      if (!found) return;

      const step: Step = {
        target: found,
        content: (
          <div>
            <h3 className="font-semibold mb-2">{cfg.title}</h3>
            <p>{cfg.desc}</p>
          </div>
        ),
        disableBeacon: true,
        placement: "center",
      };

      setSteps([step]);
      setRun(true);
    };

    const timer = setTimeout(startTour, 800);
    const retry = setTimeout(startTour, 3000);
    return () => {
      clearTimeout(timer);
      clearTimeout(retry);
    };
  }, [pathname]);

  const handleCallback = (data: CallBackProps) => {
    const { status, action } = data;
    if (
      [STATUS.FINISHED, STATUS.SKIPPED].includes(status) ||
      action === ACTIONS.CLOSE
    ) {
      sessionStorage.setItem(getTourKey(), "true");
      setRun(false);
    }
  };

  const darkMode = theme === "dark";

  return (
    <>
      <style jsx global>{`
        /* Make the X clean, top-right, theme-aware */
        .react-joyride__tooltip button[data-test-id="button-close"] {
          background: transparent !important;
          color: ${darkMode ? "#f9fafb" : "#111827"} !important;
          border: none !important;
          box-shadow: none !important;
          position: absolute !important;
          top: 8px !important;
          right: 8px !important;
          font-size: 18px !important;
          width: 28px !important;
          height: 28px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          border-radius: 9999px !important;
          cursor: pointer !important;
          transition: background-color 0.2s ease !important;
        }
        .react-joyride__tooltip button[data-test-id="button-close"]:hover {
          background-color: ${darkMode
            ? "rgba(255, 255, 255, 0.1)"
            : "rgba(0, 0, 0, 0.05)"} !important;
        }
      `}</style>

      <Joyride
        steps={steps}
        run={run}
        continuous={false}
        showSkipButton={false}
        showProgress={false}
        disableOverlayClose
        disableScrollParentFix
        spotlightPadding={10}
        callback={handleCallback}
        locale={{ close: "×" }}
        styles={{
          options: {
            zIndex: 9999,
            primaryColor: "#2563eb",
            backgroundColor: darkMode ? "#1e293b" : "#ffffff",
            textColor: darkMode ? "#f1f5f9" : "#111827",
          },
          tooltip: {
            textAlign: "left",
            maxWidth: "380px",
            position: "relative",
          },
        }}
      />
    </>
  );
}
