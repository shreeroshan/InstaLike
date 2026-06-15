// src/scripts/seed.ts

import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from project root
dotenv.config({
  path: path.resolve(__dirname, "../../.env"),
});

import { faker } from "@faker-js/faker";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log("Environment check:");
console.log("SUPABASE_URL:", SUPABASE_URL ? "FOUND" : "MISSING");
console.log(
  "SUPABASE_SERVICE_ROLE_KEY:",
  SUPABASE_SERVICE_ROLE_KEY ? "FOUND" : "MISSING",
);

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error(
    "Missing EXPO_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY",
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

type ProfileInsert = {
  id: string;
  created_at: string;
  name: string;
  username: string;
  profile_image: string;
  onBoarding_completed: boolean;
};

type PostInsert = {
  id: string;
  created_at: string;
  user_id: string;
  expires_at: string;
  is_active: boolean;
  description: string;
  image_url: string;
};

function generateCaption(): string {
  const captions = [
    "Weekend vibes ✨",
    "Can't believe this view 😍",
    "One for the memories 📸",
    "New adventure unlocked 🚀",
    "Living in the moment.",
    "This made my day 🙌",
    "Just another beautiful day.",
    "Grateful for moments like these.",
    "Fresh perspective today 🌅",
    "Taking it one step at a time.",
    "Making memories.",
    "Current mood: unstoppable 😎",
    "Enjoying the little things.",
    "Still thinking about this one...",
    "A day well spent.",
    "Life lately ✨",
  ];

  return faker.helpers.arrayElement(captions);
}

function generateUsername(existing: Set<string>): string {
  let username: string;

  do {
    username = faker.internet
      .username()
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, "");
  } while (existing.has(username));

  existing.add(username);

  return username;
}

function generateRecentDate(): Date {
  return faker.date.recent({
    days: 7,
  });
}

function createProfiles(count: number): ProfileInsert[] {
  const usernames = new Set<string>();

  return Array.from({ length: count }, () => ({
    id: faker.string.uuid(),
    created_at: faker.date.past().toISOString(),
    name: faker.person.fullName(),
    username: generateUsername(usernames),
    profile_image: faker.image.avatar(),
    onBoarding_completed: faker.datatype.boolean(),
  }));
}

function createPostsForProfile(profileId: string): PostInsert[] {
  const postCount = faker.number.int({
    min: 2,
    max: 8,
  });

  return Array.from({ length: postCount }, () => {
    const createdAt = generateRecentDate();
    const expiresAt = new Date(createdAt.getTime() + 24 * 60 * 60 * 1000);

    return {
      id: faker.string.uuid(),
      user_id: profileId,
      created_at: createdAt.toISOString(),
      expires_at: expiresAt.toISOString(),
      is_active: expiresAt > new Date(),
      description: generateCaption(),
      image_url: faker.image.urlPicsumPhotos({
        width: 1080,
        height: 1350,
      }),
    };
  });
}

async function insertProfiles(profiles: ProfileInsert[]): Promise<void> {
  const { error } = await supabase.from("profiles").insert(profiles);

  if (error) {
    throw new Error(`Failed to insert profiles: ${error.message}`);
  }
}

async function insertPosts(posts: PostInsert[]): Promise<void> {
  const { error } = await supabase.from("posts").insert(posts);

  if (error) {
    throw new Error(`Failed to insert posts: ${error.message}`);
  }
}

async function seed() {
  try {
    console.log("🌱 Starting seed...");

    // Create profiles
    const profiles = createProfiles(30);

    await insertProfiles(profiles);

    console.log(`✅ Inserted ${profiles.length} profiles`);

    // Create posts
    const postGroups = await Promise.all(
      profiles.map(async (profile) => createPostsForProfile(profile.id)),
    );

    const posts = postGroups.flat();

    await insertPosts(posts);

    console.log(`✅ Inserted ${posts.length} posts`);

    console.log("\n📊 Seed Summary");
    console.log("--------------------");
    console.log(`Profiles inserted: ${profiles.length}`);
    console.log(`Posts inserted: ${posts.length}`);
    console.log("--------------------");
    console.log("🎉 Seed completed successfully");
  } catch (error) {
    console.error("\n❌ Seed failed");

    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error(error);
    }

    process.exit(1);
  }
}

seed();
