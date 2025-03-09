import { addFromNeoDB } from "./add-from-neodb";

export default defineBackground(() => {
  addFromNeoDB()
});
