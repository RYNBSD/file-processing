import { faker } from "@faker-js/faker";
import { url2buffer } from "@ryn-bsd/from-buffer-to";

export async function imageBuffer() {
  const image = faker.image.avatar();
  return url2buffer(image);
}
