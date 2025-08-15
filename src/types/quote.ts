export interface QuoteData {
  coreValue: string;
  supportingValue: string;
  quote: string;
  author?: string;
}

export interface QuoteValidationLimits {
  coreValue: { min: 1; max: 50 };
  supportingValue: { min: 1; max: 60 };
  quote: { min: 10; max: 200 };
  author: { min: 0; max: 30 };
}

export interface GenerateImageResponse {
  success: boolean;
  error?: string;
}

export interface FormErrors {
  coreValue?: string;
  supportingValue?: string;
  quote?: string;
  author?: string;
}

export interface LoadingState {
  isGenerating: boolean;
  progress?: number;
  message?: string;
}