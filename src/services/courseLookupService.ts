export interface CourseSearchResult {
  id: string;
  name: string;
  city?: string;
  state?: string;
  country?: string;
}

export interface CourseTeeOption {
  name: string;
  gender?: string;
  par?: number;
  rating?: number;
  slope?: number;
  length?: number;
}

export interface CourseDetails extends CourseSearchResult {
  tees: CourseTeeOption[];
}

const API_BASE = "https://api.opengolfapi.org/v1";

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const asString = (value: unknown): string | undefined =>
  typeof value === "string" && value.trim() !== "" ? value.trim() : undefined;

const asIdString = (value: unknown): string | undefined => {
  const stringValue = asString(value);
  if (stringValue) {
    return stringValue;
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }

  return undefined;
};

const asNumber = (value: unknown): number | undefined => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }

  return undefined;
};

const getArray = (value: unknown): unknown[] => {
  if (Array.isArray(value)) {
    return value;
  }

  return [];
};

const extractCourseList = (payload: unknown): unknown[] => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (!isObject(payload)) {
    return [];
  }

  for (const key of ["results", "courses", "items", "data"]) {
    const value = payload[key];
    if (Array.isArray(value)) {
      return value;
    }
    if (isObject(value) && Array.isArray(value.results)) {
      return value.results;
    }
  }

  return [];
};

const normalizeSearchResult = (item: unknown): CourseSearchResult | null => {
  if (!isObject(item)) {
    return null;
  }

  const id = asIdString(item.id ?? item.course_id ?? item.courseId ?? item.slug);
  const name = asString(item.name ?? item.course_name ?? item.courseName);

  if (!id || !name) {
    return null;
  }

  return {
    id,
    name,
    city: asString(item.city ?? item.town),
    state: asString(item.state ?? item.region ?? item.state_province),
    country: asString(item.country),
  };
};

const normalizeTeeResponse = (payload: unknown): CourseTeeOption[] =>
  getArray(isObject(payload) ? payload.tees : undefined)
    .map<CourseTeeOption | null>((item) => {
      if (!isObject(item)) {
        return null;
      }

      const rating = asNumber(
        item.course_rating ??
          item.rating ??
          item.courseRating ??
          item.ratingValue ??
          item.course_rating_value
      );
      const slope = asNumber(item.slope ?? item.slope_rating ?? item.slopeRating);
      const par = asNumber(item.par);
      const name = asString(item.tee_name ?? item.name ?? item.teeName ?? item.label);
      const gender = asString(item.gender);
      const yardage = asNumber(item.yardage ?? item.length ?? item.distance_yards);

      if (!name && rating == null && slope == null) {
        return null;
      }

      return {
        name: name ?? "Unknown tee",
        gender,
        par,
        rating,
        slope,
        length: yardage,
      };
    })
    .filter((tee): tee is CourseTeeOption => tee !== null);

export async function searchCourses(query: string): Promise<CourseSearchResult[]> {
  const trimmed = query.trim();
  if (!trimmed) {
    return [];
  }

  const response = await fetch(
    `${API_BASE}/courses/search?q=${encodeURIComponent(trimmed)}`
  );

  if (!response.ok) {
    throw new Error(`Course search failed (${response.status})`);
  }

  const payload: unknown = await response.json();
  return extractCourseList(payload)
    .map(normalizeSearchResult)
    .filter((course): course is CourseSearchResult => course !== null)
    .slice(0, 10);
}

export async function getCourseDetails(courseId: string): Promise<CourseDetails> {
  const [courseResponse, teesResponse] = await Promise.all([
    fetch(`${API_BASE}/courses/${encodeURIComponent(courseId)}`),
    fetch(`${API_BASE}/courses/${encodeURIComponent(courseId)}/tees`),
  ]);

  if (!courseResponse.ok) {
    throw new Error(`Course lookup failed (${courseResponse.status})`);
  }

  if (!teesResponse.ok) {
    throw new Error(`Tee lookup failed (${teesResponse.status})`);
  }

  const payload: unknown = await courseResponse.json();
  const teesPayload: unknown = await teesResponse.json();

  const course = isObject(payload) && isObject(payload.course) ? payload.course : payload;
  const base = isObject(course) ? course : {};

  const id = asIdString(base.id ?? base.course_id ?? courseId) ?? courseId;
  const name = asString(base.name ?? base.course_name ?? base.courseName) ?? "Selected course";

  const details: CourseDetails = {
    id,
    name,
    city: asString(base.city ?? base.town),
    state: asString(base.state ?? base.region ?? base.state_province),
    country: asString(base.country),
    tees: normalizeTeeResponse(teesPayload),
  };

  return details;
}
