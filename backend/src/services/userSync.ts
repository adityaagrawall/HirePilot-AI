import { PrismaClient } from "@prisma/client";
import { createClerkClient } from "@clerk/express";

const prisma = new PrismaClient();

const clerk = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

export async function syncUser(clerkId: string): Promise<{
  id: string;
  clerkId: string;
  email: string;
  name: string | null;
  image: string | null;
}> {
  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { clerkId },
  });

  if (existingUser) {
    return existingUser;
  }

  // Fetch user data from Clerk
  const clerkUser = await clerk.users.getUser(clerkId);

  const email =
    clerkUser.emailAddresses.find(
      (e: { id: string; emailAddress: string }) =>
        e.id === clerkUser.primaryEmailAddressId
    )?.emailAddress || "";

  const name =
    [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") ||
    null;

  const image = clerkUser.imageUrl || null;

  // Create user in database
  const newUser = await prisma.user.create({
    data: {
      clerkId,
      email,
      name,
      image,
    },
  });

  return newUser;
}
