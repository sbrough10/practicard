import { addStylesheet } from "../../utilities/styles";

export const { classes } = addStylesheet((theme) => ({
  root: {
    borderStyle: "solid",
    borderWidth: "3px",
    borderRadius: "16px",
    padding: "4px 8px",
    display: "flex",
    flexDirection: "row",
    gap: "4px",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "14px",
    lineHeight: "16px",
    backgroundColor: "#fff",
    color: "black",
    fontWeight: "bold",
    fontSize: "16px",
    "&:disabled": {
      color: "black",
    },
  },
  button: {
    "&&": {
      width: "20px",
      height: "20px",
    },
  },
}));
