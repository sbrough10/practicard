import { addStylesheet } from "../../utilities/styles";

export const { classes } = addStylesheet({
  tagList: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    flex: "1",
    overflowY: "scroll",
  },
});
