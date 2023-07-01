// @ts-ignore
import * as info from "./info.js";

export const tool: ToolDesc = createTool();
const tileSize = 32;

var selectStart: CoordsXY;
var visible: boolean = false;
var trackVisible: boolean = false;
var entranceVisible: boolean = false;
var smallSceneryVisible: boolean = false;
var largeSceneryVisible: boolean = false;
var footpathVisible: boolean = false;
var parkFenceVisible: boolean = false;


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
            isChecked: trackVisible,
            x: 10,
            y: 70,
            height: 20,
            width: 110,
            onChange(isChecked) {
                trackVisible = isChecked;
            },
        },{
            type: "checkbox",
            text: "Entrances",
            isChecked: entranceVisible,
            x: 130,
            y: 70,
            height: 20,
            width: 110,
            onChange(isChecked) {
                entranceVisible = isChecked;
            },
        },{
            type: "checkbox",
            text: "Small Scenery",
            isChecked: smallSceneryVisible,
            x: 10,
            y: 90,
            height: 20,
            width: 110,
            onChange(isChecked) {
                smallSceneryVisible = isChecked;
            },
        },{
            type: "checkbox",
            text: "Large Scenery",
            isChecked: largeSceneryVisible,
            x: 130,
            y: 90,
            height: 20,
            width: 110,
            onChange(isChecked) {
                largeSceneryVisible = isChecked;
            },
        },{
            type: "checkbox",
            text: "Footpath",
            isChecked: footpathVisible,
            x: 10,
            y: 110,
            height: 20,
            width: 110,
            onChange(isChecked) {
                footpathVisible = isChecked;
            },
        },{
            type: "checkbox",
            text: "Park Fences",
            isChecked: parkFenceVisible,
            x: 130,
            y: 110,
            height: 20,
            width: 110,
            onChange(isChecked) {
                parkFenceVisible = isChecked;
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
                    setTileVisibility(map.getTile(x / tileSize, y / tileSize));
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


function setTileVisibility(tile: Tile)
{
    park.postMessage(`(${tile.x}, ${tile.y})`);
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
