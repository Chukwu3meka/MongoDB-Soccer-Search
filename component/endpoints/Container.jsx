import { useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";

import { fetcher } from "@utils/clientFuncs";
import { styles, Endpoints, Endpoint, EndpointDialog } from ".";

const Container = ({ initialEndpoints }) => {
  const router = useRouter(),
    { enqueueSnackbar } = useSnackbar(),
    [loading, setLoading] = useState(false),
    [activeTab, setActiveTab] = useState(0),
    [endpoint, setEndpoint] = useState(null),
    [ratingHover, setRatingHover] = useState(0),
    [selectedID, setSelectedID] = useState(null),
    [endpoints, setEndpoints] = useState(initialEndpoints);

  const [displayDialog, setDisplayDialog] = useState(false);

  const hideEndpointDialogHandler = () => {
    setDisplayDialog(false);
    setSelectedID(null);
    if (endpoint) setEndpoint(null); //reset endpoint to null;
    if (activeTab !== 0) setActiveTab(0); //reset tab to Description
  };

  const copyToCLipboardHandler = async () => {
    // first time a user runs this function, a confirmation dialog is sent to confirm action
    if (navigator && navigator.clipboard) {
      // copy codeSnippet to clipboard
      await navigator.clipboard.writeText(endpoint.codeSnippet);

      // read content of clipboard
      // await navigator.clipboard.readText();

      enqueueSnackbar("Copied!!!", { variant: "success" });
    } else {
      enqueueSnackbar("Failed to copy!!!", { variant: "error" });
    }
  };

  const handleTabChange = async (event, newValue) => {
    setActiveTab(typeof event === "number" ? event : newValue);
  };

  const selectAPIHandler = (id) => async () => {
    setLoading(true); // display a loading bar on click
    setSelectedID(id);
    if (window && window.innerWidth < 600) setDisplayDialog(true);
    if (endpoint) setEndpoint(null); //reset endpoint to null;
    if (activeTab !== 0) setActiveTab(0); //reset tab to Description
    const res = await fetcher(`/api/client/getEndpoint`, JSON.stringify({ id }));
    setEndpoint(res);
    setLoading(false);
  };

  return (
    <Box sx={{ flexGrow: 1, backgroundColor: "rgb(30, 57, 82)" }} className={styles.endpoints}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={3}>
          <Endpoints endpoints={endpoints} selectedID={selectedID} selectAPIHandler={selectAPIHandler} />
        </Grid>
        <Grid item sm={9}>
          <EndpointDialog
            displayDialog={displayDialog}
            hideEndpointDialogHandler={hideEndpointDialogHandler}
            ratingHover={ratingHover}
            setRatingHover={setRatingHover}
            loading={loading}
            endpoint={endpoint}
            activeTab={activeTab}
            handleTabChange={handleTabChange}
            copyToCLipboardHandler={copyToCLipboardHandler}
          />
          <Box sx={{ display: { xs: "none", sm: "block" }, height: "100%" }}>
            <Endpoint
              ratingHover={ratingHover}
              setRatingHover={setRatingHover}
              loading={loading}
              endpoint={endpoint}
              activeTab={activeTab}
              handleTabChange={handleTabChange}
              copyToCLipboardHandler={copyToCLipboardHandler}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Container;
