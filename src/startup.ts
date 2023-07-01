// @ts-ignore
import * as info from "./info.js";
import { createWindow } from "./window";
import { tool } from "./window";


export function startup()
{
	// Register a menu item under the map icon:
	if (typeof ui !== "undefined")
	{
		ui.registerMenuItem(info.name, () => onClickMenuItem());
	}
}


function onClickMenuItem()
{
	var foundWindow: Window = ui.getWindow(info.name);
	if (foundWindow != null)
	{
		foundWindow.bringToFront();
		ui.activateTool(tool);
	}
	else
	{
		ui.openWindow(createWindow());
		ui.activateTool(tool);
	}
}
