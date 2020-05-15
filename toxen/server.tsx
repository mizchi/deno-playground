import { exists } from "https://deno.land/std/fs/exists.ts";
import React from "https://cdn.pika.dev/react";
// import { readFileStr, readFileStrSync } from "https://deno.land/std/fs/mod.ts";
// readFileStr("./target.dat", { encoding: "utf8" }); // returns a promise
// import React from "./externals/react.js";

import ReactDOMServer from "https://dev.jspm.io/react-dom/server";

import {
  Application,
  Router,
  send,
  Context,
} from "https://deno.land/x/oak/mod.ts";

const router = new Router();

router
  .get("/:page", async (context) => {
    const target = context.params?.page;
    try {
      if (target && await exists(`${Deno.cwd()}/pages/${target}.tsx`)) {
        const { default: Document } = await import(`./pages/_document.tsx`);
        const { default: Page } = await import(`./pages/${target}.tsx`);
        // @ts-ignore
        const html = ReactDOMServer.renderToStaticMarkup(
          <Document
            component={Page}
            componentProps={{ foo: 1 }}
            buildPath={`/.toxen/${target}.js`}
          />,
        );
        context.response.headers.set("Content-Type", "text/html");
        context.response.body = html;
      } else {
        context.response.body = "Not Found";
      }
    } catch (error) {
      console.error(error);
      context.response.headers.set("Content-Type", "text/html");
      context.response.body = error.message;
    }
  });

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

function static_(
  options: { root: string },
): (context: Context) => Promise<void> {
  return async (context: Context) => {
    try {
      await send(context, context.request.url.pathname, {
        root: options.root,
        index: "index.html",
      });
    } catch (err) {
      console.log(err);
    }
  };
}

app.use(static_({
  root: `${Deno.cwd()}/public`,
}));

await app.listen({ port: 8000 });
