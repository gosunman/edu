import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { AuthService } from "@/lib/auth";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
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
        
        // Supabase에서 사용자 통계 가져오기
        try {
          const stats = await AuthService.getUserStats(token.sub);
          session.user.stats = stats;
        } catch (error) {
          console.error('Error fetching user stats:', error);
        }
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  debug: process.env.NODE_ENV === 'development',
});

export { handler as GET, handler as POST }; 