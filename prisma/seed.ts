import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const posts: { authorId: string; content: string }[] = []

for (let i = 0; i < 100; i++) {
  const post = {
    authorId: "user_2Nlqu44nSP2P1JHeGiLLGNveaTj",
    content: "🎶",
  }
  posts.push(post)
}

async function main() {
  await prisma.post.createMany({
    data: posts,
  })
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
