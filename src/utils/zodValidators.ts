import { z } from "zod"

export const emojiValidator = z.string().emoji("Only emojis are allowed").min(1).max(255)
