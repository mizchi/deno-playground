import React from "react";

export const _React = React;
export default (props: any) => {
  return <div>
    <h1>Hello, Index</h1>
    <pre>
      {JSON.stringify(props)}
    </pre>
  </div>;
};
