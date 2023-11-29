import { focusWindow } from "./window";


export function startup()
{
	// Register a menu item under the map icon:
	if (typeof ui !== "undefined")
	{
		ui.registerMenuItem("Now You See It", () => focusWindow());
	}
}
