import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  user: defineTable({
    userId: v.string(),
    username: v.optional(v.string()),
    coin: v.optional(v.number()),
  }).index("by_user", ["userId"]),
  comments: defineTable({
    userId: v.id("user"),
    content: v.optional(v.string()),
  }).index("by_user", ["userId"]),
});
