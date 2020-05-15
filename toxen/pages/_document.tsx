import React from "react";
import ReactDOMServer from "https://dev.jspm.io/react-dom/server";

export default function Document(
  props: {
    component: any;
    componentProps: any;
    buildPath: string;
  },
) {
  const C = props.component;
  // @ts-ignore
  const html = ReactDOMServer.renderToString(<C {...props.componentProps} />);

  return (
    // @ts-ignore
    <html>
      <body>
        <div id="toxen-root" dangerouslySetInnerHTML={{ __html: html }} />
        <script
          type="module"
          dangerouslySetInnerHTML={{
            __html: `
import ReactDOM from "https://cdn.pika.dev/react-dom";
(async () => {
  try {
    const { default: Page, _React: React } = await import("${props.buildPath}");
    ReactDOM.hydrate(
      React.createElement(
        Page,
        ${JSON.stringify(props.componentProps)}
      ),
      document.querySelector("#toxen-root")
    );
    console.log("hydrated!");  
  } catch (err) {
    console.error(err);
    console.log("only ssr")
  }
})();
        `.trim(),
          }}
        />
      </body>
    </html>
  );
}
