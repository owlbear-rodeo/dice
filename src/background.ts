import OBR from "@owlbear-rodeo/sdk";
import { getPluginId } from "./plugin/getPluginId";

OBR.onReady(() => {
  OBR.modal.open({
    id: getPluginId("popover"),
    fullScreen: true,
    hideBackdrop: true,
    hidePaper: true,
    disablePointerEvents: true,
    url: "/popover.html",
  });
});
