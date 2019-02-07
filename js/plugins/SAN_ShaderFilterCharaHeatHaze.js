//=============================================================================
// SAN_ShaderFilterCharaHeatHaze.js
//=============================================================================
// Copyright (c) 2018 Sanshiro
// Released under the MIT license
// http://opensource.org/licenses/mit-license.php
//=============================================================================

/*:ja
 * @plugindesc キャラクター陽炎エフェクトフィルター 1.0.0
 * キャラクターの周囲に陽炎のエフェクトを表示するフィルターです。
 * @author Sanshiro https://github.com/rev2nym
 * @help
 * ■概要
 * キャラクターの周囲に陽炎のエフェクトを表示するフィルターです。
 * このプラグインはシェーダーフィルターシステムのサブプラグインです。
 * 
 * ■前提のコアプラグイン
 * このプラグインは前提のコアプラグインとして
 * 併せて配布される「SAN_ShaderFilter.js」を使用します。
 * あらかじめ導入してください。
 * 
 * ■シェーダーコードファイル
 * このプラグインはシェーダーコードファイルとして
 * 「SAN_CharaHeatHazeFrag.txt」を使用します。
 * 「glsl」フォルダにあらかじめ配置してください。
 * 
 * ■基本的な仕組み
 * 基本的な仕組みはコアプラグインのヘルプを参照してください。
 * 
 * ■パラメータの作成
 * 次のスクリプトコマンドでパラメーターを作成します。
 * 例：
 * new GLSLCharaHeatHazeFilterParam({
 *     speed: 1.0, // エフェクトスピード
 *     fadeFrame: 60, // フェードフレームカウント
 *     fadeState: 'fadedOut', // フェード状態
 *     charaType: 'player', // キャラクタータイプ
 *     charaId: 1, // キャラクターID
 *     pitch: 1.0, // エフェクトピッチ
 *     innerRadius: 24.0, // エフェクト内径
 *     outerRadius: 72.0, // エフェクト外径
 *     strength: 1.0, // エフェクト強度
 *     color: {r: 2.0, g: 1.0, b: 1.0} // エフェクト色
 * });
 * 
 * それぞれの項目は順不同かつ省略可能です。
 * また設定値ごと省略することもできます。
 * 例：
 * new GLSLCharaHeatHazeFilterParam();
 * 
 * ・エフェクトスピード：speed
 * エフェクトのスピードです。
 * 数値が0.0に近づくほど遅くなります。
 * マイナスの値も設定できます。
 * 省略可能です。省略した場合は 1.0 が設定されます。
 * 
 * ・フェードフレームカウント：fadeFrame
 * フェードイン、フェードアウトに要するフレーム数です。
 * 省略可能です。省略した場合は 60 が設定されます。
 * 
 * ・フェード状態：fadeState
 * フェードの状態を表します。
 * 'fadingIn'（フェードイン中）、'fadedIn'（フェードイン完了）、
 * 'fadingOut'（フェードアウト中）、'fadedOut'（フェードアウト完了）の
 * 4つの状態を取り得ます。 
 * 'fadingIn' を設定した場合は即座にフェードインを開始します。
 * 省略可能です。省略した場合は 'fadedOut' が設定されます。
 * 
 * ・キャラクタータイプ：charaType
 * エフェクトの中心となるキャラクターのタイプを指定します。
 * 'player'（プレイヤー）、'follower'（フォロワー）、'event'（イベント）の
 * 3つのタイプから指定することが可能です。
 * 省略可能です。省略した場合は 'player' が設定されます。
 * 
 * ・キャラクターID：charaId
 * エフェクトの中心となるキャラクターのIDを指定します。
 * キャラクタータイプで 'follower' を指定した場合は
 * フォロワーインデックス（パーティの2人目のIDが1）が
 * 'event' を指定した場合はイベントIDが対応します。
 * 省略可能です。省略した場合は 1 が設定されます。
 * 
 * ・エフェクトピッチ：pitch
 * エフェクトのピッチを指定します。
 * この数値が大きくなるほどエフェクトの紋様が細かくなります。
 * 省略可能です。省略した場合は 1.0 が設定されます。
 * 
 * ・エフェクト内径：innerRadius
 * エフェクトの内径をピクセル単位で設定します。
 * この数値より小さい範囲はドーナツの穴のようにエフェクトが表示されません。
 * 省略可能です。省略した場合は 24.0 が設定されます。
 * 
 * ・エフェクト外径：outerRadius
 * エフェクトの外径をピクセル単位で設定します。
 * この数値より大きい範囲はエフェクトが表示されません。
 * 省略可能です。省略した場合は 72.0 が設定されます。
 * 
 * ・エフェクト強度：strength
 * エフェクトの強度を設定します。
 * この数値が大きくなるほどエフェクトによる画面の歪みが強くなります。
 * 省略可能です。省略した場合は 1.0 が設定されます。
 * 
 * ・エフェクト色：color
 * エフェクトの色をRGBで設定します。
 * 省略可能です。省略した場合は {r: 2.0, g: 1.0, b: 1.0} が設定されます。
 * 
 * ■パラメーターの登録
 * 次のスクリプトコマンドでパラメーターマップへパラメーターを登録します。
 * 例：
 * $gameScreen.glslFilterParamMap().set(
 *     'playerHeatHaze', // フィルターID
 *     new GLSLCharaHeatHazeFilterParam() // フィルターパラメーター
 * );
 * 
 * その他のパラメーターマップの操作はコアプラグインのヘルプを参照してください。
 * 
 * ■パラメーターの操作
 * ・エフェクトのフェードイン：fadeIn()
 * 例：
 * $gameScreen.glslFilterParamMap().get(
 *     'playerHeatHaze' // フィルターID
 * ).fadeIn();
 * 
 * ・エフェクトのフェードアウト：fadeOut()
 * 例：
 * $gameScreen.glslFilterParamMap().get(
 *     'playerHeatHaze' // フィルターID
 * ).fadeOut();
 * 
 * ・エフェクトの即時表示：show()
 * 例：
 * $gameScreen.glslFilterParamMap().get(
 *     'playerHeatHaze' // フィルターID
 * ).show();
 * 
 * ・エフェクトの即時非表示：hide()
 * 例：
 * $gameScreen.glslFilterParamMap().get(
 *     'playerHeatHaze' // フィルターID
 * ).hide();
 * 
 * ■利用規約
 * MITライセンスのもと、商用利用、改変、再配布が可能です。
 * ただし冒頭のコメントは削除や改変をしないでください。
 * これを利用したことによるいかなる損害にも作者は責任を負いません。
 * サポートは期待しないでください＞＜。
 */

/*:
 * @plugindesc Character heat haze effect filter 1.0.0
 * Effect filter which displays the effect of the heat haze around the character.
 * @author Sanshiro https://github.com/rev2nym
 * @help
 * - Overview
 * This plugin provides an effect filter that displays
 * the effect of heat haze around the character.
 * This plugin is a sub plugin of the shader filter system.
 * 
 * - Prerequisite core plugin
 * This plugin requires to have "SAN_ShaderFilter.js" installed in advanced 
 * and to be used together with this plugin.
 * 
 * - Shader code file
 * This plugin requires that you have "SAN_CharaHeatHazeFrag.txt" placed in the
 * "glsl" folder before execution.
 * 
 * - Basic Functions
 * Refer to the help information on the core plugin for more information.
 * 
 * - Create FPObject (Filter Parameter Object)
 * Create the FPObject with the following script command.
 * 
 * Example:
 * new GLSLCharaHeatHazeFilterParam({
 *     speed: 1.0, // Effect speed
 *     fadeFrame: 60, // Fade frame count
 *     fadeState: 'fadedOut', // Fade state
 *     charaType: 'player', // Character type
 *     charaId: 1, // CharacterID
 *     pitch: 1.0, // Effect pitch
 *     innerRadius: 24.0, // Effect inner radius
 *     outerRadius: 72.0, // Effect outer radius
 *     strength: 1.0, // Effect strength
 *     color: {r: 2.0, g: 1.0, b: 1.0} // Effect color
 * });
 * 
 * Each line can be written out of order.
 * You can also choose to omit every parameter.
 * 
 * Example:
 * new GLSLCharaHeatHazeFilterParam();
 * 
 * - Effect speed: speed
 * This is the speed of the effect.
 * The closer the number is to 0.0, the slower it will be.
 * You can also set a negative value.
 * This is optional. If omitted, 1.0 is used by default.
 * 
* - Fade frame count: fadeFrame
 * The number of frames used for fadein and fadeout.
 * This is optional. If omitted, 60 is used by default.
 * 
* - Fade state: fadeState
 * Select the fade state to get executed on command.
 * This can be described in four states

 * 'fadingIn' (in fadingin), 'fadedIn' (fadein completed),
 * 'fadingOut' (in fadingout), 'fadedOut' (fadeout completed)

 * If 'fadingIn' is set, fadein starts immediately.
 * This is optional. If omitted, 'fadedOut' is used by default.
 * 
 * - Character type: charaType
 * This specifies the type of character that is at the center of the effect.
 * This is possible to specify from these three types:

 * 'player', 'follower', 'event'

 * This is also optional. If omitted, 'player' is used by default.
 * 
 * - Character ID: charaId
 * This specifies the ID of the character that is the center of the effect.
 * If 'follower' is specified for the character type,
 * the follower index corresponds (the ID of the 2nd actor in the party is 1),
 * if 'event' is specified, the event ID corresponds.
 * This is optional. If omitted, 1 is set.
 * 
 * - Effect pitch: pitch
 * This affects the pitch of the effect.
 * The greater the number, the finer the pattern of the effect.
 * This is optional. If omitted, 1.0 is set by default.
 * 
 * - Effect inner radius: innerRadius
 * This sets the minimum inner radius of the effect in pixels.
 * This is optional. If omitted, 24.0 is set by default.
 * 
 * · Effect outer radius: outerRadius
 * This sets the maximum outer radius of the effect in pixels.
 * Effects will not exceed the range set by this number.
 * This is optional. If omitted, 72.0 is set by default.
 * 
 * - Effect strength: strength
 * This sets the strength of the effect.
 * The higher the value, the stronger the screen distortion.
 * This is optional. If omitted, 1.0 is set by default.
 * 
 * - Effect color: color
 * This sets the effect color with RGB.
 * This is optional. If omitted, {r: 2.0, g: 1.0, b: 1.0} is set by default.
 * 
 * - Register FPObject (Filter Parameter Object)
 * Register the FPObject in the FPMap with the following script command.
 * 
 * Example:
 * $gameScreen.glslFilterParamMap().set(
 *     'playerHeatHaze', // Filter ID
 *     new GLSLCharaHeatHazeFilterParam() // FPObject
 * );
 * 
 * For other FPMap operation, see the core plugin help.
 * 
 * - Effect operation commands
 * 
 * - Fadein effect: fadeIn()
 * Example:
 * $gameScreen.glslFilterParamMap().get(
 *     'playerHeatHaze' // Filter ID
 * ).fadeIn();
 * 
 * - Fadeout effect: fadeOut()
 * Example:
 * $gameScreen.glslFilterParamMap().get(
 *     'playerHeatHaze' // Filter ID
 * ).fadeOut();
 * 
 * - Immediate display of effects: show()
 * Example:
 * $gameScreen.glslFilterParamMap().get(
 *     'playerHeatHaze' // Filter ID
 * ).show();
 * 
 * - Immediate hide of effects: hide()
 * Example:
 * $gameScreen.glslFilterParamMap().get(
 *     'playerHeatHaze' // Filter ID
 * ).hide();
 * 
 * - Terms of use
 * Under the MIT license,
 * commercial use, modification, redistribution is allowed.
 * However, please do not delete or modify the comment at the beginning.
 * The author is not responsible for any damage caused by using this.
 * And please do not expect support. X(
 */

var Imported = Imported || {};
Imported.SAN_ShaderFilterCharaHeatHaze = true;

var Sanshiro = Sanshiro || {};
Sanshiro.ShaderFilterCharaHeatHaze = Sanshiro.ShaderFilterCharaHeatHaze || {};
Sanshiro.ShaderFilterCharaHeatHaze.version = '1.0.0';

(function() {
'use strict';

//-----------------------------------------------------------------------------
// GLSLCharaHeatHazeFilter
//
// GLSLキャラクター陽炎フィルター

window.GLSLCharaHeatHazeFilter =
    function GLSLCharaHeatHazeFilter()
{
    this.initialize.apply(this, arguments);
};

GLSLCharaHeatHazeFilter.prototype =
    Object.create(GLSLFilter.prototype);
GLSLCharaHeatHazeFilter.prototype.constructor =
    GLSLCharaHeatHazeFilter;

// バーテックスシェーダーファイル名
GLSLCharaHeatHazeFilter.prototype.vertName = function() {
    return '';
};

// フラグメントシェーダーファイル名
GLSLCharaHeatHazeFilter.prototype.fragName = function() {
    return 'SAN_CharaHeatHazeFrag';
};

// キャラクタースプライト
GLSLCharaHeatHazeFilter.prototype.characterSprite = function() {
    if (!this._characterSprite) {
        this.refreshCharacterSprite();
    }
    return this._characterSprite;
};

// キャラクタースプライトのリフレッシュ
GLSLCharaHeatHazeFilter.prototype.refreshCharacterSprite = function() {
    var type = this._param.charaType();
    var id = this._param.charaId();
    this._characterSprite = (
        type === 'player' ? SpritePresenter.player() :
        type === 'event' ? SpritePresenter.event(id) :
        type === 'follower' ? SpritePresenter.follower(id) :
        null
    );
};

// キャラクタースプライトのX座標
GLSLCharaHeatHazeFilter.prototype.characterX = function() {
    var sprite = this.characterSprite();
    return (
        sprite.x -
        sprite.width * sprite.anchor.x +
        sprite.width / 2.0 +
        4.0
    );
};

// キャラクタースプライトのY座標
GLSLCharaHeatHazeFilter.prototype.characterY = function() {
    var sprite = this.characterSprite();
    if (sprite._characterName === "") {
        return (
            sprite.y -
            $gameMap.tileHeight() / 2.0 +
            8.0
        );
    }
    return (
        sprite.y -
        sprite.height * sprite.anchor.y +
        sprite.height / 2.0 +
        4.0
    );
};

// 描画X座標
GLSLCharaHeatHazeFilter.prototype.targetX = function() {
    return this.characterX();
};

// 描画Y座標
GLSLCharaHeatHazeFilter.prototype.targetY = function() {
    return this.characterY();
};

// 時間
GLSLCharaHeatHazeFilter.prototype.time = function() {
    return this._param.time();
};

// フェード率
GLSLCharaHeatHazeFilter.prototype.fadeRate = function() {
    return this._param.fadeRate();
};

// PIXIフィルターのセットアップ
GLSLCharaHeatHazeFilter.prototype.setupFilter = function() {
    if (!this.characterSprite()) {
        return;
    }
    GLSLFilter.prototype.setupFilter.apply(this, arguments);
};

// ユニフォーム初期値
GLSLCharaHeatHazeFilter.prototype.defaultUniforms = function() {
    var uniforms = GLSLFilter.prototype.defaultUniforms.apply(this, arguments);
    uniforms.uTime = {
        type: 'other',
        value: this.time()
    };
    uniforms.uFadeRate = {
        type: 'other',
        value: this.fadeRate()
    };
    uniforms.uResolution = {
        type: 'vec2',
        value: {
            x: this.spriteWidth(),
            y: this.spriteHeight()
        }
    };
    uniforms.uPosition = {
        type: 'vec2',
        value: {
            x: this.targetX(),
            y: this.targetY()
        }
    };
    uniforms.uPitch = {
        type: 'other',
        value: this._param.pitch()
    };
    uniforms.uInnerRadius = {
        type: 'other',
        value: this._param.innerRadius()
    };
    uniforms.uOuterRadius = {
        type: 'other',
        value: this._param.outerRadius()
    };
    uniforms.uStrength = {
        type: 'other',
        value: this._param.strength()
    };
    uniforms.uR = {
        type: 'other',
        value: this._param.r()
    };
    uniforms.uG = {
        type: 'other',
        value: this._param.g()
    };
    uniforms.uB = {
        type: 'other',
        value: this._param.b()
    };
    return uniforms;
};

// フレーム更新
GLSLCharaHeatHazeFilter.prototype.update = function() {
    if (!this.characterSprite()) {
        return;
    }
    GLSLFilter.prototype.update.apply(this, arguments);
};

// ユニフォームのフレーム更新
GLSLCharaHeatHazeFilter.prototype.updateUniforms = function() {
    GLSLFilter.prototype.updateUniforms.apply(this, arguments);
    this.uniforms.uTime = this.time();
    this.uniforms.uFadeRate = this.fadeRate();
    this.uniforms.uResolution.x = this.spriteWidth();
    this.uniforms.uResolution.y = this.spriteHeight();
    this.uniforms.uPosition.x = this.targetX();
    this.uniforms.uPosition.y = this.targetY();
};

//-----------------------------------------------------------------------------
// GLSLCharaHeatHazeFilterParam
//
// GLSLキャラクター陽炎フィルターパラメーター

window.GLSLCharaHeatHazeFilterParam =
    function GLSLCharaHeatHazeFilterParam()
{
    this.initialize.apply(this, arguments);
};

GLSLCharaHeatHazeFilterParam.prototype =
    Object.create(GLSLFilterParam.prototype);
GLSLCharaHeatHazeFilterParam.prototype.constructor =
    GLSLCharaHeatHazeFilterParam;

// メンバー変数の初期化
GLSLCharaHeatHazeFilterParam.prototype.initMembers = function(param) {
    GLSLFilterParam.prototype.initMembers.apply(this, arguments);
    this._time = 0.0;
    this._fadeRate = 0.0;
    this._speed =
        param.hasOwnProperty('speed') ? param.speed : 1.0;
    this._fadeFrame =
        param.hasOwnProperty('fadeFrame') ? param.fadeFrame : 60;
    this._fadeState =
        param.hasOwnProperty('fadeState') ? param.fadeState : 'fadedOut';
    this._charaType =
        param.hasOwnProperty('charaType') ? param.charaType : 'player';
    this._charaId =
        param.hasOwnProperty('charaId') ? param.charaId : 1;
    this._pitch =
        param.hasOwnProperty('pitch') ? param.pitch : 1.0;
    this._innerRadius =
        param.hasOwnProperty('innerRadius') ? param.innerRadius : 24.0;
    this._outerRadius =
        param.hasOwnProperty('outerRadius') ? param.outerRadius : 72.0;
    this._strength =
        param.hasOwnProperty('strength') ? param.strength : 1.0;
    this._color =
        param.hasOwnProperty('color') ? param.color : {r: 2.0, g: 1.0, b: 1.0};
    this._character = this.character();
};

// フィルタークラス
GLSLCharaHeatHazeFilterParam.prototype.filterClass = function() {
    return GLSLCharaHeatHazeFilter;
};

// 時間
GLSLCharaHeatHazeFilterParam.prototype.time = function() {
    return this._time;
};

// フェード率
GLSLCharaHeatHazeFilterParam.prototype.fadeRate = function() {
    return this._fadeRate;
};

// キャラクタータイプ
GLSLCharaHeatHazeFilterParam.prototype.charaType = function() {
    return this._charaType;
};

// キャラクターID
GLSLCharaHeatHazeFilterParam.prototype.charaId = function() {
    return this._charaId;
};

// エフェクトピッチ
GLSLCharaHeatHazeFilterParam.prototype.pitch = function() {
    return this._pitch;
};

// エフェクト内径
GLSLCharaHeatHazeFilterParam.prototype.innerRadius = function() {
    return this._innerRadius;
};

// エフェクト外径
GLSLCharaHeatHazeFilterParam.prototype.outerRadius = function() {
    return this._outerRadius;
};

// エフェクト強度
GLSLCharaHeatHazeFilterParam.prototype.strength = function() {
    return this._strength;
};

// エフェクト色R成分
GLSLCharaHeatHazeFilterParam.prototype.r = function() {
    return this._color.r;
};

// エフェクト色G成分
GLSLCharaHeatHazeFilterParam.prototype.g = function() {
    return this._color.g;
};

// エフェクト色B成分
GLSLCharaHeatHazeFilterParam.prototype.b = function() {
    return this._color.b;
};

// キャラクター
GLSLCharaHeatHazeFilterParam.prototype.character = function() {
    return (
        this._charaType === 'player' ? $gamePlayer :
        this._charaType === 'event' ? $gameMap.event(this._charaId) :
        this._charaType === 'follower' ? $gamePlayer.followers().follower(this._charaId - 1) :
        null
    );
};

// フレーム更新
GLSLCharaHeatHazeFilterParam.prototype.update = function() {
    GLSLFilterParam.prototype.update.apply(this, arguments);
    this.checkCharacter();
    this.updateTime();
    this.updateFade();
};

// キャラクターの確認
GLSLCharaHeatHazeFilterParam.prototype.checkCharacter = function() {
    if (this._character !== this.character()) {
        $gameScreen.glslFilterParamMap().remove(this);
    }
};

// 時間のフレーム更新
GLSLCharaHeatHazeFilterParam.prototype.updateTime = function() {
    this._time += this.timeGain();
};

// 時間増加量(秒)
GLSLCharaHeatHazeFilterParam.prototype.timeGain = function() {
    return 1.0 / 60.0 * this._speed;
};

// フェードのフレーム更新
GLSLCharaHeatHazeFilterParam.prototype.updateFade = function() {
    if (this._fadeState === 'fadingIn') {
        this.updateFadingIn();
    } else if (this._fadeState === 'fadingOut') {
        this.updateFadingOut();
    }
};

// フェードイン中のフレーム更新
GLSLCharaHeatHazeFilterParam.prototype.updateFadingIn = function() {
    this._fadeRate += this.fadeRateGain();
    if (this._fadeRate >= 1.0) {
        this._fadeRate = 1.0
        this._fadeState = 'fadedIn';
    }
};

// フェードアウト中のフレーム更新
GLSLCharaHeatHazeFilterParam.prototype.updateFadingOut = function() {
    this._fadeRate -= this.fadeRateGain();
    if (this._fadeRate <= 0.0) {
        this._fadeRate = 0.0;
        this._fadeState = 'fadedOut';
    }
};

// フェード率変化量
GLSLCharaHeatHazeFilterParam.prototype.fadeRateGain = function() {
    return 1.0 / this._fadeFrame;
};

// フェードイン
GLSLCharaHeatHazeFilterParam.prototype.fadeIn = function() {
    this._fadeState = 'fadingIn';
};

// フェードアウト
GLSLCharaHeatHazeFilterParam.prototype.fadeOut = function() {
    this._fadeState = 'fadingOut';
};

// 即時表示
GLSLCharaHeatHazeFilterParam.prototype.show = function() {
    this._fadeRate = 1.0;
    this._fadeState = 'fadedIn';
};

// 即時消去
GLSLCharaHeatHazeFilterParam.prototype.hide = function() {
    this._fadeRate = 0.0;
    this._fadeState = 'fadedOut';
};

})();