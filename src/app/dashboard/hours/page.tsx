"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import { useDashboardStore } from "@/src/store/dashboard";
import { useWorkingHoursStore } from "@/src/store/workingHours";
import Loader from "@/src/components/ui/Loader";
import Card from "@/src/components/ui/Card";
import { useTranslations } from "next-intl";

const DayRow = dynamic(() => import("@/src/components/working-hours/DayRow"), {
  ssr: false,
  loading: () => <Loader text="Loading schedule..." />,
});

const UnsavedBanner = dynamic(
  () => import("@/src/components/working-hours/UnsavedBanner"),
  {
    ssr: false,
    loading: () => <Loader text="Loading banner..." />,
  }
);

export default function WorkingHoursPage() {
  const { setActiveTab } = useDashboardStore();
  const { week } = useWorkingHoursStore();
  const t = useTranslations("hours");

  useEffect(() => {
    setActiveTab("hours");
  }, [setActiveTab]);

  return (
    <Card className="p-8 shadow-inner border border-[var(--borderColor)] bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300">
      <UnsavedBanner />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
        {week.map((day) => (
          <DayRow key={day.day} day={day.day} ranges={day.ranges} />
        ))}
      </div>
    </Card>
  );
}
