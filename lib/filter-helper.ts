export type Filters = {
  category: string[];
  format: string;
  location: string;
  date: string;
  city: string;
  country: string;
};

// Helper function to build URL params
export const buildUrlParams = (currentFilters: Filters) => {
  const params = new URLSearchParams();

  if (currentFilters.category.length > 0) {
    params.set("category", currentFilters.category.join(","));
  }
  if (currentFilters.format !== "all")
    params.set("format", currentFilters.format);
  if (currentFilters.location !== "all")
    params.set("location", currentFilters.location);
  if (currentFilters.date !== "all") params.set("date", currentFilters.date);
  if (currentFilters.city) params.set("city", currentFilters.city);
  if (currentFilters.country) params.set("country", currentFilters.country);

  return params.toString();
};

// Helper functions for cleaner date filtering
export const getStartOfDay = (date: Date) => {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  return start;
};

export const getEndOfDay = (date: Date) => {
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);
  return end;
};

export const getStartOfWeek = (date: Date) => {
  const start = new Date(date);
  start.setDate(date.getDate() - date.getDay());
  return getStartOfDay(start);
};

export const getEndOfWeek = (date: Date) => {
  const end = new Date(date);
  end.setDate(date.getDate() + (6 - date.getDay()));
  return getEndOfDay(end);
};

export const getStartOfMonth = (date: Date) => {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  return getStartOfDay(start);
};

export const getEndOfMonth = (date: Date) => {
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  return getEndOfDay(end);
};
