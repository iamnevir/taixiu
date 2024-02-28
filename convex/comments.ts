import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getcomments = query({
  handler: async (ctx) => {
    const comments = await ctx.db.query("comments").order("desc").take(100);
    return comments;
  },
});
export const getcommentByUser = query({
  args: {
    userId: v.id("user"),
  },
  handler: async (ctx, args) => {
    const comments = await ctx.db
      .query("comments")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();
    return comments;
  },
});
export const create = mutation({
  args: {
    userId: v.id("user"),
    content: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const comment = await ctx.db.insert("comments", {
      userId: args.userId,
      content: args.content,
    });
    return comment;
  },
});
