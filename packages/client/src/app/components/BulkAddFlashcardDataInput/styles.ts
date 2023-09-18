import { addStylesheet } from "../../utilities/styles";

export const { classes } = addStylesheet({
  inputSection: {
    // flex: "1",
    height: "300px",
  },
  textInput: {
    width: "100%",
    height: "100%",
    whiteSpace: "pre",
    overflowWrap: "normal",
    overflowX: "scroll",
  },
  buttonSection: {
    display: "flex",
    flexDirection: "row-reverse",
  },
});
