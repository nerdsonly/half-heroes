//=============================================================================
// SAN_ShaderFilterScanLine.js
//=============================================================================
// Copyright (c) 2018 Sanshiro
// Released under the MIT license
// http://opensource.org/licenses/mit-license.php
//=============================================================================

/*:ja
 * @plugindesc 走査線エフェクトフィルター 1.0.0
 * スプライトに走査線のエフェクトを表示するフィルターです。
 * @author Sanshiro https://github.com/rev2nym
 * @help
 * ■概要
 * スプライトに走査線のエフェクトを表示するフィルターです。
 * このプラグインはシェーダーフィルターシステムのサブプラグインです。
 * 
 * ■前提のコアプラグイン
 * このプラグインは前提のコアプラグインとして
 * 併せて配布される「SAN_ShaderFilter.js」を使用します。
 * あらかじめ導入してください。
 * 
 * ■シェーダーコードファイル
 * このプラグインはシェーダーコードファイルとして
 * 「SAN_ScanLineFrag.txt」を使用します。
 * 「glsl」フォルダにあらかじめ配置してください。
 * 
 * ■基本的な仕組み
 * 基本的な仕組みはコアプラグインのヘルプを参照してください。
 * 
 * ■パラメータの作成
 * 次のスクリプトコマンドでパラメーターを作成します。
 * 例：
 * new GLSLScanLineFilterParam({
 *     speed: 1.0, // エフェクトスピード
 *     fadeFrame: 60, // フェードフレームカウント
 *     fadeState: 'fadedOut' // フェード状態
 * });
 * 
 * それぞれの項目は順不同かつ省略可能です。
 * また設定値ごと省略することもできます。
 * 例：
 * new GLSLScanLineFilterParam();
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
 * ■パラメーターの登録
 * 次のスクリプトコマンドでパラメーターマップへパラメーターを登録します。
 * 例：
 * $gamePlayer.glslFilterParamMap().set(
 *     'playerScanLine', // フィルターID
 *     new GLSLScanLineFilterParam() // フィルターパラメーター
 * );
 * 
 * その他のパラメーターマップの操作はコアプラグインのヘルプを参照してください。
 * 
 * ■パラメーターの操作
 * ・エフェクトのフェードイン：fadeIn()
 * 例：
 * $gamePlayer.glslFilterParamMap().get(
 *     'playerScanLine' // フィルターID
 * ).fadeIn();
 * 
 * ・エフェクトのフェードアウト：fadeOut()
 * 例：
 * $gamePlayer.glslFilterParamMap().get(
 *     'playerScanLine' // フィルターID
 * ).fadeOut();
 * 
 * ・エフェクトの即時表示：show()
 * 例：
 * $gamePlayer.glslFilterParamMap().get(
 *     'playerScanLine' // フィルターID
 * ).show();
 * 
 * ・エフェクトの即時非表示：hide()
 * 例：
 * $gamePlayer.glslFilterParamMap().get(
 *     'playerScanLine' // フィルターID
 * ).hide();
 * 
 * ■利用規約
 * MITライセンスのもと、商用利用、改変、再配布が可能です。
 * ただし冒頭のコメントは削除や改変をしないでください。
 * これを利用したことによるいかなる損害にも作者は責任を負いません。
 * サポートは期待しないでください＞＜。
 */

/*:
 * @plugindesc Scan line effect filter 1.0.0
 * Display scan lines on the sprite.
 * @author Sanshiro https://github.com/rev2nym
 * @help
 * - Overview
 * This plugin provides an effect that displays
 * digital scan lines on specificed targets.
 * This plugin is an addon of the shader filter system.
 * 
 * - Prerequisite core plugin
 * This plugin requires to have "SAN_ShaderFilter.js" installed in advanced 
 * and to be used together with this plugin.
 * 
 * - Shader code file
 * This plugin requires that you have "SAN_CharaScanLineFrag.txt" placed in the
 *  "glsl" folder before execution.
 * 
 * - Basic Functions
 * Refer to the help information on the core plugin for more information.
 * 
 * - Create FPObject (Filter Parameter Object)
 * Create the FPObject with the following script command.
 * 
 * Example:
 * new GLSLScanLineFilterParam({
 *     speed: 1.0, // Effect speed
 *     fadeFrame: 60, // Fade frame count
 *     fadeState: 'fadedOut' // Fade state
 * });
 * 
 * Each line can be written out of order.
 * You can also choose to omit every parameter.
 * 
 * Example:
 * new GLSLScanLineFilterParam();
 * 
 * - Effect speed: speed
 * This affects the speed of the effect.
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
 * - Register FPObject (Filter Parameter Object)
 * Register the FPObject in the FPMap with the following script command.
 * 
 * Example:
 * $gamePlayer.glslFilterParamMap().set(
 *     'playerScanLine', // Filter ID
 *     new GLSLScanLineFilterParam() // FPObject
 * );
 * 
 * For other FPMap operations, check the help information for the core plugin.
 * 
 * - Effect operation commands
 * 
 * - Fadein effect: fadeIn()
 * Example:
 * $gamePlayer.glslFilterParamMap().get(
 *     'playerScanLine' // Filter ID
 * ).fadeIn();
 * 
 * - Fadeout effect: fadeOut()
 * Example:
 * $gamePlayer.glslFilterParamMap().get(
 *     'playerScanLine' // Filter ID
 * ).fadeOut();
 * 
 * - Immediate display of effects: show()
 * Example:
 * $gamePlayer.glslFilterParamMap().get(
 *     'playerScanLine' // Filter ID
 * ).show();
 * 
 * - Immediate hide of effects: hide()
 * Example:
 * $gamePlayer.glslFilterParamMap().get(
 *     'playerScanLine' // Filter ID
 * ).hide();
 * 
 * 
 * - Terms of use
 * Under the MIT license,
 * commercial use, modification, redistribution is allowed.
 * However, please do not delete or modify the comment at the beginning.
 * The author is not responsible for any damage caused by using this.
 * And please do not expect support. X(
 */

var Imported = Imported || {};
Imported.SAN_ShaderFilterScanLine = true;

var Sanshiro = Sanshiro || {};
Sanshiro.ShaderFilterScanLine = Sanshiro.ShaderFilterScanLine || {};
Sanshiro.ShaderFilterScanLine.version = '1.0.0';

(function() {
'use strict';

//-----------------------------------------------------------------------------
// GLSLScanLineFilter
//
// GLSL走査線フィルター

window.GLSLScanLineFilter = function GLSLScanLineFilter() {
    this.initialize.apply(this, arguments);
};

GLSLScanLineFilter.prototype =
    Object.create(GLSLFilter.prototype);
GLSLScanLineFilter.prototype.constructor =
    GLSLScanLineFilter;

// バーテックスシェーダーファイル名
GLSLScanLineFilter.prototype.vertName = function() {
    return '';
};

// フラグメントシェーダーファイル名
GLSLScanLineFilter.prototype.fragName = function() {
    return 'SAN_ScanLineFrag';
};

// 時間
GLSLScanLineFilter.prototype.time = function() {
    return this._param.time();
};

// フェード率
GLSLScanLineFilter.prototype.fadeRate = function() {
    return this._param.fadeRate();
};

// ユニフォーム初期値
GLSLScanLineFilter.prototype.defaultUniforms = function() {
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
    return uniforms;
};

// ユニフォームのフレーム更新
GLSLScanLineFilter.prototype.updateUniforms = function() {
    GLSLFilter.prototype.updateUniforms.apply(this, arguments);
    this.uniforms.uTime = this.time();
    this.uniforms.uFadeRate = this.fadeRate();
};

//-----------------------------------------------------------------------------
// GLSLScanLineFilterParam
//
// GLSLキャラクター走査線フィルターパラメーター

window.GLSLScanLineFilterParam = function GLSLScanLineFilterParam() {
    this.initialize.apply(this, arguments);
};

GLSLScanLineFilterParam.prototype =
    Object.create(GLSLFilterParam.prototype);
GLSLScanLineFilterParam.prototype.constructor =
    GLSLScanLineFilterParam;

// メンバー変数の初期化
GLSLScanLineFilterParam.prototype.initMembers = function(param) {
    GLSLFilterParam.prototype.initMembers.apply(this, arguments);
    this._time = 0.0;
    this._fadeRate = 0.0;
    this._speed =
        param.hasOwnProperty('speed') ? param.speed : 1.0;
    this._fadeFrame =
        param.hasOwnProperty('fadeFrame') ? param.fadeFrame : 60;
    this._fadeState =
        param.hasOwnProperty('fadeState') ? param.fadeState : 'fadedOut';
};

// フィルタークラス
GLSLScanLineFilterParam.prototype.filterClass = function() {
    return GLSLScanLineFilter;
};

// 時間
GLSLScanLineFilterParam.prototype.time = function() {
    return this._time;
};

// フェード率
GLSLScanLineFilterParam.prototype.fadeRate = function() {
    return this._fadeRate;
};

// フレーム更新
GLSLScanLineFilterParam.prototype.update = function() {
    GLSLFilterParam.prototype.update.apply(this, arguments);
    this.updateTime();
    this.updateFade();
};

// 時間のフレーム更新
GLSLScanLineFilterParam.prototype.updateTime = function() {
    this._time += this.timeGain();
};

// 時間増加量(秒)
GLSLScanLineFilterParam.prototype.timeGain = function() {
    return 1.0 / 60.0 * this._speed;
};

// フェードのフレーム更新
GLSLScanLineFilterParam.prototype.updateFade = function() {
    if (this._fadeState === 'fadingIn') {
        this.updateFadingIn();
    } else if (this._fadeState === 'fadingOut') {
        this.updateFadingOut();
    }
};

// フェードイン中のフレーム更新
GLSLScanLineFilterParam.prototype.updateFadingIn = function() {
    this._fadeRate += this.fadeRateGain();
    if (this._fadeRate >= 1.0) {
        this._fadeRate = 1.0
        this._fadeState = 'fadedIn';
    }
};

// フェードアウト中のフレーム更新
GLSLScanLineFilterParam.prototype.updateFadingOut = function() {
    this._fadeRate -= this.fadeRateGain();
    if (this._fadeRate <= 0.0) {
        this._fadeRate = 0.0;
        this._fadeState = 'fadedOut';
    }
};

// フェード率変化量
GLSLScanLineFilterParam.prototype.fadeRateGain = function() {
    return 1.0 / this._fadeFrame;
};

// フェードイン
GLSLScanLineFilterParam.prototype.fadeIn = function() {
    this._fadeState = 'fadingIn';
};

// フェードアウト
GLSLScanLineFilterParam.prototype.fadeOut = function() {
    this._fadeState = 'fadingOut';
};

// 即時表示
GLSLScanLineFilterParam.prototype.show = function() {
    this._fadeRate = 1.0;
    this._fadeState = 'fadedIn';
};

// 即時非表示
GLSLScanLineFilterParam.prototype.hide = function() {
    this._fadeRate = 0.0;
    this._fadeState = 'fadedOut';
};

})();