// @ts-ignore
import * as info from "./info.js";


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
	park.postMessage("Now you see it!");
}
