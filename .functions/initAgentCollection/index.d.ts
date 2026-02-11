interface CloudFunctionEvent {
  action?: string;
  data?: any;
}

export declare function main(event: CloudFunctionEvent, context: any): Promise<any>;