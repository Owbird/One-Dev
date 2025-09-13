import { SnackbarKey, SnackbarProvider, closeSnackbar } from "notistack";
import React from "react";
import { SidebarProvider } from "../ui/sidebar";

const snackbarAction = (snackbarId: SnackbarKey) => (
  <button onClick={() => closeSnackbar(snackbarId)}>Dismiss</button>
);

const AppProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider defaultOpen={false}>
      <SnackbarProvider autoHideDuration={9000} action={snackbarAction}>
        {children}
      </SnackbarProvider>
    </SidebarProvider>
  );
};

export default AppProviders;
