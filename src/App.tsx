import React, { FC } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import store from "./store/index";
import "./App.css";
import routes from "./routes";
import { Provider } from "react-redux";


const router = createBrowserRouter(routes);

const App: FC = () => {

  return (
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
  );
};

export default App;
