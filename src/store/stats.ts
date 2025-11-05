const useStatsStore = create<StatsState>((set) => ({
  startDate: new Date(new Date().setDate(new Date().getDate() - 7)),
  endDate: new Date(),
  setStartDate: (date) => set({ startDate: date }),
  setEndDate: (date) => set({ endDate: date }),
}));
