import { ChakraProvider } from "@chakra-ui/react";
import { SnackbarKey, SnackbarProvider, closeSnackbar } from "notistack";
import React from "react";

const snackbarAction = (snackbarId: SnackbarKey) => (
  <button onClick={() => closeSnackbar(snackbarId)}>Dismiss</button>
);

const AppProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ChakraProvider>
      <SnackbarProvider autoHideDuration={9000} action={snackbarAction}>
        {children}
      </SnackbarProvider>
    </ChakraProvider>
  );
};

export default AppProviders;
