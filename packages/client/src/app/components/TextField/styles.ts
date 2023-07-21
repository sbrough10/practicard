import { addStylesheet } from "../../utilities/styles";

export const { classes } = addStylesheet({
  root: {
    flex: "1",
    padding: "4px",
    border: "solid 1px lightgrey",
    display: "flex",
    gap: "4px",
    alignItems: "center",
  },
  input: {
    flex: "1",
    border: "0px",
    margin: "0px",
    // This width is overridden by the `flex` property
    // but it allows the input to continue shrinking past
    // its default width, for some reason
    width: "50px",
    fontSize: "16px",
    lineHeight: "20px",
    "-moz-appearance": "textfield",
    "&::-webkit-inner-spin-button": {
      "-webkit-appearance": "none",
      margin: "0",
    },
  },
});
