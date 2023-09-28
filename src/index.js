import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import {Amplify} from "aws-amplify";
import awsConfig from "./aws-exports";

Amplify.configure(awsConfig);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
