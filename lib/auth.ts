import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  callbacks: {
    async signIn({ user }) {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_API_BACKEND_URL}/api/users/sync`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: user.name, email: user.email, image: user.image }),
        })
      } catch {}
      return true
    },
    async jwt({ token, user, account }) {
      if (account && user) {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_BACKEND_URL}/api/users/sync`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: user.name, email: user.email, image: user.image }),
          })
          const data = await res.json()
          token.accessToken = data.token
          token.role = data.user?.role ?? "user"
          token.id = data.user?._id ?? ""
        } catch {
          token.role = "user"
        }
      }
      return token
    },
    async session({ session, token }) {
      session.user.id = token.id as string
      session.user.role = token.role as string
      session.accessToken = token.accessToken as string
      return session
    },
  },
  pages: {
    signIn: "/auth/login",
  },
})
