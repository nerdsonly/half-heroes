//=============================================================================
// SAN_ShaderFilter.js
//=============================================================================
// Copyright (c) 2018 Sanshiro
// Released under the MIT license
// http://opensource.org/licenses/mit-license.php
//=============================================================================

/*:ja
 * @plugindesc シェーダーフィルター 1.0.0
 * シェーダーフィルターによる視覚エフェクト
 * @author Sanshiro https://github.com/rev2nym
 * @help
 * ■概要
 * シェーダーフィルターによる視覚エフェクト機能を提供します。
 * これはGLSLで記述されたシェーダーコードを外部ファイルから読み込んで
 * ゲーム画面に視覚エフェクトとして反映させるプラグインです。
 * 
 * なお、このプラグインは
 * シェーダーフィルターシステムのコアプラグインとして機能します。
 * 実際に視覚エフェクトを表示するためには
 * このプラグインに加えてサブプラグインが必要です。
 * 
 * ■GLSLシェーダーコード外部ファイル
 * このプラグインはGLSLシェーダーコードが記述された外部ファイルを使用します。
 * GLSLシェーダーコードは「glslフォルダ」内に配置されます。
 * 「glslフォルダ」を削除したり変更したりしないよう注意してください。
 * 
 * ■基本的な仕組み
 * 各スプライトはゲームオブジェクトを監視しています。
 * このプラグインではゲームオブジェクトのフィルターパラメーターマップに
 * フィルターパラメーターオブジェクトが登録されると
 * それを監視しているスプライトが自身にフィルターを生成して
 * ゲーム画面表示に視覚エフェクトとして反映させます。
 * つまりゲームオブジェクトにフィルターパラメーターオブジェクトを登録すれば
 * 視覚エフェクトを表示させることができます。
 * 
 * 以下、説明のため次のように呼び変えます。
 * フィルターパラメーターマップ → パラメーターマップ
 * フィルターパラメーターオブジェクト → パラメーター
 * 
 * ■基本的な使い方の手順
 * 次の手順で使用します。
 * 1．パラメーターの作成と登録
 * 2. エフェクトの操作
 * 3. パラメーターの削除
 * 
 * ■基本的な操作
 * ・パラメーターマップへの操作
 *     ・パラメーターの作成と設定
 *     ・パラメーターの取得
 *     ・パラメーターの削除
 * ・エフェクトの操作
 *     ・フィルターの種類による
 *       フェードイン・フェードアウトなどの操作のことです。
 *       パラメーターの処理を呼び出すことで操作します。
 *       具体的には各サブプラグインのヘルプを参照してください。
 * 
 * ■パラメーターマップの操作
 * パラメーターマップはゲームオブジェクトがパラメーターを保持するための
 * キーと値で構成されるデータ構造です。
 * パラメーターマップにパラメーターを登録すると
 * スプライトが自身にフィルターを生成して画面に反映します。
 * 
 * ・パラメーターの作成と登録：set()
 * ゲームオブジェクトのパラメーターマップに
 * フィルターIDとパラメーターを設定することで
 * フィルタに用いる各設定値を登録します。
 * 例：
 * $gameScreen.glslFilterParamMap().set(
 *     'filterId', // フィルターID
 *     new GLSLFilterParam() // フィルターパラメーター
 * );
 * 
 * ・パラメーターの取得：get()
 * ゲームオブジェクトのパラメーターマップから
 * フィルターIDを指定してパラメーターを取得できます。
 * 例：
 * $gameScreen.glslFilterParamMap().get(
 *     'filterId' // フィルターID
 * );
 * 
 * ・パラメーターの削除：delete()
 * ゲームオブジェクトのパラメーターマップから
 * フィルターIDを指定してパラメーターを削除します。
 * 例：
 * $gameScreen.glslFilterParamMap().delete(
 *     'filterId' // フィルターID
 * );
 * 
 * ・パラメーターの存在確認：has()
 * ゲームオブジェクトのパラメーターマップに
 * 指定したフィルターIDのパラメーターが存在するか確認します。
 * 存在すれば true を返し、存在しなければ false を返します。
 * 例：
 * $gameScreen.glslFilterParamMap().has(
 *     'filterId' // フィルターID
 * );
 * 
 * ■エフェクトの操作
 * パラメーターを操作することで
 * エフェクトの表示状態を制御できます。
 * 具体的には各サブプラグインのヘルプを参照してください。
 * 
 * ■ゲームオブジェクトとスプライトの対応
 * フィルターパラメーターマップを持つゲームオブジェクトおよび
 * 対応するスプライトは以下の通りです。
 * ・Game_Screen : Spriteset_Base
 * ・Game_Character : Sprite_Character
 * ・Game_Picture : Sprite_Picture
 * ・Game_Battler : Sprite_Battler
 * 
 * ■利用規約
 * MITライセンスのもと、商用利用、改変、再配布が可能です。
 * ただし冒頭のコメントは削除や改変をしないでください。
 * これを利用したことによるいかなる損害にも作者は責任を負いません。
 * サポートは期待しないでください＞＜。
 */

/*:
 * @plugindesc Shader filter 1.0.0
 * Visual effect by shader filter
 * @author Sanshiro https://github.com/rev2nym
 * @help
 * - Overview
 * This plugin provides visual effects with the shader filter.
 * This is a plugin that loads the shader code written in GLSL
 * from an external file and reflects it as a visual effect on the game screen.
 * 
 * Note that this plugin functions as the core plugin of
 * the shader filter system.
 * In addition to this plugin, addon plugins are necessary
 * to display the desired visual effect.
 * 
 * - External file of GLSL shader code
 * This plugin uses external files in written in GLSL code.
 * The GLSL shader code is placed in the "glsl" folder.
 * Do not to delete or change the "glsl" folder.
 * 
 * - Basic Functions
 * In this plugin, when a filter parameter object is registered
 * in the filter parameter map of the game object,
 * the sprite that watches it creates a filter for itself 
 * and reflects it as a visual effect on the game screen.
 * In short, you can display a visual effect
 * by registering a filter parameter object in the game object.
 * 
 * For the sake of convenience, we will use the listed abbreviations below.
 * Filter parameter map → FPMap
 * Filter parameter object → FPObject
 * 
 * - Basic procedure
 * To use make use of the effects, you will need to do as follows.
 * 1. Create and register FPObject
 * 2. Operate effect
 * 3. Delete FPObject
 * 
 * - Basic operations
 *   - Operation on FPMap
 *      - Create and register FPObject
 *      - Get FPObject
 *      - Delete FPObject
 *   - Effect operation 
 *      - Depends on the effect type
 *        It executes effects such as fadein/fadeout.
 *        Run by calling FPObject processing.
 *        Refer to the help of each sub plugin for details.
 * 
 * - Operation on FPMap
 * FPMap is a data structure composed of keys and values
 * for game objects to hold FPObjects.
 * When registering parameters in the parameter map,
 * the sprite creates a filter for itself
 * and reflects it on the screen.
 * 
 * - Create and register FPObject: set()
 * By registering the filterID and FPObject in the FPMap of the game object,
 * assign each value to be used for the filter.
 * 
 * Example:
 * $gameScreen.glslFilterParamMap().set(
 *     'filterId', // Filter ID
 *     new GLSLFilterParam() // FPObject
 * );
 * 
 * - Get FPObject: get()
 * You can get the FPObject by specifying filterID
 * from the FPMap of the game object.
 * 
 * Example:
 * $gameScreen.glslFilterParamMap().get(
 *     'filterId' // Filter ID
 * );
 * 
 * - Delete FPObject: delete()
 * Delete the FPObject by filterID
 * from the FPMap of the game object.
 * 
 * Example:
 * $gameScreen.glslFilterParamMap().delete(
 *     'filterId' // Filter ID
 * );
 * 
 * - Confirm existence of FPObject: has()
 * In the parameter map of the game object
 * Check whether the FPObject with the specified filter ID
 * in the FPMap of the game object exists.
 * If it exists returns true, otherwise returns false.
 * 
 * Example:
 * $gameScreen.glslFilterParamMap().has(
 *     'filterId' // Filter ID
 * );
 * 
 * - Effect operation
 * You can control the effect display state by operating the parameters.
 * Refer to the help of each sub plugin for further details.
 * 
 * - Correspondence between game objects and sprites
 * Game objects with FPMap and their corresponding sprites are as follows.
 *   - Game Screen: Spriteset_Base
 *   - Game_Character: Sprite_Character
 *   - Game_Picture: Sprite_Picture
 *   - Game_Battler: Sprite_Battler
 * 
 * - Terms of use
 * Under the MIT license,
 * commercial use, modification, redistribution is allowed.
 * However, please do not delete or modify the comment at the beginning.
 * The author is not responsible for any damage caused by using this.
 * And please do not expect support. X(
 */

var Imported = Imported || {};
Imported.SAN_ShaderFilter = true;

var Sanshiro = Sanshiro || {};
Sanshiro.ShaderFilter = Sanshiro.ShaderFilter || {};
Sanshiro.ShaderFilter.version = '1.0.0';

(function() {
'use strict';

//-----------------------------------------------------------------------------
// SpritePresenter
//
// スプライトプレゼンター

window.SpritePresenter = function SpritePresenter() {
    throw new Error('This is a static class');
};

// シーン
SpritePresenter.scene = function() {
    return SceneManager._scene;
};

// マップシーン判定
SpritePresenter.isScene = function(sceneClass) {
    return this.scene() instanceof sceneClass;
};

// スプライトセット
SpritePresenter.spriteset = function() {
    return SceneManager._scene._spriteset;
};

// スプライトセットベーススプライト
SpritePresenter.spritesetBase = function() {
    return SceneManager._scene._spriteset._baseSprite;
};

// プレイヤー
SpritePresenter.player = function() {
    if (!this.isScene(Scene_Map)) {
        return undefined;
    }
    return SceneManager._scene._spriteset._characterSprites.find(
        function(sprite) {
            return sprite._character instanceof Game_Player;
        }
    );
};

// イベント
SpritePresenter.event = function(eventId) {
    if (!this.isScene(Scene_Map)) {
        return undefined;
    }
    return SceneManager._scene._spriteset._characterSprites.find(
        function(sprite) {
            return (
                sprite._character instanceof Game_Event &&
                sprite._character.eventId() === eventId
            );
        }
    );
};

// フォロワー
SpritePresenter.follower = function(memberIndex) {
    if (!this.isScene(Scene_Map)) {
        return undefined;
    }
    return SceneManager._scene._spriteset._characterSprites.find(
        function(sprite) {
            return (
                sprite._character instanceof Game_Follower &&
                sprite._character._memberIndex === memberIndex
            );
        }
    );
};

// ピクチャ
SpritePresenter.picture = function(pictureId) {
    return SceneManager._scene._spriteset._pictureContainer.children.find(
        function(sprite) {
            return sprite._pictureId === pictureId;
        }
    );
};

// タイルマップ
SpritePresenter.tilemap = function() {
    return SceneManager._scene._spriteset._tilemap;
};

// 遠景
SpritePresenter.parallax = function() {
    return SceneManager._scene._spriteset._parallax;
};

//-----------------------------------------------------------------------------
// Game_Screen
//
// スクリーン

// オブジェクト初期化
var _Game_Screen_initialize =
    Game_Screen.prototype.initialize;
Game_Screen.prototype.initialize = function() {
    _Game_Screen_initialize.apply(this, arguments);
    this.initGLSLFilterParamMap();
};

// GLSLフィルターパラメーターマップの初期化
Game_Screen.prototype.initGLSLFilterParamMap = function() {
    this._glslFilterParamMap = new GLSLFilterParamMap();
};

// GLSLフィルターパラメーターマップ
Game_Screen.prototype.glslFilterParamMap = function() {
    return this._glslFilterParamMap;
};

// フレーム更新
var _Game_Screen_update =
    Game_Screen.prototype.update;
Game_Screen.prototype.update = function() {
    _Game_Screen_update.apply(this, arguments);
    this.updateGlslFilterParamMap();
};

// GLSLフィルターパラメーターマップのフレーム更新
Game_Screen.prototype.updateGlslFilterParamMap = function() {
    this._glslFilterParamMap.update();
};

//-----------------------------------------------------------------------------
// Game_Character
//
// キャラクター

// オブジェクト初期化
var _Game_Character_initialize =
    Game_Character.prototype.initialize;
Game_Character.prototype.initialize = function() {
    _Game_Character_initialize.apply(this, arguments);
    this.initGLSLFilterParamMap();
};

// GLSLフィルターパラメーターマップの初期化
Game_Character.prototype.initGLSLFilterParamMap = function() {
    this._glslFilterParamMap = new GLSLFilterParamMap();
};

// GLSLフィルターパラメーターマップ
Game_Character.prototype.glslFilterParamMap = function() {
    return this._glslFilterParamMap;
};

// フレーム更新
var _Game_Character_update =
    Game_Character.prototype.update;
Game_Character.prototype.update = function() {
    _Game_Character_update.apply(this, arguments);
    this.updateGlslFilterParamMap();
};

// GLSLフィルターパラメーターマップのフレーム更新
Game_Character.prototype.updateGlslFilterParamMap = function() {
    this._glslFilterParamMap.update();
};

//-----------------------------------------------------------------------------
// Game_Picture
//
// ピクチャ

// オブジェクト初期化
var _Game_Picture_initialize =
    Game_Picture.prototype.initialize;
Game_Picture.prototype.initialize = function() {
    _Game_Picture_initialize.apply(this, arguments);
    this.initGLSLFilterParamMap();
};

// GLSLフィルターパラメーターマップの初期化
Game_Picture.prototype.initGLSLFilterParamMap = function() {
    this._glslFilterParamMap = new GLSLFilterParamMap();
};

// GLSLフィルターパラメーターマップ
Game_Picture.prototype.glslFilterParamMap = function() {
    return this._glslFilterParamMap;
};

// フレーム更新
var _Game_Picture_update =
    Game_Picture.prototype.update;
Game_Picture.prototype.update = function() {
    _Game_Picture_update.apply(this, arguments);
    this.updateGlslFilterParamMap();
};

// GLSLフィルターパラメーターマップのフレーム更新
Game_Picture.prototype.updateGlslFilterParamMap = function() {
    this._glslFilterParamMap.update();
};

//-----------------------------------------------------------------------------
// Game_Battler
//
// バトラー

// オブジェクト初期化
var _Game_Battler_initialize =
    Game_Battler.prototype.initialize;
Game_Battler.prototype.initialize = function() {
    _Game_Battler_initialize.apply(this, arguments);
    this.initGLSLFilterParamMap();
};

// GLSLフィルターパラメーターマップの初期化
Game_Battler.prototype.initGLSLFilterParamMap = function() {
    this._glslFilterParamMap = new GLSLFilterParamMap();
};

// GLSLフィルターパラメーターマップ
Game_Battler.prototype.glslFilterParamMap = function() {
    return this._glslFilterParamMap;
};

// フレーム更新
var _Game_Battler_update =
    Game_Battler.prototype.update;
Game_Battler.prototype.update = function() {
    _Game_Battler_update.apply(this, arguments);
    this.updateGlslFilterParamMap();
};

// GLSLフィルターパラメーターマップのフレーム更新
Game_Battler.prototype.updateGlslFilterParamMap = function() {
    this._glslFilterParamMap.update();
};

//-----------------------------------------------------------------------------
// Sprite
//
// スプライト

// ダミーフィルター
// filters の最終の要素のフィルターの座標が上下反転する挙動を回避するためのダミー
Sprite._dummyFilter = null;

// ダミーフィルター
Sprite.prototype.dummyFilter = function() {
    if (!Sprite._dummyFilter) {
        Sprite._dummyFilter = new PIXI.Filter();
    }
    return Sprite._dummyFilter;
};

// オブジェクト初期化
var _Sprite_initialize =
    Sprite.prototype.initialize;
Sprite.prototype.initialize = function() {
    _Sprite_initialize.apply(this, arguments);
    this._glslFiltersLoading = [];
};

// フレーム更新
var _Sprite_update =
    Sprite.prototype.update;
Sprite.prototype.update = function() {
    _Sprite_update.call(this);
    this.updateGLSLFilters();
};

// GLSLフィルターのフレーム更新
Sprite.prototype.updateGLSLFilters = function() {
    this.refreshGLSLFilters();
    this.glslFilters().forEach(
        function(filter) {
            filter.update();
        }
    );
};

// GLSLフィルターリストのリフレッシュ
Sprite.prototype.refreshGLSLFilters = function() {
    if (!this.glslFilterParamMap()) {
        return;
    }
    this.cleanGLSLFilters();
    this.assortGLSLFilters();
};

// 不要なフィルターの除去
Sprite.prototype.cleanGLSLFilters = function() {
    if (!this.filters) {
        return;
    }
    var filterParamMapParams = this.glslFilterParamMap().values();
    this.filters = this.filters.filter(
        function(filter) {
            return (
                !this.isGLSLFilter(filter) ? true :
                filterParamMapParams.indexOf(filter.param()) !== -1 ? true :
                false
            );
        }, this
    );
};

// 必要なフィルターの追加
Sprite.prototype.assortGLSLFilters = function() {
    var filterParams = this.glslFilterParams();
    var filterParamMapParams = this.glslFilterParamMap().values();
    filterParamMapParams.forEach(
        function(filterMapParam) {
            if (filterParams.indexOf(filterMapParam) !== -1) {
                return;
            }
            var filterClass = filterMapParam.filterClass();
            var filter = new filterClass(this, filterMapParam);
            filter.addLoadHandler(this.onFilterLoaded.bind(this, filter));
            filter.load();
            this._glslFiltersLoading.push(filter);
        }, this
    );
};

// GLSLフィルターロードハンドラー
Sprite.prototype.onFilterLoaded = function(filter) {
    this.filters = !!this.filters ? this.filters : [];
    this.filters = this.filters.filter(
        function(filter) {
            return filter !== this.dummyFilter();
        }, this
    );
    this.filters = this.filters.concat([filter, this.dummyFilter()]);
    this._glslFiltersLoading = this._glslFiltersLoading.filter(
        function(filterLoading) {
            return filterLoading !== filter;
        }
    );
};

// GLSLフィルター判定
Sprite.prototype.isGLSLFilter = function(filter) {
    return filter instanceof GLSLFilter;
};

// GLSLフィルターパラメーターリスト
Sprite.prototype.glslFilterParams = function() {
    var params = [];
    params = params.concat(
        this.glslFilters().map(
            function(filter) {
                return filter.param();
            }
        )
    );
    params = params.concat(
        this._glslFiltersLoading.map(
            function(filter) {
                return filter.param();
            }
        )
    );
    return params;
};

// GLSLフィルターリスト
Sprite.prototype.glslFilters = function() {
    return (!!this.filters ? 
        this.filters.filter(
            function(filter) {
                return this.isGLSLFilter(filter);
            }, this
        ) :
        []
    );
};

// GLSLフィルターパラメーターマップ
Sprite.prototype.glslFilterParamMap = function() {
    return null;
};

//-----------------------------------------------------------------------------
// Spriteset_Base
//
// ベーススプライトセット

// GLSLフィルターパラメーターマップ
Spriteset_Base.prototype.glslFilterParamMap = function() {
    return $gameScreen.glslFilterParamMap();
};

//-----------------------------------------------------------------------------
// Sprite_Character
//
// キャラクタースプライト

// GLSLフィルターパラメーターマップ
Sprite_Character.prototype.glslFilterParamMap = function() {
    return this._character.glslFilterParamMap();
};

//-----------------------------------------------------------------------------
// Sprite_Picture
//
// ピクチャスプライト

// GLSLフィルターパラメーターマップ
Sprite_Picture.prototype.glslFilterParamMap = function() {
    var picture = this.picture();
    return (!!picture ? 
        this.picture().glslFilterParamMap() :
        undefined
    );
};

//-----------------------------------------------------------------------------
// Sprite_Battler
//
// バトラースプライト

// GLSLフィルターパラメーターマップ
Sprite_Battler.prototype.glslFilterParamMap = function() {
    return (!!this._battler ?
        this._battler.glslFilterParamMap() :
        null
    );
};

// GLSLフィルターのフレーム更新
Sprite_Battler.prototype.updateGLSLFilters = function() {
    if (!this._battler) {
        this.filters = [];
        return;
    }
    Sprite.prototype.updateGLSLFilters.apply(this, arguments);
};

//-----------------------------------------------------------------------------
// GLSLFilter
//
// GLSLフィルター

window.GLSLFilter = function GLSLFilter() {
    this.initialize.apply(this, arguments);
};

GLSLFilter.prototype =
    Object.create(PIXI.Filter.prototype);
GLSLFilter.prototype.constructor =
    GLSLFilter;

// オブジェクト初期化
GLSLFilter.prototype.initialize = function(sprite, param) {
    this._sprite = sprite;
    this._param = param;
    this._loadHandlers = [];
    this._ready = false;
    this.initMembers();
    this.initVertSrcLoader();
    this.initFragSrcLoader();
};

// バーテックスシェーダーファイル名
GLSLFilter.prototype.vertName = function() {
    return '';
};

// バーテックスシェーダー拡張子
GLSLFilter.prototype.vertExt = function() {
    return '.txt';
};

// フラグメントシェーダーファイル名
GLSLFilter.prototype.fragName = function() {
    return '';
};

// フラグメントシェーダー拡張子
GLSLFilter.prototype.fragExt = function() {
    return '.txt';
};

// シェーダーディレクトリ名
GLSLFilter.prototype.dirName = function() {
    return 'glsl/';
};

// バーテックスローダーの初期化
GLSLFilter.prototype.initVertSrcLoader = function() {
    this._vertUrl = this.generateURL(this.vertName(), this.vertExt());
    this._vertSrcLoader = new GLSLSourceLoader(this._vertUrl);
    this._vertSrcLoader.addLoadHandler(this.onVertLoaded.bind(this));
};

// フラグメントローダーの初期化
GLSLFilter.prototype.initFragSrcLoader = function() {
    this._fragUrl = this.generateURL(this.fragName(), this.fragExt());
    this._fragSrcLoader = new GLSLSourceLoader(this._fragUrl);
    this._fragSrcLoader.addLoadHandler(this.onFragLoaded.bind(this));
};

// URL生成
GLSLFilter.prototype.generateURL = function(name, ext) {
    return (!!name ?
        this.dirName() + name + ext :
        null
    );
};

// バーテックスロードハンドラ
GLSLFilter.prototype.onVertLoaded = function() {
    if (this._fragSrcLoader.isReady()) {
        this.onLoad();
    }
};

// フラグメントロードハンドラ
GLSLFilter.prototype.onFragLoaded = function() {
    if (this._vertSrcLoader.isReady()) {
        this.onLoad();
    }
};

// ロードハンドラ
GLSLFilter.prototype.onLoad = function() {
    this.setupFilter();
    this._loadHandlers.forEach(
        function(handler) {
            handler();
        }
    );
    this._ready = true;
};

// ロード
GLSLFilter.prototype.load = function() {
    this._vertSrcLoader.load();
    this._fragSrcLoader.load();
};

// メンバ変数の初期化
GLSLFilter.prototype.initMembers = function() {
};

// ロードハンドラーの追加
GLSLFilter.prototype.addLoadHandler = function(handler) {
    this._loadHandlers.push(handler);
};

// PIXIフィルターのセットアップ
GLSLFilter.prototype.setupFilter = function() {
    PIXI.Filter.call(
        this,
        this.vertexSource(),
        this.fragmentSource(),
        this.defaultUniforms()
    );
};

// バーテックスソース
GLSLFilter.prototype.vertexSource = function() {
    return this._vertSrcLoader.source();
};

// フラグメントソース
GLSLFilter.prototype.fragmentSource = function() {
    return this._fragSrcLoader.source();
};

// ユニフォーム初期値
GLSLFilter.prototype.defaultUniforms = function() {
    var uniforms = {};
    return uniforms;
};

// パラメーター
GLSLFilter.prototype.param = function() {
    return this._param;
};

// レディ判定
GLSLFilter.prototype.isReady = function() {
    return this._ready;
};

// フレーム更新
GLSLFilter.prototype.update = function() {
    this.updateUniforms();
};

// ユニフォームのフレーム更新
GLSLFilter.prototype.updateUniforms = function() {
};

// スプライト幅
GLSLFilter.prototype.spriteWidth = function() {
    return this._sprite.width || Graphics.width;
};

// スプライト高さ
GLSLFilter.prototype.spriteHeight = function() {
    return this._sprite.height || Graphics.height;
};

// スプライトX座標
GLSLFilter.prototype.spriteX = function() {
    return (!!this._sprite.anchor ?
        this._sprite.x - this._sprite.width * this._sprite.anchor.x :
        this._sprite.x
    );
};

// スプライトY座標
GLSLFilter.prototype.spriteY = function() {
    return (!!this._sprite.anchor ?
        this._sprite.y - this._sprite.width * this._sprite.anchor.y :
        this._sprite.y
    );
};

//-----------------------------------------------------------------------------
// GLSLSourceLoader
//
// GLSLソースローダー

window.GLSLSourceLoader = function GLSLSourceLoader() {
    this.initialize.apply(this, arguments);
};

// オブジェクト初期化
GLSLSourceLoader.prototype.initialize = function(url) {
    this._url = url;
    this._source = null;
    this._loadHandlers = [];
    this._errorHandlers = [];
    this._ready = false;
};

// ロード
GLSLSourceLoader.prototype.load = function() {
    if (!this._url) {
        this._ready = true;
        return;
    }
    var xhr = new XMLHttpRequest();
    xhr.open('GET', this._url);
    xhr.overrideMimeType('text');
    xhr.onload = this.onLoad.bind(this, xhr);
    xhr.onerror = this.onError.bind(this, xhr);
    xhr.send();
};

// ロードハンドラー
GLSLSourceLoader.prototype.onLoad = function(xhr) {
    this._source = xhr.responseText;
    this._loadHandlers.forEach(
        function(loadHander) {
            loadHander();
        }
    );
    this._ready = true;
};

// レディ判定
GLSLSourceLoader.prototype.isReady = function() {
    return this._ready;
};

// ロードハンドラーの追加
GLSLSourceLoader.prototype.addLoadHandler = function(handler) {
    this._loadHandlers.push(handler);
};

// エラーハンドラー
GLSLSourceLoader.prototype.onError = function(xhr) {
    this._errorHandlers.forEach(
        function(errorHander) {
            errorHander(xhr);
        }
    );
    throw new Error('Failed to load: ' + xhr.responseURL);
};

// エラーハンドラーの追加
GLSLSourceLoader.prototype.addErrorHandler = function(handler) {
    this._errorHandlers.push(handler);
};

// ソースコード
GLSLSourceLoader.prototype.source = function() {
    return this._source;
};

//-----------------------------------------------------------------------------
// GLSLFilterParamMap
//
// GLSLフィルターパラメーターマップ

window.GLSLFilterParamMap = function GLSLFilterParamMap() {
    this.initialize.apply(this, arguments);
};

// オブジェクト初期化
GLSLFilterParamMap.prototype.initialize = function() {
    this._map = {};
};

// クリア
GLSLFilterParamMap.prototype.clear = function() {
    this._map = {};
};

// 削除
GLSLFilterParamMap.prototype.delete = function(key) {
    delete this._map[key];
};

// 追加
GLSLFilterParamMap.prototype.set = function(key, value) {
    this._map[key] = value;
};

// 取得
GLSLFilterParamMap.prototype.get = function(key) {
    return this._map[key];
};

// 存在判定
GLSLFilterParamMap.prototype.has = function(key) {
    return !!this._map[key];
};

// キーリスト
GLSLFilterParamMap.prototype.keys = function() {
    return Object.keys(this._map);
};

// パラメータリスト
GLSLFilterParamMap.prototype.values = function() {
    return Object.values(this._map);
};

// キー
GLSLFilterParamMap.prototype.key = function(value) {
    var entries = Object.entries(this._map);
    var entry = entries.find(
        function(entry) {
            return entry[1] === value;
        }
    );
    return !!entry ? entry[0] : undefined;
};

// 除去
GLSLFilterParamMap.prototype.remove = function(value) {
    var key = this.key(value);
    this.delete(key);
};

// フレーム更新
GLSLFilterParamMap.prototype.update = function() {
    this.values().forEach(
        function(value) {
            value.update();
        }
    );
};

//-----------------------------------------------------------------------------
// GLSLFilterParam
//
// GLSLフィルターパラメーター

window.GLSLFilterParam = function GLSLFilterParam() {
    this.initialize.apply(this, arguments);
};

// オブジェクト初期化
GLSLFilterParam.prototype.initialize = function(param) {
    this.initMembers(param || {});
};

// メンバー変数の初期化
GLSLFilterParam.prototype.initMembers = function(param) {
};

// フィルタークラス
GLSLFilterParam.prototype.filterClass = function() {
    return GLSLFilter;
};

// フレーム更新
GLSLFilterParam.prototype.update = function() {
};

})();
