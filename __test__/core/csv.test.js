import fs from "node:fs";
import CSV from "../../build/core/csv.js";

describe("CSV", () => {
  it("check", async () => {
    const csv = await fs.promises.readFile("asset/csv.csv");
    await new CSV(csv).check();

    await expect(async () => {
      await new CSV(Buffer.alloc(1)).check();
    }).rejects.toThrow();
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
  });

  it("(static) stringify", async () => {
    const stringify = await CSV.stringify([
      ["1", "2", "3", "4"],
      ["a", "b", "c", "d"],
    ]);
    expect(stringify).toEqual("1,2,3,4\na,b,c,d\n");
  });
});
