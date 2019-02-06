//=============================================================================
// Yanfly Engine Plugins - Save Event Locations
// YEP_SaveEventLocations.js
//=============================================================================

var Imported = Imported || {};
Imported.YEP_SaveEventLocations = true;

var Yanfly = Yanfly || {};
Yanfly.SEL = Yanfly.SEL || {};

//=============================================================================
 /*:
 * @plugindesc v1.03 Habilita mapas específicos a memorizarem as
 * localizações de eventos quando saindo e carregando-os após re-entrar no mapa.
 * @author Yanfly Engine Plugins
 *
 * @help
 * ============================================================================
 * Introdução
 * ============================================================================
 *
 * Normalmente no RPG Maker MV, saindo de um mapa e retornando a ele irá
 * resetar as posições do mapa de todos os eventos. Para certos tipos de
 * mapas, como labirintos, você iria querer que o mapa retivesse suas
 * localizações.
 *
 * ============================================================================
 * Notetags
 * ============================================================================
 *
 * Notetag do Mapa:
 *   <Save Event Locations>
 *   Isso irá causar o mapa a salvar cada localização de evento daquele mapa.
 *   Depois de sair e retornar para aquele mapa, os eventos serão recarregados
 *   para suas últimas posições salvas assim como a direção em que elas
 *   estavam apontando.
 *
 * Notetag do Evento:
 *   <Save Event Location>
 *   Isso irá habilitar esse evento específico a salvar sua localização
 *   nesse mapa. Depois de sair e retornar para aquele mapa, o evento será
 *   recarregado para sua última posição salva assim como a direção em que ela
 *   estava apontando.
 *
 * Se você desejar resetar a posição do Evento, simplesmente use o Editor de
 * Evento e use "Estabeleça Localização de Evento" para por a localização do
 * evento para o ponto desejado como se você fosse fazer normalmente.
 *
 * ============================================================================
 * Comandos de Plugin
 * ============================================================================
 *
 * Comando de Plugin
 *   ResetAllEventLocations  Isso reseta todas as localizações de evento no
 *                           mapa.
 *
 * ============================================================================
 * Changelog
 * ============================================================================
 *
 * Version 1.03:
 * - Fixed a bug where reset locations would not save properly.
 *
 * Version 1.02:
 * - Fixed a bug where battles would reset saved location notetags.
 *
 * Version 1.01:
 * - Fixed an incompatibility with the Set Event Location event command.
 *
 * Version 1.00:
 * - Finished plugin!
 */
//=============================================================================

//=============================================================================
// DataManager
//=============================================================================

DataManager.processSELNotetags1 = function() {
  if (!$dataMap) return;
  if (!$dataMap.note) return;
  var notedata = $dataMap.note.split(/[\r\n]+/);
  $dataMap.saveEventLocations = false;
  for (var i = 0; i < notedata.length; i++) {
    var line = notedata[i];
    if (line.match(/<(?:SAVE EVENT LOCATION|save event locations)>/i)) {
      $dataMap.saveEventLocations = true;
    }
  }
};

DataManager.processSELNotetags2 = function(obj) {
  var notedata = obj.note.split(/[\r\n]+/);
  obj.saveEventLocation = false;
  for (var i = 0; i < notedata.length; i++) {
    var line = notedata[i];
    if (line.match(/<(?:SAVE EVENT LOCATION|save event locations)>/i)) {
      obj.saveEventLocation = true;
    }
  }
};

//=============================================================================
// Game_System
//=============================================================================

Yanfly.SEL.Game_System_initialize = Game_System.prototype.initialize;
Game_System.prototype.initialize = function() {
  Yanfly.SEL.Game_System_initialize.call(this);
  this.initSavedEventLocations();
};

Game_System.prototype.initSavedEventLocations = function() {
  this._savedEventLocations = {};
};

Game_System.prototype.savedEventLocations = function() {
  if (this._savedEventLocations === undefined) this.initSavedEventLocations();
  return this._savedEventLocations;
};

Game_System.prototype.isSavedEventLocation = function(mapId, eventId) {
  if (this._savedEventLocations === undefined) this.initSavedEventLocations();
  return this._savedEventLocations[[mapId, eventId]] !== undefined;
};

Game_System.prototype.getSavedEventX = function(mapId, eventId) {
  if (this._savedEventLocations === undefined) this.initSavedEventLocations();
  return this._savedEventLocations[[mapId, eventId]][0];
};

Game_System.prototype.getSavedEventY = function(mapId, eventId) {
  if (this._savedEventLocations === undefined) this.initSavedEventLocations();
  return this._savedEventLocations[[mapId, eventId]][1];
};

Game_System.prototype.getSavedEventDir = function(mapId, eventId) {
  if (this._savedEventLocations === undefined) this.initSavedEventLocations();
  return this._savedEventLocations[[mapId, eventId]][2];
};

Game_System.prototype.saveEventLocation = function(mapId, event) {
  if (this._savedEventLocations === undefined) this.initSavedEventLocations();
  var eventId = event.eventId();
  var eventX = event.x;
  var eventY = event.y;
  var eventDir = event.direction();
  this._savedEventLocations[[mapId, eventId]] = [eventX, eventY, eventDir];
};

//=============================================================================
// Game_Map
//=============================================================================

Yanfly.SEL.Game_Map_setup = Game_Map.prototype.setup;
Game_Map.prototype.setup = function(mapId) {
    if ($dataMap) DataManager.processSELNotetags1();
    Yanfly.SEL.Game_Map_setup.call(this, mapId);
};

Game_Map.prototype.isSaveEventLocations = function() {
    return $dataMap.saveEventLocations;
};

Game_Map.prototype.resetAllEventLocations = function() {
    for (var i = 0; i < this.events().length; ++i) {
      var ev = this.events()[i];
      ev.resetLocation();
    }
};

//=============================================================================
// Game_Event
//=============================================================================

Yanfly.SEL.Game_Event_locate = Game_Event.prototype.locate;
Game_Event.prototype.locate = function(x, y) {
    DataManager.processSELNotetags2(this.event());
    Yanfly.SEL.Game_Event_locate.call(this, x, y);
    if (!$gameTemp._bypassLoadLocation) this.loadLocation();
};

Yanfly.SEL.Game_Event_updateMove = Game_Event.prototype.updateMove;
Game_Event.prototype.updateMove = function() {
    Yanfly.SEL.Game_Event_updateMove.call(this);
    this.saveLocation();
};

Game_Event.prototype.isSaveLocation = function() {
    if ($gameMap.isSaveEventLocations()) return true;
    if (this.event().saveEventLocation === undefined) {
      DataManager.processSELNotetags2(this.event());
    }
    return this.event().saveEventLocation;
};

Game_Event.prototype.saveLocation = function() {
    if (!this.isSaveLocation()) return;
    $gameSystem.saveEventLocation($gameMap.mapId(), this);
};

Game_Event.prototype.isLoadLocation = function() {
    if (!this.isSaveLocation()) return false;
    return $gameSystem.isSavedEventLocation($gameMap.mapId(), this.eventId());
};

Game_Event.prototype.loadLocation = function() {
    if (!this.isLoadLocation()) return;
    var x = $gameSystem.getSavedEventX($gameMap.mapId(), this.eventId());
    var y = $gameSystem.getSavedEventY($gameMap.mapId(), this.eventId());
    this.setPosition(x, y);
    var dir = $gameSystem.getSavedEventDir($gameMap.mapId(), this.eventId());
    this.setDirection(dir);
};

Game_Event.prototype.resetLocation = function() {
    Yanfly.SEL.Game_Event_locate.call(this, this.event().x, this.event().y);
    this.setDirection(this._originalDirection);
    this.saveLocation();
};

//=============================================================================
// Game_Interpreter
//=============================================================================

Yanfly.SEL.Game_Interpreter_pluginCommand =
    Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) {
  Yanfly.SEL.Game_Interpreter_pluginCommand.call(this, command, args)
  if (command === 'ResetAllEventLocations') $gameMap.resetAllEventLocations();
};

// Set Event Location
Yanfly.SEL.Game_Interpreter_command203 = Game_Interpreter.prototype.command203;
Game_Interpreter.prototype.command203 = function() {
    $gameTemp._bypassLoadLocation = true;
    var result = Yanfly.SEL.Game_Interpreter_command203.call(this);
    $gameTemp._bypassLoadLocation = undefined;
    return result;
};

//=============================================================================
// End of File
//=============================================================================
