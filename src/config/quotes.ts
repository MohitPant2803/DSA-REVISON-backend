export interface IStaticSeniorQuote {
  _id: string;
  text: string;
  author: string;
  collegeName: string;
  branch: string;
  yearOfGraduation: number;
  createdAt: string;
  updatedAt: string;
}

export const STATIC_SENIOR_QUOTES: IStaticSeniorQuote[] = [
  {
    _id: "6a13357421b348638d89b061",
    text: "It's a marathon to be endured, not a sprint to be ran.",
    author: "Mohit Pant",
    collegeName: "IIT KGP",
    branch: "Mining",
    yearOfGraduation: 2027,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z"
  }
];
