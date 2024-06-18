import {
  Processor, // Processor class
  core, // Core classes
  helper, // Helper classes and functions
} from "../build/index.js";

const processor = new Processor(Buffer.alloc(1));

processor.audio();
processor.csv();
processor.image();
processor.pdf();
processor.text();
processor.video();
