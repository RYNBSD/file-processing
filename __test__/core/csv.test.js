import fs from "node:fs";
import CSV from "../../build/core/csv.js";

describe("CSV", () => {
  it("set/get/append/extend/clone", async () => {
    const csv = new CSV(Buffer.alloc(0));
    expect(csv.getCsvs()).toHaveLength(1);

    // CSV files don't have a signature
    const buffer = await CSV.loadFile("asset/csv.csv");
    await csv.append(Buffer.alloc(0), buffer);
    expect(csv.getCsvs()).toHaveLength(1);

    await csv.setCsvs((csv) => csv.toString());
    expect(csv.getCsvs()).toHaveLength(0);

    csv.extend(new CSV(Buffer.alloc(0)));
    expect(csv.getCsvs()).toHaveLength(1);

    expect(csv.clone()).toBeInstanceOf(CSV);
  });

  it("metadata", async () => {
    const buffer = await CSV.loadFile("asset/csv.csv");

    const metadata = await new CSV(buffer).metadata();
    expect(metadata).toHaveLength(1);

    await expect(async () => {
      await new Image(Buffer.alloc(1)).metadata();
    }).rejects.toThrow();
  });

  it("filter", async () => {
    const csv = await CSV.fromFile("asset/csv.csv");
    const length = await csv.filter();
    expect(length).toBe(0);
  });

  it("parse", async () => {
    const csv = await fs.promises.readFile("asset/csv.csv");
    const parse = await new CSV(csv).parse();
    expect(parse).toHaveLength(1);
  });

  it("transform", async () => {
    const csv = await fs.promises.readFile("asset/csv.csv");
    const transform = await new CSV(csv).transform((record) => record);
    expect(transform).toHaveLength(1);
  });

  it("custom", async () => {
    const csv = Buffer.from('#Welcome\n"1","2","3","4"\n"a","b","c","d"');
    const custom = await new CSV(csv).custom(async (csv) => {
      const parse = await CSV.parse(csv, { comment: "#" });
      const transform = await CSV.transform(parse, function (record) {
        record.push(record.shift());
        return record;
      });
      const stringify = await CSV.stringify(transform);
      return stringify;
    });
    expect(custom).toHaveLength(1);
    expect(custom[0]).toBe("2,3,4,1\nb,c,d,a\n");
  });

  it("(static) fromFile", async () => {
    const csv = await CSV.fromFile("asset/csv.csv");
    expect(csv).toBeInstanceOf(CSV);

    await expect(async () => {
      await CSV.fromFile(
        "https://sample-videos.com/csv/Sample-Spreadsheet-10-rows.csv"
      );
    }).rejects.toThrow();
  });

  it("(static) fromUrl", async () => {
    const csv = await CSV.fromUrl(
      "https://sample-videos.com/csv/Sample-Spreadsheet-10-rows.csv"
    );
    expect(csv).toBeInstanceOf(CSV);

    await expect(async () => {
      await CSV.fromUrl("asset/csv.csv");
    }).rejects.toThrow();
  });

  it("(static) generate", async () => {
    const generate = await CSV.generate({
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

  it("(static) parse", async () => {
    const input = '#Welcome\n"1","2","3","4"\n"a","b","c","d"';
    const parse = await CSV.parse(input, { comment: "#" });
    expect(parse).toEqual([
      ["1", "2", "3", "4"],
      ["a", "b", "c", "d"],
    ]);

    await expect(async () => {
      await CSV.parse(input);
    }).rejects.toThrow();
  });

  it("(static) transform", async () => {
    const transform = await CSV.transform(
      [
        ["1", "2", "3", "4"],
        ["a", "b", "c", "d"],
      ],
      function (record) {
        record.push(record.shift());
        return record;
      }
    );
    expect(transform).toEqual([
      ["2", "3", "4", "1"],
      ["b", "c", "d", "a"],
    ]);

    await expect(async () => {
      await CSV.transform("");
    }).rejects.toThrow();
  });

  it("(static) stringify", async () => {
    const stringify = await CSV.stringify([
      ["1", "2", "3", "4"],
      ["a", "b", "c", "d"],
    ]);
    expect(stringify).toEqual("1,2,3,4\na,b,c,d\n");
    
    await expect(async () => {
      await CSV.stringify("");
    }).rejects.toThrow();
  });
});
