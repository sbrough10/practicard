import { addStylesheet } from "app/utilities/styles";

export const { classes } = addStylesheet({
  tagList: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    overflowY: "scroll",
  },
});
