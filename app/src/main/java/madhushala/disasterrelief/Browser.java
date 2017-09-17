package madhushala.disasterrelief;

import android.os.Build;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.view.View;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

public class Browser extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // Get Url Passed to this activity intent
        String url = getIntent().getStringExtra("url");


        setContentView(R.layout.activity_browser);
        WebView wv = (WebView) findViewById(R.id.browserwv);


        // for better webview performance
        wv.setWebViewClient(new webCont());
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
            // chromium, enable hardware acceleration
            wv.setLayerType(View.LAYER_TYPE_HARDWARE, null);
        } else {
            // older android version, disable hardware acceleration
            wv.setLayerType(View.LAYER_TYPE_SOFTWARE, null);
        }
        wv.getSettings().setRenderPriority(WebSettings.RenderPriority.HIGH);

        //all set now lets load the webview
        wv.loadUrl("http://ioe.edu.np");
    }



    class webCont extends WebViewClient
    {
        //additional webview settings


            }
}
