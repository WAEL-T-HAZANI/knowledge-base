"use client";

// ✅ must be FIRST import so patch runs before Joyride loads

import { useEffect, useState } from "react";
import Joyride, { Step, CallBackProps, STATUS, ACTIONS } from "react-joyride";
import { usePathname } from "next/navigation";

/** Wait until one of the given selectors exists */
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
            <p className="mb-4">{cfg.desc}</p>
            <div className="flex justify-end">
              <button
                onClick={() => {
                  sessionStorage.setItem(key, "true");
                  setRun(false);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-sm transition-all"
              >
                Close
              </button>
            </div>
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
      setRun(false);
    }
  };

  return (
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
      locale={{ close: "" }} // hide built-in close
      styles={{
        options: {
          zIndex: 9999,
          primaryColor: "#2563eb",
          backgroundColor: "#ffffff",
          textColor: "#111827",
        },
        tooltip: { textAlign: "left", maxWidth: "380px" },
        buttonClose: { display: "none" },
      }}
    />
  );
}
