import { addStylesheet, viewStyles } from "app/utilities/styles";

export const { classes } = addStylesheet({
  root: {
    ...viewStyles,
    display: "flex",
    flexDirection: "column",
  },
});
