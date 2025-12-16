export interface ServiceEndpoint {
  kind: "Service";
  name: string;
  url: string;
  instance_id: string | null;
  params: any | null;
}

export interface ServiceRegistration {
  name: string;
  id: string;
  version: number;
  description: string;
  endpoints: ServiceEndpoint[];
  config_schema: {
    key: string;
    type: string;
    required: boolean;
    sensitive: boolean;
    description: string;
  }[];
}
