package com.neonyilan.game;

import android.annotation.SuppressLint;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.core.view.WindowInsetsControllerCompat;

public class MainActivity extends AppCompatActivity {
    private WebView webView;

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Layout setContentView önce çağrılmalıdır ki DecorView null olmasın
        setContentView(R.layout.activity_main);

        // Güvenli Tam Ekran (System UI Gizleme)
        hideSystemUI();

        webView = findViewById(R.id.gameWebView);
        if (webView != null) {
            WebSettings settings = webView.getSettings();
            settings.setJavaScriptEnabled(true);
            settings.setDomStorageEnabled(true);
            settings.setDatabaseEnabled(true);
            settings.setAllowFileAccess(true);
            settings.setAllowContentAccess(true);
            settings.setAllowFileAccessFromFileURLs(true);
            settings.setAllowUniversalAccessFromFileURLs(true);
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                settings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
            }
            settings.setUseWideViewPort(true);
            settings.setLoadWithOverviewMode(true);
            settings.setMediaPlaybackRequiresUserGesture(false);

            // Donanım hızlandırma ve arka plan (LAYER_TYPE_NONE: Chromium dahili GPU kompozitörünü tam performans kullanır)
            webView.setLayerType(View.LAYER_TYPE_NONE, null);
            webView.setBackgroundColor(0xFF170D2C);

            WebView.setWebContentsDebuggingEnabled(true);

            webView.setWebViewClient(new WebViewClient() {
                @Override
                public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                    if (request != null && request.getUrl() != null) {
                        WebResourceResponse response = handleAssetIntercept(request.getUrl());
                        if (response != null) return response;
                    }
                    return super.shouldInterceptRequest(view, request);
                }

                @SuppressWarnings("deprecation")
                @Override
                public WebResourceResponse shouldInterceptRequest(WebView view, String url) {
                    if (url != null) {
                        WebResourceResponse response = handleAssetIntercept(Uri.parse(url));
                        if (response != null) return response;
                    }
                    return super.shouldInterceptRequest(view, url);
                }

                private WebResourceResponse handleAssetIntercept(Uri uri) {
                    if (uri == null) return null;
                    String urlStr = uri.toString();
                    // Yalnızca sorgu (?) veya çapa (#) içeren file:///android_asset/ isteklerini yakala ve temizle
                    if (urlStr.startsWith("file:///android_asset/") && (urlStr.indexOf('?') != -1 || urlStr.indexOf('#') != -1)) {
                        String assetPath = urlStr.substring("file:///android_asset/".length());
                        int queryIdx = assetPath.indexOf('?');
                        if (queryIdx != -1) {
                            assetPath = assetPath.substring(0, queryIdx);
                        }
                        int hashIdx = assetPath.indexOf('#');
                        if (hashIdx != -1) {
                            assetPath = assetPath.substring(0, hashIdx);
                        }
                        try {
                            String mimeType = "text/plain";
                            String encoding = "UTF-8";
                            if (assetPath.endsWith(".html")) mimeType = "text/html";
                            else if (assetPath.endsWith(".js")) mimeType = "application/javascript";
                            else if (assetPath.endsWith(".css")) mimeType = "text/css";
                            else if (assetPath.endsWith(".png")) { mimeType = "image/png"; encoding = null; }
                            else if (assetPath.endsWith(".jpg") || assetPath.endsWith(".jpeg")) { mimeType = "image/jpeg"; encoding = null; }
                            else if (assetPath.endsWith(".json")) mimeType = "application/json";
                            java.io.InputStream is = getAssets().open(assetPath);
                            return new WebResourceResponse(mimeType, encoding, is);
                        } catch (Exception ignored) {}
                    }
                    return null;
                }

                @Override
                public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                    if (request != null && request.getUrl() != null) {
                        return handleUrl(request.getUrl().toString());
                    }
                    return false;
                }

                @SuppressWarnings("deprecation")
                @Override
                public boolean shouldOverrideUrlLoading(WebView view, String url) {
                    return handleUrl(url);
                }

                private boolean handleUrl(String url) {
                    if (url == null || url.startsWith("file:///android_asset/")) {
                        return false;
                    }
                    try {
                        Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                        startActivity(intent);
                        return true;
                    } catch (Exception e) {
                        return false;
                    }
                }
            });
            webView.setWebChromeClient(new WebChromeClient() {
                @Override
                public void onPermissionRequest(final android.webkit.PermissionRequest request) {
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                        request.grant(request.getResources());
                    }
                }

                @Override
                public boolean onConsoleMessage(android.webkit.ConsoleMessage consoleMessage) {
                    android.util.Log.d("WormArenaJS", consoleMessage.message() + " [" + consoleMessage.sourceId() + ":" + consoleMessage.lineNumber() + "]");
                    return true;
                }
            });

            // Telefonun kendi yerel sistem paylaşım arayüzünü (Bottom Sheet) bağla
            webView.addJavascriptInterface(new WebAppInterface(this), "AndroidApp");

            // Dahili assets klasöründen index.html'i yükle
            webView.loadUrl("file:///android_asset/index.html");
        }
    }

    private void hideSystemUI() {
        try {
            if (getWindow() == null) return;
            View decorView = getWindow().getDecorView();
            if (decorView == null) return;

            WindowInsetsControllerCompat controller = 
                WindowCompat.getInsetsController(getWindow(), decorView);
            if (controller != null) {
                controller.hide(WindowInsetsCompat.Type.systemBars());
                controller.setSystemBarsBehavior(
                    WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
                );
            }
        } catch (Exception ignored) {
            try {
                if (getWindow() != null && getWindow().getDecorView() != null) {
                    getWindow().getDecorView().setSystemUiVisibility(
                        View.SYSTEM_UI_FLAG_FULLSCREEN
                        | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                        | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
                        | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                        | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                        | View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                    );
                }
            } catch (Exception ignored2) {}
        }
    }

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        if (hasFocus) {
            hideSystemUI();
        }
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (webView != null) {
            webView.onResume();
        }
        hideSystemUI();
    }

    @Override
    protected void onPause() {
        super.onPause();
        if (webView != null) {
            webView.onPause();
        }
    }

    @Override
    public void onBackPressed() {
        if (webView != null && webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }

    // JavaScript'ten çağrılabilen Yerel Android Sistem Paylaşım Arayüzü (Native Share Sheet)
    public static class WebAppInterface {
        private final Context mContext;

        public WebAppInterface(Context c) {
            mContext = c;
        }

        @JavascriptInterface
        public void shareRoomLink(String roomCode, String url) {
            try {
                Intent sendIntent = new Intent();
                sendIntent.setAction(Intent.ACTION_SEND);
                sendIntent.putExtra(Intent.EXTRA_SUBJECT, "Worm Arena - Room Invite");
                sendIntent.putExtra(Intent.EXTRA_TEXT, "🎮 You're invited to my Worm Arena room!\nRoom Code: " + roomCode + "\nJoin the battle with one click 👇\n" + url);
                sendIntent.setType("text/plain");

                Intent shareIntent = Intent.createChooser(sendIntent, "Share Room With Friends");
                shareIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                mContext.startActivity(shareIntent);
            } catch (Exception e) {
                android.util.Log.e("WormArenaShare", "Share failed", e);
            }
        }
    }
}
