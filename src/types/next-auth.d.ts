import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      school?: string | null;
      grade?: number | null;
      enrollment_year?: number | null;
      stats?: {
        totalCorrectAnswers: number;
        totalAttempts: number;
        accuracy: number;
        totalSessions: number;
        totalStudyTime: number;
      };
    };
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    school?: string | null;
    grade?: number | null;
    enrollment_year?: number | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    sub?: string;
    school?: string | null;
    grade?: number | null;
    enrollment_year?: number | null;
  }
} 