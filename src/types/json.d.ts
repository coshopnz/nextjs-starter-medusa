declare module "*.json" {
  const value: {
    locations: Array<{
      id: string;
      name: string;
      description: string;
      times: string;
      area: string;
      coordinates: {
        lat: number;
        lng: number;
      };
    }>;
  };
  export default value;
} 