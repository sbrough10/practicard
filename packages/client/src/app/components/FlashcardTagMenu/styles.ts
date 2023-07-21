import { addStylesheet } from "../../utilities/styles";

export const { classes } = addStylesheet({
  root: {
    marginTop: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  createTagSection: {
    display: "flex",
    flexDirection: "row",
    gap: "4px",
  },
  button: {
    "&&": {
      width: "32px",
      height: "32px",
    },
  },
});
