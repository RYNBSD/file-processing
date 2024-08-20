import fs from "node:fs";
import CSV from "../../build/core/csv.js";
import { ProcessorError } from "../../build/error/index.js";

describe("CSV", () => {
  it("set/get/append/extend/clone", async () => {
    const csv = CSV.new([Buffer.alloc(1)]);
    let length = csv.length;
    expect(length).toEqual(1);

    // CSV files don't have a signature
    const csvFile = await CSV.fromFile("asset/csv.csv");
    length = await csv.append(Buffer.alloc(0), ...csvFile.getCsvs());
    expect(length).toEqual(2);

    length = await csv.setCsvs((csv) => csv.toString());
    expect(length).toEqual(0);

    length = csv.extend(CSV.new([Buffer.alloc(1)]));
    expect(length).toEqual(1);

    expect(csv.clone()).toBeInstanceOf(CSV);

    await expect(async () => {
      CSV.new(Buffer.alloc(0));
    }).rejects.toThrow(ProcessorError);
  });

  it("metadata", async () => {
    const csv = await CSV.fromFile("asset/csv.csv");
    const metadata = await csv.metadata();
    expect(metadata).toHaveLength(1);
  });

  it("filter", async () => {
    const csv = await CSV.fromFile("asset/csv.csv");
    const length = await csv.filter();
    expect(length).toBe(0);
  });

  it("parseAsync", async () => {
    const csv = await fs.promises.readFile("asset/csv.csv");
    const parse = await new CSV(csv).parseAsync();
    expect(parse).toHaveLength(1);
  });

  it("transformAsync", async () => {
    const csv = await fs.promises.readFile("asset/csv.csv");
    const parse = await new CSV(csv).parseAsync();
    const transform = await new CSV(csv).transformAsync(parse, (record) => record);
    expect(transform).toHaveLength(1);
  });

  it("stringifyAsync", async () => {
    const csv = await fs.promises.readFile("asset/csv.csv");
    const parse = await new CSV(csv).parseAsync();
    const stringify = await new CSV(csv).stringifyAsync(parse);
    expect(stringify).toHaveLength(1);
  });

  it("parseSync", async () => {
    const csv = await fs.promises.readFile("asset/csv.csv");
    const parse = new CSV(csv).parseSync();
    expect(parse).toHaveLength(1);
  });

  it("transformSync", async () => {
    const csv = await fs.promises.readFile("asset/csv.csv");
    const parse = new CSV(csv).parseSync();
    const transform = new CSV(csv).transformSync(parse, (record) => record);
    expect(transform).toHaveLength(1);
  });

  it("stringifySync", async () => {
    const csv = await fs.promises.readFile("asset/csv.csv");
    const parse = new CSV(csv).parseSync();
    const stringify = new CSV(csv).stringifySync(parse);
    expect(stringify).toHaveLength(1);
  });

  it("custom", async () => {
    const csv = Buffer.from('#Welcome\n"1","2","3","4"\n"a","b","c","d"');
    const custom = await new CSV(csv).custom(async (csv) => {
      const parse = await CSV.parseAsync(csv, { comment: "#" });
      const transform = await CSV.transformAsync(parse, function (record) {
        record.push(record.shift());
        return record;
      });
      const stringify = await CSV.stringifyAsync(transform);
      return stringify;
    });
    expect(custom).toHaveLength(1);
    expect(custom[0]).toBe("2,3,4,1\nb,c,d,a\n");
  });

  it("(static) fromFile", async () => {
    const csv = await CSV.fromFile("asset/csv.csv");
    expect(csv).toBeInstanceOf(CSV);
    expect(csv.length).toEqual(1);

    await expect(async () => {
      await CSV.fromFile("https://sample-videos.com/csv/Sample-Spreadsheet-10-rows.csv");
    }).rejects.toThrow();
  });

  it("(static) fromUrl", async () => {
    const csv = await CSV.fromUrl("https://sample-videos.com/csv/Sample-Spreadsheet-10-rows.csv");
    expect(csv).toBeInstanceOf(CSV);
    expect(csv.length).toEqual(1);

    await expect(async () => {
      await CSV.fromUrl("asset/csv.csv");
    }).rejects.toThrow();
  });

  it("(static) new", async () => {
    const csv = await CSV.fromFile("asset/csv.csv");
    expect(csv).toBeInstanceOf(CSV);
    expect(csv.length).toEqual(1);

    await expect(async () => {
      CSV.new([Buffer.alloc(0)]);
    }).rejects.toThrow(ProcessorError);
  });

  it("(static) isCSV", () => {
    const csv = new CSV();
    const isCSV = CSV.isCSV(csv);
    expect(isCSV).toBe(true);

    const object = new Object();
    const isNotCSV = CSV.isCSV(object);
    expect(isNotCSV).toBe(false);
  });

  it("(static) generateAsync", async () => {
    const generate = await CSV.generateAsync({
      seed: 1,
      objectMode: true,
      columns: 2,
      length: 2,
    });
    expect(generate).toEqual([
      ["OMH", "ONKCHhJmjadoA"],
      ["D", "GeACHiN"],
    ]);
  });

  it("(static) parseAsync", async () => {
    const input = '#Welcome\n"1","2","3","4"\n"a","b","c","d"';
    const parse = await CSV.parseAsync(input, { comment: "#" });
    expect(parse).toEqual([
      ["1", "2", "3", "4"],
      ["a", "b", "c", "d"],
    ]);

    await expect(async () => {
      await CSV.parseAsync(input);
    }).rejects.toThrow();
  });

  it("(static) transformAsync", async () => {
    const transform = await CSV.transformAsync(
      [
        ["1", "2", "3", "4"],
        ["a", "b", "c", "d"],
      ],
      function (record) {
        record.push(record.shift());
        return record;
      },
    );
    expect(transform).toEqual([
      ["2", "3", "4", "1"],
      ["b", "c", "d", "a"],
    ]);

    await expect(async () => {
      await CSV.transformAsync("");
    }).rejects.toThrow();
  });

  it("(static) stringifyAsync", async () => {
    const stringify = await CSV.stringifyAsync([
      ["1", "2", "3", "4"],
      ["a", "b", "c", "d"],
    ]);
    expect(stringify).toEqual("1,2,3,4\na,b,c,d\n");

    await expect(async () => {
      await CSV.stringifyAsync(null);
    }).rejects.toThrow();
  });

  it("(static) generateSync", () => {
    const generate = CSV.generateSync({
      seed: 1,
      objectMode: true,
      columns: 2,
      length: 2,
    });
    expect(generate).toEqual([
      ["OMH", "ONKCHhJmjadoA"],
      ["D", "GeACHiN"],
    ]);
  });

  it("(static) parseSync", async () => {
    const input = '#Welcome\n"1","2","3","4"\n"a","b","c","d"';
    const parse = await CSV.parseSync(input, { comment: "#" });
    expect(parse).toEqual([
      ["1", "2", "3", "4"],
      ["a", "b", "c", "d"],
    ]);

    await expect(async () => {
      CSV.parseSync(input);
    }).rejects.toThrow();
  });

  it("(static) transformSync", async () => {
    const transform = CSV.transformSync(
      [
        ["1", "2", "3", "4"],
        ["a", "b", "c", "d"],
      ],
      function (record) {
        record.push(record.shift());
        return record;
      },
    );
    expect(transform).toEqual([
      ["2", "3", "4", "1"],
      ["b", "c", "d", "a"],
    ]);

    await expect(async () => {
      CSV.transformSync("");
    }).rejects.toThrow();
  });

  it("(static) stringifySync", async () => {
    const stringify = CSV.stringifySync([
      ["1", "2", "3", "4"],
      ["a", "b", "c", "d"],
    ]);
    expect(stringify).toEqual("1,2,3,4\na,b,c,d\n");

    await expect(async () => {
      CSV.stringifySync(null);
    }).rejects.toThrow();
  });
});
