# OpenRCT2 - Now You See It!

![UI for the "Now You See It!" plugin](https://github.com/KatieZeldaKat/openrct2-now-you-see-it/blob/v1.0.0/.github/interface.png?raw=true)

A plugin for OpenRCT2 that allows you to modify the visibility of map elements. After installation,
you can show the above window by clicking and holding on the map button in the top left bar of the
screen, and then releasing the mouse once you are hovering over the entry labeled "Now You See It".

This was inspired by Willbycraft's [CorruptionManager](https://github.com/Willbycraft/CorruptionManager)
and [ParkFenceManager](https://github.com/Willbycraft/ParkFenceManager) plugins (though no code was
directly taken from these projects). This is more or less a combination and spiritual successor to
these two plugins.

## Filtering

You are given the option to change the visibility of the following element types:

- Track
- Entrances
- Small Scenery
- Large Scenery
- Footpath
- Park Fences

If a checkbox is clicked, it will be affected by whatever change you are making (i.e. if you are
making a selection while the "Make Visible" button is pressed, then any checked items will be made
visible while the non-checked items will not be affected in any way). This is shown here:

![Gameplay with Track, Small Scenery, and Entrances made invisible](https://github.com/KatieZeldaKat/openrct2-now-you-see-it/blob/v1.0.0/.github/filter.gif?raw=true)

## Park Fences

This plugin takes things one step further by allowing players to remove and restore park fences in
addition to making elements visible/invisible. Note that park fences are handled by the unowned land
surrounding any owned land in your park. Merely selecting the tiles you own next to any park fences
will not affect their visibility!

![Gameplay removing and restoring Park Fences](https://github.com/KatieZeldaKat/openrct2-now-you-see-it/blob/v1.0.0/.github/park-fences.gif?raw=true)

## Re-activating the Selection Tool

Whenever you open the plugin window, a selection tool will automatically display so that you can
click and drag to select what tiles you want to affect. However, it is possible this tool will
deactivate if you open another window that uses a different tool. Just click the button at the
bottom of the window and the tool will re-enable itself.

![Gameplay opening the land tool then re-activating the plugin tool](https://github.com/KatieZeldaKat/openrct2-now-you-see-it/blob/v1.0.0/.github/activate-tool.gif?raw=true)

## Multiplayer

This plugin supports multiplayer! The server needs to have the plugin installed, and **players need
the permission of "Modify Tile"** in order to perform any actions through this plugin. Should you
not have the necessary permissions, an error message will display as you attempt to perform the
action:

![Error message saying "Can't do this... Permission denied (Modify Tile)"](https://github.com/KatieZeldaKat/openrct2-now-you-see-it/blob/v1.0.0/.github/permission-denied.png?raw=true)

# Installation

Simply go to [the latest release of the plugin](https://github.com/KatieZeldaKat/openrct2-now-you-see-it/releases/latest)
and download the associated .js file. Navigate to your data folder for OpenRCT2, and put this .js
file into the folder named "plugin". Note that if OpenRCT2 is already running, you will need to
restart the game for changes to take effect (unless you have enabled hot-reloading).
