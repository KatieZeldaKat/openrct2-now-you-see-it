// @ts-ignore
import * as info from "./info.js";
import { VisibilityFilter } from "./data";

export const tool: ToolDesc = createTool();
const tileSize = 32;

var selectStart: CoordsXY;
var visible: boolean = false;
var filter: VisibilityFilter = {
    track: false,
    entrance: false,
    smallScenery: false,
    largeScenery: false,
    footpath: false,
    parkFence: false,
};


export function createWindow(): WindowDesc
{
    return {
        classification: info.name,
        title: "Now You See It!",
        colours: [ 5, 4 ],
        width: 250,
        height: 170,
        widgets: [{
            type: "button",
            text: "Make Visible",
            tooltip: "Now You See It!",
            name: "visibleButton",
            isPressed: visible,
            x: 10,
            y: 20,
            height: 40,
            width: 110,
            onClick() {
                setVisible(true);
            },
        },{
            type: "button",
            text: "Make Invisible",
            tooltip: "Now You Don't!",
            name: "invisibleButton",
            isPressed: !visible,
            x: 130,
            y: 20,
            height: 40,
            width: 110,
            onClick() {
                setVisible(false);
            },
        },{
            type: "checkbox",
            text: "Track",
            isChecked: filter.track,
            x: 10,
            y: 70,
            height: 20,
            width: 110,
            onChange(isChecked) {
                filter.track = isChecked;
            },
        },{
            type: "checkbox",
            text: "Entrances",
            isChecked: filter.entrance,
            x: 130,
            y: 70,
            height: 20,
            width: 110,
            onChange(isChecked) {
                filter.entrance = isChecked;
            },
        },{
            type: "checkbox",
            text: "Small Scenery",
            isChecked: filter.smallScenery,
            x: 10,
            y: 90,
            height: 20,
            width: 110,
            onChange(isChecked) {
                filter.smallScenery = isChecked;
            },
        },{
            type: "checkbox",
            text: "Large Scenery",
            isChecked: filter.largeScenery,
            x: 130,
            y: 90,
            height: 20,
            width: 110,
            onChange(isChecked) {
                filter.largeScenery = isChecked;
            },
        },{
            type: "checkbox",
            text: "Footpath",
            isChecked: filter.footpath,
            x: 10,
            y: 110,
            height: 20,
            width: 110,
            onChange(isChecked) {
                filter.footpath = isChecked;
            },
        },{
            type: "checkbox",
            text: "Park Fences",
            isChecked: filter.parkFence,
            x: 130,
            y: 110,
            height: 20,
            width: 110,
            onChange(isChecked) {
                filter.parkFence = isChecked;
            },
        },{
            type: "button",
            text: "Activate Selection Tool",
            tooltip: "Activate tool to select desired surface tiles",
            x: 10,
            y: 140,
            height: 20,
            width: 230,
            onClick() {
                ui.activateTool(tool);
            }
        },],
        onClose() {
            ui.tool?.cancel();
        },
    };
}


function setVisible(isVisible: boolean)
{
    visible = isVisible;

    var window: Window = ui.getWindow(info.name);
    if (window == null)
    {
        return;
    }

    window.findWidget<ButtonWidget>("visibleButton").isPressed = isVisible;
    window.findWidget<ButtonWidget>("invisibleButton").isPressed = !isVisible;
}


function createTool(): ToolDesc
{
    return {
        id: info.name,
        cursor: "cross_hair",
        filter: [ "terrain" ],
        onDown(e) {
            selectStart = getMapCoords(e.mapCoords);
        },
        onUp(_) {
            var selected = ui.tileSelection.range;
            if (selected == null)
            {
                return;
            }

            for (var x = selected.leftTop.x; x <= selected.rightBottom.x; x += tileSize)
            {
                for (var y = selected.leftTop.y; y <= selected.rightBottom.y; y += tileSize)
                {
                    setTileVisibility(x / tileSize, y / tileSize);
                }
            }
        },
        onMove(e) {
            if (e.isDown)
            {
                selectRange(selectStart, getMapCoords(e.mapCoords));
            }
            else
            {
                ui.tileSelection.range = null;
                ui.tileSelection.tiles = [ getMapCoords(e.mapCoords) ];
            }
        }
    };
}


function setTileVisibility(x: number, y: number)
{
    var tile: Tile = map.getTile(x, y);
    tile.elements.forEach((element) =>{
        if (element.type === "track")
        {
            if (filter.track)
            {
                setElementVisibility(element);
            }
        }
        else if (element.type === "entrance")
        {
            if (filter.entrance)
            {
                setElementVisibility(element);
            }
        }
        else if (element.type === "small_scenery" ||
                element.type === "banner" ||
                element.type === "wall")
        {
            if (filter.smallScenery)
            {
                setElementVisibility(element);
            }
        }
        else if (element.type === "large_scenery")
        {
            if (filter.largeScenery)
            {
                setElementVisibility(element);
            }
        }
        else if (element.type === "footpath")
        {
            if (filter.footpath)
            {
                setElementVisibility(element);
            }
        }
        else if (element.type === "surface")
        {
            if (filter.parkFence)
            {
                setParkFenceVisibility(element, x, y);
            }
        }
    });
}


function setElementVisibility(element: TileElement)
{
    element.isHidden = !visible;
}


function setParkFenceVisibility(element: SurfaceElement, x: number, y: number)
{
    if (visible && !element.hasOwnership)
    {
        var ownedLand: boolean[] = [
            hasOwnership(x, y + 1), // Up
            hasOwnership(x + 1, y), // Right
            hasOwnership(x, y - 1), // Down
            hasOwnership(x - 1, y), // Left
        ];

        // Convert bit array to integer in form of [Left][Down][Right][Up] - ranges from [0, 15]
        var parkFences: number = 0;
        ownedLand.forEach((owned, index) => {
            if (owned)
            {
                parkFences += 2 ** index;
            }
        })

        element.parkFences = parkFences;
    }
    else
    {
        element.parkFences = 0
    }
}


function hasOwnership(x: number, y: number): boolean
{
    var tileElements = map.getTile(x, y).elements.filter(element => element.type == "surface");
    return (tileElements[0] as SurfaceElement).hasOwnership;
}


function selectRange(selectStart: CoordsXY, mapCoords: CoordsXY)
{
    const selectCoords = {
        x: mapCoords.x > 0 ? mapCoords.x : selectStart.x,
        y: mapCoords.y > 0 ? mapCoords.y : selectStart.y,
    };

    ui.tileSelection.range = {
        leftTop: {
            x: Math.min(selectStart.x, selectCoords.x),
            y: Math.min(selectStart.y, selectCoords.y),
        },
        rightBottom: {
            x: Math.max(selectStart.x, selectCoords.x),
            y: Math.max(selectStart.y, selectCoords.y),
        }
    }
}


function getMapCoords(mapCoords: CoordsXYZ | undefined): CoordsXY
{
    // Convert the coordinates to be defined, setting to 0 if not
	return {
		x: mapCoords?.x ?? 0 > 0 ? mapCoords?.x ?? 0 : 0,
		y: mapCoords?.y ?? 0 > 0 ? mapCoords?.y ?? 0 : 0,
	}
}
