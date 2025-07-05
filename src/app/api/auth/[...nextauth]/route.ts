import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { AuthService } from "@/lib/auth";

// 개발 환경용 기본값 설정
const isDevelopment = process.env.NODE_ENV === 'development';
const googleClientId = process.env.GOOGLE_CLIENT_ID || (isDevelopment ? 'mock-google-client-id' : '');
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET || (isDevelopment ? 'mock-google-client-secret' : '');

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: googleClientId,
      clientSecret: googleClientSecret,
    }),
  ],
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google' && profile) {
        try {
          // Supabase에 사용자 정보 저장
          await AuthService.upsertUser({
            id: user.id,
            email: user.email!,
            name: user.name!,
            avatar_url: user.image || undefined,
          });
          return true;
        } catch (error) {
          console.error('Error saving user to database:', error);
          return true; // 로그인은 허용하되 DB 저장 실패는 로그만 남김
        }
      }
      return true;
    },
    async session({ session, token }) {
      if (token.sub && session.user) {
        // 세션에 사용자 ID 추가
        session.user.id = token.sub;
        
        // 사용자 정보 가져오기
        try {
          let user = await AuthService.getUser(token.sub);
          
          // 사용자가 존재하지 않으면 생성
          if (!user) {
            console.log('User not found, creating new user...');
            user = await AuthService.upsertUser({
              id: token.sub,
              email: session.user.email!,
              name: session.user.name!,
              avatar_url: session.user.image || undefined,
            });
          }
          
          if (user) {
            session.user.school = user.school;
            session.user.grade = user.grade;
            session.user.enrollment_year = user.enrollment_year;
            session.user.achievement_goal = user.achievement_goal;
          }
          
          // 사용자 통계 가져오기
          const stats = await AuthService.getUserStats(token.sub);
          session.user.stats = stats;
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.school = user.school;
        token.grade = user.grade;
        token.enrollment_year = user.enrollment_year;
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || (isDevelopment ? 'dev-secret-key-for-development-only' : ''),
  session: {
    strategy: "jwt",
  },
  debug: process.env.NODE_ENV === 'development',
});

export { handler as GET, handler as POST }; 