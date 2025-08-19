import { z } from 'zod';
import { DESIGN_CONFIG } from '@/config/design';

export const quoteSchema = z.object({
  coreValue: z.string()
    .min(DESIGN_CONFIG.LIMITS.CORE_VALUE.MIN, 'Core value is required')
    .max(DESIGN_CONFIG.LIMITS.CORE_VALUE.MAX, `Core value must be ${DESIGN_CONFIG.LIMITS.CORE_VALUE.MAX} characters or less`)
    .trim(),
  supportingValue: z.string()
    .min(DESIGN_CONFIG.LIMITS.SUPPORTING_VALUE.MIN, 'Supporting value is required')
    .max(DESIGN_CONFIG.LIMITS.SUPPORTING_VALUE.MAX, `Supporting value must be ${DESIGN_CONFIG.LIMITS.SUPPORTING_VALUE.MAX} characters or less`)
    .trim(),
  quote: z.string()
    .min(DESIGN_CONFIG.LIMITS.QUOTE.MIN, `Quote must be at least ${DESIGN_CONFIG.LIMITS.QUOTE.MIN} characters`)
    .max(DESIGN_CONFIG.LIMITS.QUOTE.MAX, `Quote must be ${DESIGN_CONFIG.LIMITS.QUOTE.MAX} characters or less`)
    .trim(),
  author: z.string()
    .max(DESIGN_CONFIG.LIMITS.AUTHOR.MAX, `Author must be ${DESIGN_CONFIG.LIMITS.AUTHOR.MAX} characters or less`)
    .trim()
    .optional()
    .or(z.literal('')),
  style: z.string()
    .default('style1')
    .refine((val) => ['style1'].includes(val), {
      message: 'Invalid style selected'
    })
});

export type QuoteInput = z.infer<typeof quoteSchema>;

export function validateQuoteData(data: unknown) {
  return quoteSchema.safeParse(data);
}

export function getFieldErrors(error: z.ZodError) {
  const fieldErrors: Record<string, string> = {};
  
  for (const issue of error.issues) {
    const field = issue.path[0] as string;
    if (!fieldErrors[field]) {
      fieldErrors[field] = issue.message;
    }
  }
  
  return fieldErrors;
}