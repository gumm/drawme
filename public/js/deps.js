// This file was autogenerated by depswriter.py.
// Please do not edit.
goog.addDependency('../../../bad-library/bad/constants/constants.js', ['bad.CssClassMap', 'bad.CssPrefix'], [], false);
goog.addDependency('../../../bad-library/bad/crypto/aes-cmac.js', ['bad.AesCmac'], ['bad.CryptUtils'], false);
goog.addDependency('../../../bad-library/bad/crypto/crypto.js', ['bad.Crypto'], ['bad.AesCmac', 'bad.CryptUtils', 'bad.utils', 'goog.crypt', 'goog.crypt.Aes', 'goog.crypt.Sha1', 'goog.crypt.base64'], false);
goog.addDependency('../../../bad-library/bad/crypto/cryptutils.js', ['bad.CryptUtils'], ['goog.crypt.Aes'], false);
goog.addDependency('../../../bad-library/bad/data/awtenvelope.js', ['bad.AWTEnvelope'], ['goog.object'], false);
goog.addDependency('../../../bad-library/bad/data/mqttparse.js', ['bad.MqttParse', 'bad.MqttParse.replyCode'], ['bad.typeCheck'], false);
goog.addDependency('../../../bad-library/bad/math/bit.js', ['bad.math.bit', 'bad.math.buff'], [], false);
goog.addDependency('../../../bad-library/bad/net/mqttwsio.js', ['bad.MqttEvent', 'bad.MqttEventType', 'bad.MqttWsIo'], ['bad.MqttParse', 'bad.utils', 'goog.dom', 'goog.events.Event', 'goog.events.EventHandler', 'goog.events.EventTarget', 'goog.format.JsonPrettyPrinter', 'goog.json', 'goog.net.WebSocket'], false);
goog.addDependency('../../../bad-library/bad/net/net.js', ['bad.Net'], ['goog.Uri', 'goog.net.XhrIo'], false);
goog.addDependency('../../../bad-library/bad/ui/component.js', ['bad.ActionEvent', 'bad.ui.Component'], ['bad.ui.EventType', 'goog.events.Event', 'goog.style', 'goog.ui.Component'], false);
goog.addDependency('../../../bad-library/bad/ui/form.js', ['bad.ui.Form'], ['bad.ui.Panel', 'bad.utils', 'goog.dom', 'goog.dom.classes', 'goog.dom.forms', 'goog.events.EventType', 'goog.object', 'goog.uri.utils'], false);
goog.addDependency('../../../bad-library/bad/ui/layout.js', ['bad.ui.Layout', 'bad.ui.Layout.CssClassMap', 'bad.ui.Layout.IdFragment'], ['bad.CssPrefix', 'bad.ui.Component', 'bad.ui.EventType', 'goog.array', 'goog.dom', 'goog.dom.TagName', 'goog.dom.ViewportSizeMonitor', 'goog.events.Event', 'goog.events.EventType', 'goog.fx.Animation', 'goog.fx.Dragger', 'goog.fx.Transition', 'goog.math.Box', 'goog.math.Rect', 'goog.math.Size', 'goog.object', 'goog.style', 'goog.ui.Component'], false);
goog.addDependency('../../../bad-library/bad/ui/panel.js', ['bad.ui.Panel'], ['bad.CssClassMap', 'bad.ui.Component', 'goog.array', 'goog.dom', 'goog.dom.TagName'], false);
goog.addDependency('../../../bad-library/bad/ui/renderers/flatbuttonrenderer.js', ['bad.ui.FlatButtonRenderer'], ['goog.ui.Css3ButtonRenderer'], false);
goog.addDependency('../../../bad-library/bad/ui/renderers/menubuttonrenderer.js', ['bad.ui.MenuButtonRenderer'], ['goog.ui.Css3MenuButtonRenderer'], false);
goog.addDependency('../../../bad-library/bad/ui/renderers/menuflatrenderer.js', ['bad.ui.MenuFlatRenderer'], ['goog.ui.MenuRenderer'], false);
goog.addDependency('../../../bad-library/bad/ui/renderers/menufloatingrenderer.js', ['bad.ui.MenuFloatRenderer'], ['goog.ui.MenuRenderer'], false);
goog.addDependency('../../../bad-library/bad/ui/renderers/menuitemrenderer.js', ['bad.ui.MenuItemRenderer'], ['goog.ui.MenuItemRenderer'], false);
goog.addDependency('../../../bad-library/bad/ui/uieventtype.js', ['bad.ui.EventType', 'bad.ui.Resizable.EventType'], ['bad.utils'], false);
goog.addDependency('../../../bad-library/bad/ui/view.js', ['bad.ui.View', 'bad.ui.ViewEvent'], ['bad.ui.EventType', 'goog.events.Event', 'goog.events.EventHandler', 'goog.events.EventTarget', 'goog.object'], false);
goog.addDependency('../../../bad-library/bad/user/usermanager.js', ['bad.UserManager'], [], false);
goog.addDependency('../../../bad-library/bad/util/typecheck.js', ['bad.typeCheck'], [], false);
goog.addDependency('../../../bad-library/bad/util/utils.js', ['bad.utils'], ['bad.ui.FlatButtonRenderer', 'goog.array', 'goog.dom', 'goog.object', 'goog.string', 'goog.ui.Component', 'goog.ui.CustomButton', 'goog.ui.Menu', 'goog.ui.MenuItem', 'goog.ui.MenuSeparator', 'goog.ui.ToggleButton'], false);
goog.addDependency('../../../contracts/urlmap.js', ['contracts.urlMap'], [], false);
goog.addDependency('../../../drawme/base/components/topbarpanel.js', ['app.base.TopBarPanel'], ['app.base.EventType', 'bad.ui.MenuButtonRenderer', 'bad.ui.MenuFloatRenderer', 'bad.ui.MenuItemRenderer', 'bad.ui.Panel', 'bad.utils', 'contracts.urlMap', 'goog.Uri', 'goog.dom', 'goog.ui.MenuButton', 'goog.uri.utils'], false);
goog.addDependency('../../../drawme/base/components/viewmanager.js', ['app.base.ViewManager'], ['app.base.EventType', 'app.base.TopBarPanel', 'app.base.ViewEventType', 'app.base.view.Home', 'app.user.EventType', 'app.user.view.Account', 'app.user.view.Login', 'bad.UserManager', 'bad.ui.View', 'bad.utils', 'contracts.urlMap', 'goog.Uri', 'goog.array', 'goog.dom', 'goog.dom.classes', 'goog.object'], false);
goog.addDependency('../../../drawme/base/constants.js', ['app.base.EventType', 'app.base.ViewEventType'], ['bad.utils'], false);
goog.addDependency('../../../drawme/base/panels/canvas.js', ['app.base.panel.MainCanvas'], ['bad.ui.Panel', 'goog.array', 'goog.dom', 'goog.dom.classlist', 'goog.events.EventType', 'goog.fx.Dragger', 'goog.style', 'shapes.Circle', 'shapes.Rect'], false);
goog.addDependency('../../../drawme/base/panels/colorpanel.js', ['app.base.panel.ColorList'], ['app.base.EventType', 'bad.ui.Panel', 'goog.dom', 'goog.dom.dataset', 'goog.events.EventType', 'goog.string'], false);
goog.addDependency('../../../drawme/base/panels/picslistpanel.js', ['app.base.panel.PicsList'], ['app.base.EventType', 'bad.ui.Panel', 'bad.utils', 'goog.array', 'goog.dom', 'goog.dom.dataset'], false);
goog.addDependency('../../../drawme/base/panels/toolboxpanel.js', ['app.base.panel.ToolBox'], ['app.base.EventType', 'bad.ui.EventType', 'bad.ui.Panel', 'bad.utils', 'contracts.urlMap', 'goog.array', 'goog.dom', 'goog.style'], false);
goog.addDependency('../../../drawme/base/views/homeview.js', ['app.base.view.Home'], ['app.base.EventType', 'app.base.panel.ColorList', 'app.base.panel.MainCanvas', 'app.base.panel.PicsList', 'app.base.panel.ToolBox', 'bad.ui.EventType', 'bad.ui.View', 'contracts.urlMap', 'goog.Uri', 'goog.dom', 'goog.net.XhrIo', 'goog.style'], false);
goog.addDependency('../../../drawme/drawme.js', ['drawme'], ['bad.Net', 'drawme.Site', 'goog.net.XhrManager'], false);
goog.addDependency('../../../drawme/shapes/circles.js', ['shapes.Circle'], ['shapes.Rect'], false);
goog.addDependency('../../../drawme/shapes/rects.js', ['shapes.Rect'], [], false);
goog.addDependency('../../../drawme/site.js', ['drawme.Site'], ['app.base.ViewManager', 'bad.ui.Layout', 'contracts.urlMap', 'goog.Uri', 'goog.dom', 'goog.events.EventHandler'], false);
goog.addDependency('../../../drawme/user/constants.js', ['app.user.EventType'], ['bad.utils'], false);
goog.addDependency('../../../drawme/user/panels/deleteaccountform.js', ['app.user.panel.DeleteAccount'], ['app.user.EventType', 'bad.ui.Form', 'bad.utils', 'contracts.urlMap', 'goog.dom.forms', 'goog.uri.utils'], false);
goog.addDependency('../../../drawme/user/panels/loginform.js', ['app.user.panel.Login'], ['app.user.EventType', 'bad.ui.Form', 'bad.utils', 'goog.dom', 'goog.events.EventType'], false);
goog.addDependency('../../../drawme/user/panels/lostpasswordform.js', ['app.user.panel.LostPassword'], ['app.user.EventType', 'bad.ui.Form', 'bad.utils'], false);
goog.addDependency('../../../drawme/user/panels/resetpasswordform.js', ['app.user.panel.ResetPassword'], ['app.user.EventType', 'app.user.panel.SignUp', 'contracts.urlMap', 'goog.Uri', 'goog.dom'], false);
goog.addDependency('../../../drawme/user/panels/signupform.js', ['app.user.panel.SignUp'], ['app.user.EventType', 'bad.ui.Form', 'bad.utils', 'goog.dom', 'goog.dom.forms', 'goog.uri.utils'], false);
goog.addDependency('../../../drawme/user/views/account.js', ['app.user.view.Account'], ['app.base.ViewEventType', 'app.user.EventType', 'app.user.panel.DeleteAccount', 'bad.ui.View', 'bad.ui.ViewEvent', 'contracts.urlMap', 'goog.Uri'], false);
goog.addDependency('../../../drawme/user/views/loginview.js', ['app.user.view.Login'], ['app.base.ViewEventType', 'app.user.EventType', 'app.user.panel.Login', 'app.user.panel.LostPassword', 'app.user.panel.ResetPassword', 'app.user.panel.SignUp', 'bad.ui.EventType', 'bad.ui.Panel', 'bad.ui.View', 'bad.ui.ViewEvent', 'bad.utils', 'contracts.urlMap', 'goog.Uri'], false);
