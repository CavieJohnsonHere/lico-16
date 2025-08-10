import index from "./index.html"
import creator from "./creator.html"

Bun.serve(
  {
    port: 3000,
    routes: {
      "/": index,
      "/creator": creator,
      "/lua": async () => {
        const file = Bun.file("scripts/main.lua")
        return new Response(await file.text());
      },
    }
  }
)