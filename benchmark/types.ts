export type Result = {
  load: number; // load time
  new: number; // create new instance
  convert: number; // convert time
  metadata: number; // metadata time

  size: number; // original size of loaded files, before any operations
};

export type FinalResult = Record<string, Result>;

export type CalculateArr = Record<string, number>;

export type ArchitectureSchema = {
  platform: string;
  memory: number;
  cpus: string;
  cores: number;
  hostname: string;
  arch: string;
};

export type BenchmarkSchema = {
  results: FinalResult[];
  calculate: { min: CalculateArr; max: CalculateArr; avg: CalculateArr };
  architecture: ArchitectureSchema;
};

export type Benchmark = {
  last?: BenchmarkSchema;
  new?: BenchmarkSchema;
  difference?: CalculateArr;
};
