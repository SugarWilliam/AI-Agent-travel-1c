interface CloudFunctionEvent {
  action: string;
  data?: any;
  userId?: string;
  modelId?: string;
  message?: string;
  conversationId?: string;
  destination?: string;
  startDate?: string;
  endDate?: string;
  budget?: number;
  travelers?: number;
  preferences?: string;
}

interface CloudFunctionResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export declare function main(event: CloudFunctionEvent, context: any): Promise<CloudFunctionResponse>;