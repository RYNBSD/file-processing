export type Result = {
  load: number; // load time
  new: number; // create new instance
  convert: number; // convert time
  metadata: number; // metadata time

  size: number; // original size of loaded files, before any operations
};

export type FinalResult = Record<string, Result>;

export type CalculateArr = Record<string, number>;
